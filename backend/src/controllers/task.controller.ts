import { Response } from "express";
import { Prisma, Task, TaskStatus, Priority } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const validSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "priority",
      "title",
    ];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const orderByDirection = sortOrder === "asc" ? "asc" : "desc";

    const filters: Prisma.Sql[] = [Prisma.sql`"userId" = ${userId}`];

    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      filters.push(Prisma.sql`status = ${status}::"TaskStatus"`);
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      filters.push(Prisma.sql`priority = ${priority}::"Priority"`);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      filters.push(
        Prisma.sql`(title ILIKE ${term} OR description ILIKE ${term})`
      );
    }

    const rows = await prisma.$queryRaw<(Task & { total_count: number })[]>`
      SELECT *, COUNT(*) OVER()::int AS total_count
      FROM tasks
      WHERE ${Prisma.join(filters, " AND ")}
      ORDER BY ${Prisma.raw(`"${orderByField}" ${orderByDirection} NULLS LAST`)}
      LIMIT ${limitNum} OFFSET ${skip}
    `;

    const totalCount = rows[0]?.total_count ?? 0;
    const tasks = rows.map(({ total_count: _total, ...task }) => task);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks." });
  }
};

export const getTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch task." });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || TaskStatus.TODO,
        priority: priority || Priority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Failed to create task." });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { title, description, status, priority, dueDate } = req.body;

    const sets: Prisma.Sql[] = [Prisma.sql`"updatedAt" = CURRENT_TIMESTAMP`];
    if (title !== undefined) sets.push(Prisma.sql`title = ${title.trim()}`);
    if (description !== undefined) {
      sets.push(Prisma.sql`description = ${description?.trim() || null}`);
    }
    if (status !== undefined) {
      sets.push(Prisma.sql`status = ${status}::"TaskStatus"`);
    }
    if (priority !== undefined) {
      sets.push(Prisma.sql`priority = ${priority}::"Priority"`);
    }
    if (dueDate !== undefined) {
      sets.push(
        Prisma.sql`"dueDate" = ${dueDate ? new Date(dueDate) : null}`
      );
    }

    const [task] = await prisma.$queryRaw<Task[]>`
      UPDATE tasks
      SET ${Prisma.join(sets)}
      WHERE id = ${id} AND "userId" = ${userId}
      RETURNING *
    `;

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: { task },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Failed to update task." });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const deleted = await prisma.task.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Failed to delete task." });
  }
};

export const getTaskStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [row] = await prisma.$queryRaw<
      {
        total: number;
        todo: number;
        in_progress: number;
        done: number;
        low: number;
        medium: number;
        high: number;
        overdue: number;
      }[]
    >`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'TODO')::int AS todo,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int AS in_progress,
        COUNT(*) FILTER (WHERE status = 'DONE')::int AS done,
        COUNT(*) FILTER (WHERE priority = 'LOW')::int AS low,
        COUNT(*) FILTER (WHERE priority = 'MEDIUM')::int AS medium,
        COUNT(*) FILTER (WHERE priority = 'HIGH')::int AS high,
        COUNT(*) FILTER (
          WHERE "dueDate" IS NOT NULL
            AND "dueDate" < ${new Date()}
            AND status <> 'DONE'
        )::int AS overdue
      FROM tasks
      WHERE "userId" = ${userId}
    `;

    const stats = {
      byStatus: {
        TODO: row?.todo ?? 0,
        IN_PROGRESS: row?.in_progress ?? 0,
        DONE: row?.done ?? 0,
      },
      byPriority: {
        LOW: row?.low ?? 0,
        MEDIUM: row?.medium ?? 0,
        HIGH: row?.high ?? 0,
      },
      overdue: row?.overdue ?? 0,
      total: row?.total ?? 0,
    };

    res.status(200).json({ success: true, data: { stats } });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};
