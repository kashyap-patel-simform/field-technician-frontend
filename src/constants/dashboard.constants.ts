export const DASHBOARD_CONFIG = {
  SYNC_INTERVAL_MS: 30000,
  LAST_SYNC_REFRESH_INTERVAL_MS: 60000,
} as const

export const DASHBOARD_SECTIONS = {
  STATUS: 'status',
  JOBS_SUMMARY: 'jobs_summary',
  SYNC_INFO: 'sync_info',
} as const
