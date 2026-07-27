import type { Table } from "dexie";
import { db, type PhotoRow } from "@/lib/db/db";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import type {
  Job,
  JobDetail,
  JobNote,
  JobsSummary,
} from "@/features/jobs/types/job.types";

async function getPendingEntityIds(jobId: string): Promise<Set<string>> {
  const items = await db.outbox.where("jobId").equals(jobId).toArray();
  return new Set(items.map((item) => item.localEntityId));
}

async function hasPendingEntity(
  jobId: string,
  entityType: string,
): Promise<boolean> {
  const count = await db.outbox
    .where("jobId")
    .equals(jobId)
    .filter((item) => item.entityType === entityType)
    .count();
  return count > 0;
}

async function upsertPreservingPending<T extends { id: string; jobId: string }>(
  table: Table<T, string>,
  jobId: string,
  serverRows: T[],
  pendingIds: Set<string>,
): Promise<void> {
  const existing = await table.where("jobId").equals(jobId).toArray();
  const serverIds = new Set(serverRows.map((row) => row.id));
  const staleIds = existing
    .map((row) => row.id)
    .filter((id) => !serverIds.has(id) && !pendingIds.has(id));
  if (staleIds.length) {
    await table.bulkDelete(staleIds);
  }
  if (serverRows.length) {
    await table.bulkPut(serverRows);
  }
}

function toJobPhoto(row: PhotoRow) {
  if (row.blob) {
    return { ...row, previewUrl: URL.createObjectURL(row.blob) };
  }
  return row;
}

export async function getJobsFromDb(): Promise<Job[]> {
  return db.jobs.toArray();
}

export async function writeJobs(jobs: Job[]): Promise<void> {
  const pendingJobIds = new Set(
    (
      await db.outbox
        .where("entityType")
        .equals(OutboxEntityType.JOB_ACTION)
        .toArray()
    ).map((item) => item.jobId),
  );
  const toWrite = jobs.filter((job) => !pendingJobIds.has(job.id));
  if (toWrite.length) {
    await db.jobs.bulkPut(toWrite);
  }
}

export async function getJobDetailFromDb(
  jobId: string,
): Promise<JobDetail | undefined> {
  const job = await db.jobs.get(jobId);
  if (!job) return undefined;

  const [checklistItems, notes, photoRows, signature] = await Promise.all([
    db.checklistItems.where("jobId").equals(jobId).toArray(),
    db.notes.where("jobId").equals(jobId).toArray(),
    db.photos.where("jobId").equals(jobId).toArray(),
    db.signatures.get(jobId),
  ]);

  return {
    ...job,
    checklistItems,
    notes: notes.sort((a, b) => b.createdAt - a.createdAt),
    photos: photoRows
      .sort((a, b) => b.capturedAt - a.capturedAt)
      .map(toJobPhoto),
    signature: signature ?? null,
  };
}

export async function writeJobDetail(detail: JobDetail): Promise<void> {
  const { checklistItems, notes, photos, signature, ...job } = detail;
  const pendingIds = await getPendingEntityIds(job.id);
  const hasPendingJobAction = await hasPendingEntity(
    job.id,
    OutboxEntityType.JOB_ACTION,
  );
  const hasPendingSignature = await hasPendingEntity(
    job.id,
    OutboxEntityType.SIGNATURE,
  );

  await db.transaction(
    "rw",
    [db.jobs, db.checklistItems, db.notes, db.photos, db.signatures],
    async () => {
      if (!hasPendingJobAction) {
        await db.jobs.put(job);
      }
      await upsertPreservingPending(
        db.checklistItems,
        job.id,
        checklistItems,
        pendingIds,
      );
      await upsertPreservingPending<JobNote & { jobId: string }>(
        db.notes,
        job.id,
        notes,
        pendingIds,
      );
      await upsertPreservingPending<PhotoRow>(
        db.photos,
        job.id,
        photos,
        pendingIds,
      );
      if (!hasPendingSignature) {
        if (signature) {
          await db.signatures.put(signature);
        } else {
          await db.signatures.delete(job.id);
        }
      }
    },
  );
}

export async function getJobsSummaryFromDb(): Promise<JobsSummary | undefined> {
  const row = await db.jobsSummary.get("singleton");
  if (!row) return undefined;
  const { id, ...summary } = row;
  void id;
  return summary;
}

export async function writeJobsSummary(summary: JobsSummary): Promise<void> {
  await db.jobsSummary.put({ id: "singleton", ...summary });
}
