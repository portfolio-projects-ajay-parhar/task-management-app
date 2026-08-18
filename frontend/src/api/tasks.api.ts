import api from "./axios";
import {
  Task,
  TaskListResponse,
  TaskStats,
  CreateTaskPayload,
  UpdateTaskPayload,
  ApiResponse,
  TaskFilters,
} from "../types";

export const tasksApi = {
  getAll: async (
    filters: TaskFilters = {}
  ): Promise<ApiResponse<TaskListResponse>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
    const res = await api.get<ApiResponse<TaskListResponse>>(
      `/tasks?${params.toString()}`
    );
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ task: Task }>> => {
    const res = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return res.data;
  },

  create: async (
    payload: CreateTaskPayload
  ): Promise<ApiResponse<{ task: Task }>> => {
    const res = await api.post<ApiResponse<{ task: Task }>>("/tasks", payload);
    return res.data;
  },

  update: async (
    id: string,
    payload: UpdateTaskPayload
  ): Promise<ApiResponse<{ task: Task }>> => {
    const res = await api.patch<ApiResponse<{ task: Task }>>(
      `/tasks/${id}`,
      payload
    );
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<{ stats: TaskStats }>> => {
    const res = await api.get<ApiResponse<{ stats: TaskStats }>>(
      "/tasks/stats"
    );
    return res.data;
  },
};
