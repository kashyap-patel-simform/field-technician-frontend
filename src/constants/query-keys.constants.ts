export const QUERY_KEYS = {
  JOBS: ["jobs"] as const,
  JOB: (id: string) => ["job", id] as const,
  JOBS_SUMMARY: ["jobs", "summary"] as const,
  PROFILE: ["profile"] as const,
  NOTIFICATIONS: ["notifications"] as const,
  SYNC_STATUS: ["sync", "status"] as const,
} as const;
