import api from "./axios";
import { LoginPayload, RegisterPayload, User, ApiResponse } from "../types";

interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (
    payload: RegisterPayload
  ): Promise<ApiResponse<AuthData>> => {
    const res = await api.post<ApiResponse<AuthData>>(
      "/auth/register",
      payload
    );
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthData>> => {
    const res = await api.post<ApiResponse<AuthData>>("/auth/login", payload);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return res.data;
  },
};
