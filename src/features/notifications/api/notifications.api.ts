import { API_ENDPOINTS } from "@/constants";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type { Notification } from "@/features/notifications/types/notification.types";
import type { ApiSuccessResponse } from "@/types/api.types";

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await httpClient.get<ApiSuccessResponse<Notification[]>>(
    API_ENDPOINTS.NOTIFICATIONS.LIST,
  );
  return unwrap(response);
}
