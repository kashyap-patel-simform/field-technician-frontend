export const ROUTES = {
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",
  DASHBOARD: "/dashboard",
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:jobId",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  HOME: "/",
} as const;

export function getJobDetailsPath(jobId: string): string {
  return `/jobs/${jobId}`;
}

export const APP_CONFIG = {
  APP_NAME: "Field Service",
  APP_VERSION: "1.0.0",
} as const;

export const PWA_MESSAGES = {
  DOWNLOAD_APP: "Download App",
} as const;
