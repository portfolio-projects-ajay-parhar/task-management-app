import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskFiltersBar } from "../components/tasks/TaskFilters";
import { StatsBar } from "../components/tasks/StatsBar";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { TaskCardSkeleton } from "../components/ui/Skeleton";
import {
  Plus,
  LogOut,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { Task, TaskFilters, CreateTaskPayload } from "../types";

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 9,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isLoading, isError, isFetching } = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.data?.tasks || [];
  const pagination = data?.data?.pagination;
  const updatingId = updateTask.isPending ? updateTask.variables?.id : undefined;
  const isListRefreshing = isFetching && !isLoading;

  const handleCreate = (payload: CreateTaskPayload) => {
    createTask.mutate(payload, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (payload: CreateTaskPayload) => {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, payload },
      { onSuccess: () => setEditingTask(null) }
    );
  };

  const handleDeleteRequest = (id: string) => {
    const task = tasks.find((item) => item.id === id) || null;
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    deleteTask.mutate(deletingTask.id, {
      onSettled: () => setDeletingTask(null),
    });
  };

  const handleCloseDeleteModal = () => {
    if (deleteTask.isPending) return;
    setDeletingTask(null);
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTask.mutate({ id, payload: { status } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <CheckSquare size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user?.name}
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {pagination?.totalCount ?? 0} task
              {pagination?.totalCount !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="shrink-0"
          >
            <Plus size={18} />
            New Task
          </Button>
        </div>

        <StatsBar />

        <TaskFiltersBar filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-busy="true"
            aria-label="Loading tasks"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500">Failed to load tasks. Please refresh.</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={28} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
              {filters.search || filters.status || filters.priority
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus size={18} />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`relative ${isListRefreshing ? "opacity-60" : ""}`}
          >
            {isListRefreshing && (
              <div className="absolute inset-0 z-10 flex items-start justify-center pt-8 pointer-events-none">
                <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 shadow-sm">
                  <Loader2 size={14} className="animate-spin text-violet-500" />
                  Updating tasks…
                </span>
              </div>
            )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteRequest}
                onStatusChange={handleStatusChange}
                isDeleting={deletingTask?.id === task.id && deleteTask.isPending}
                isUpdating={updatingId === task.id}
              />
            ))}
          </div>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-4">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))
              }
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))
              }
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </main>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          isLoading={createTask.isPending}
          submitLabel="Create Task"
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            onSubmit={handleUpdate}
            isLoading={updateTask.isPending}
            initialData={editingTask}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingTask}
        onClose={handleCloseDeleteModal}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This will permanently remove the task. This action cannot be
                undone.
              </p>
              {deletingTask && (
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
                  {deletingTask.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseDeleteModal}
              disabled={deleteTask.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={deleteTask.isPending}
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
