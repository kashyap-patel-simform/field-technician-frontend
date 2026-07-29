export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: "/auth/otp/send",
    VERIFY_OTP: "/auth/otp/verify",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  JOBS: {
    LIST: "/jobs",
    SUMMARY: "/jobs/summary",
    DETAIL: (id: string) => `/jobs/${id}`,
    ACTION: (id: string, action: string) => `/jobs/${id}/actions/${action}`,
    CHECKLIST_ITEM: (id: string, itemId: string) =>
      `/jobs/${id}/checklist/${itemId}`,
    NOTES: (id: string) => `/jobs/${id}/notes`,
    PHOTOS: (id: string) => `/jobs/${id}/photos`,
    SIGNATURE: (id: string) => `/jobs/${id}/signature`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
  },
} as const;

export const ERROR_MESSAGES = {
  SEND_OTP_FAILED: "Unable to send OTP. Please try again.",
  VERIFY_OTP_FAILED: "Verification failed.",
  INVALID_OTP: "Invalid OTP. Please try again.",
  JOB_NOT_FOUND: "Job not found.",
  CHECKLIST_ITEM_NOT_FOUND: "Checklist item not found.",
  CHECKLIST_UPDATE_FAILED: "Couldn't update that item. Tap to try again.",
  NETWORK_ERROR: "Network error. Check your connection and try again.",
  SESSION_EXPIRED: "Session expired. Please log in again.",
} as const;
