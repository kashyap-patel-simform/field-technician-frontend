export const OutboxStatus = {
  PENDING: "PENDING",
  SYNCING: "SYNCING",
  FAILED: "FAILED",
} as const;

export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus];

export const OutboxEntityType = {
  NOTE: "note",
  PHOTO: "photo",
  CHECKLIST_ITEM: "checklistItem",
  SIGNATURE: "signature",
  JOB_ACTION: "jobAction",
} as const;

export type OutboxEntityType =
  (typeof OutboxEntityType)[keyof typeof OutboxEntityType];

export interface OutboxItem {
  localId: string;
  entityType: OutboxEntityType;
  jobId: string;
  endpoint: string;
  method: "POST" | "PATCH";
  payload: unknown;
  localEntityId: string;
  status: OutboxStatus;
  retryCount: number;
  nextRetryAt: number;
  lastError?: string;
  createdAt: number;
}
