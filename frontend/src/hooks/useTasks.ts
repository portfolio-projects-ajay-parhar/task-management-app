import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { tasksApi } from "../api/tasks.api";
import {
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  ApiResponse,
} from "../types";
import toast from "react-hot-toast";

export const TASKS_KEY = "tasks";
export const STATS_KEY = "task-stats";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    return data?.message || fallback;
  }
  return fallback;
};

export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => tasksApi.getAll(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: () => tasksApi.getStats(),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success("Task created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to create task."));
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      tasksApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success("Task updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update task."));
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success("Task deleted.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete task."));
    },
  });
};
