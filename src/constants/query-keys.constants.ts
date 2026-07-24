export const QUERY_KEYS = {
  JOBS: ['jobs'] as const,
  JOB: (id: string) => ['job', id] as const,
  JOBS_SUMMARY: ['jobs', 'summary'] as const,
  NOTES: (jobId: string) => ['notes', jobId] as const,
  CHECKLIST: (jobId: string) => ['checklist', jobId] as const,
  PHOTOS: (jobId: string) => ['photos', jobId] as const,
  SIGNATURE: (jobId: string) => ['signature', jobId] as const,
  PROFILE: ['profile'] as const,
  NOTIFICATIONS: ['notifications'] as const,
  SYNC_STATUS: ['sync', 'status'] as const,
} as const
