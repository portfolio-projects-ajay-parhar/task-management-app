import { Task, TaskStatus } from "../../types";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Calendar, Edit2, Trash2, Clock, Loader2 } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdating,
}: TaskCardProps) => {
  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate)) &&
    task.status !== "DONE";

  const isDueToday =
    task.dueDate && isToday(new Date(task.dueDate)) && task.status !== "DONE";

  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "DONE",
    DONE: null,
  };

  const nextStatusLabel: Record<TaskStatus, string> = {
    TODO: "Start →",
    IN_PROGRESS: "Complete ✓",
    DONE: "",
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200 hover:shadow-md group
        ${task.status === "DONE" ? "opacity-75 border-gray-200 dark:border-gray-800" : "border-gray-200 dark:border-gray-800"}
        ${isOverdue ? "border-l-4 border-l-red-400" : ""}
        ${isDueToday ? "border-l-4 border-l-amber-400" : ""}
        ${isUpdating ? "opacity-70 pointer-events-none" : ""}
      `}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={`font-semibold text-gray-900 dark:text-gray-100 leading-snug flex-1 min-w-0 break-words ${
              task.status === "DONE" ? "line-through text-gray-400 dark:text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:text-violet-400 dark:hover:bg-violet-950 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-2 mb-4">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center justify-between gap-2 min-w-0">
          {task.dueDate ? (
            <div
              className={`flex items-center gap-1.5 text-xs min-w-0 ${
                isOverdue
                  ? "text-red-600 dark:text-red-400 font-medium"
                  : isDueToday
                    ? "text-amber-600 dark:text-amber-400 font-medium"
                    : "text-gray-400"
              }`}
            >
              {isOverdue ? <Clock size={12} className="shrink-0" /> : <Calendar size={12} className="shrink-0" />}
              <span className="truncate">
                {isOverdue ? "Overdue · " : isDueToday ? "Due today · " : "Due "}
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 dark:text-gray-600">No due date</span>
          )}

          {nextStatus[task.status] && (
            <button
              type="button"
              onClick={() => onStatusChange(task.id, nextStatus[task.status]!)}
              disabled={isUpdating}
              className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium shrink-0 disabled:opacity-50"
            >
              {isUpdating && <Loader2 size={12} className="animate-spin" />}
              {nextStatusLabel[task.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
