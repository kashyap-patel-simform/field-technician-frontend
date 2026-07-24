import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/lib/env";
import {
  clearAccessToken,
  getAccessToken,
  notifySessionExpired,
  setAccessToken,
} from "@/lib/http/token-store";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const response = await axios.post<
    ApiSuccessResponse<{ accessToken: string }>
  >(`${env.apiBaseUrl}/auth/refresh`, null, { withCredentials: true });
  const { accessToken } = response.data.data;
  setAccessToken(accessToken);
  return accessToken;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        originalRequest.headers.set("Authorization", `Bearer ${token}`);
        return httpClient(originalRequest);
      } catch {
        clearAccessToken();
        notifySessionExpired();
        return Promise.reject(
          new ApiRequestError("Session expired. Please log in again.", 401),
        );
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong.";
    const status = error.response?.status ?? 0;
    return Promise.reject(new ApiRequestError(message, status));
  },
);

export function unwrap<T>(response: AxiosResponse<ApiSuccessResponse<T>>): T {
  return response.data.data;
}
