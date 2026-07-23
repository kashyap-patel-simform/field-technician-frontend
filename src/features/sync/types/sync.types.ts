export const SyncStatus = {
  SYNCED: 'SYNCED',
  SYNCING: 'SYNCING',
  PENDING: 'PENDING',
  ERROR: 'ERROR',
} as const

export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus]

export interface SyncState {
  status: SyncStatus
  pendingCount: number
  lastSyncedAt: number | null
}
