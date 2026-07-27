export const SYNC_CONSTANTS = {
  MAX_RETRIES: 5,
  BACKOFF_BASE_MS: 2000,
  BACKOFF_MAX_MS: 5 * 60 * 1000,
} as const;
