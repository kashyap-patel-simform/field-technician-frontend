import Dexie, { type Table } from "dexie";
import type { OutboxItem } from "@/features/sync/types/outbox.types";
import type {
  ChecklistItem,
  Job,
  JobNote,
  JobPhoto,
  JobSignature,
  JobsSummary,
} from "@/features/jobs/types/job.types";
import type { Notification } from "@/features/notifications/types/notification.types";

export type PhotoRow = JobPhoto & { blob?: Blob };
export type JobsSummaryRow = JobsSummary & { id: "singleton" };
export type MetaRow = { key: string; value: unknown };

export class AppDatabase extends Dexie {
  jobs!: Table<Job, string>;
  checklistItems!: Table<ChecklistItem, string>;
  notes!: Table<JobNote, string>;
  photos!: Table<PhotoRow, string>;
  signatures!: Table<JobSignature, string>;
  jobsSummary!: Table<JobsSummaryRow, string>;
  outbox!: Table<OutboxItem, string>;
  meta!: Table<MetaRow, string>;
  notifications!: Table<Notification, string>;

  constructor() {
    super("field-service-db");
    this.version(1).stores({
      jobs: "id, status, scheduledAt",
      checklistItems: "id, jobId",
      notes: "id, jobId, createdAt",
      photos: "id, jobId, capturedAt",
      signatures: "jobId",
      jobsSummary: "id",
      outbox: "localId, createdAt, jobId, entityType, status",
      meta: "key",
    });
    this.version(2).stores({
      notifications: "id, createdAt, job.id",
    });
  }
}

export const db = new AppDatabase();
