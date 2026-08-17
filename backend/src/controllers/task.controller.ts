import { Response } from "express";
import { Prisma, TaskStatus, Priority } from "@prisma/client";
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

    const where: Prisma.TaskWhereInput = { userId };

    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      where.status = status as TaskStatus;
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      where.priority = priority as Priority;
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

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

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { [orderByField]: orderByDirection },
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

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

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    const { title, description, status, priority, dueDate } = req.body;

    const updateData: Prisma.TaskUpdateInput = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

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

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    await prisma.task.delete({ where: { id } });

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

    const [statusCounts, priorityCounts, overdueTasks] = await Promise.all([
      prisma.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
      prisma.task.groupBy({
        by: ["priority"],
        where: { userId },
        _count: true,
      }),
      prisma.task.count({
        where: {
          userId,
          dueDate: { lt: new Date() },
          status: { not: TaskStatus.DONE },
        },
      }),
    ]);

    const stats = {
      byStatus: {
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0,
        ...Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
      },
      byPriority: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        ...Object.fromEntries(
          priorityCounts.map((p) => [p.priority, p._count])
        ),
      },
      overdue: overdueTasks,
      total: statusCounts.reduce((sum, s) => sum + s._count, 0),
    };

    res.status(200).json({ success: true, data: { stats } });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};
