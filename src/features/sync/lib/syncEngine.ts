import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, SYNC_CONSTANTS } from "@/constants";
import { db } from "@/lib/db/db";
import { getJobDetailFromDb, getJobsFromDb } from "@/lib/db/hydrate";
import { ApiRequestError } from "@/lib/http/http-client";
import { addNote } from "@/features/jobs/api/notes.api";
import { toggleChecklistItem } from "@/features/jobs/api/checklist.api";
import { submitSignature } from "@/features/jobs/api/signature.api";
import { uploadPhoto } from "@/features/jobs/api/photos.api";
import {
  acceptJob,
  completeJob,
  markArrived,
  startNavigation,
  startWork,
} from "@/features/jobs/api/jobs.api";
import type { Job, JobAction } from "@/features/jobs/types/job.types";
import {
  OutboxEntityType,
  OutboxStatus,
  type OutboxItem,
} from "@/features/sync/types/outbox.types";

const JOB_ACTION_FN: Record<JobAction, (id: string) => Promise<Job>> = {
  accept: acceptJob,
  navigate: startNavigation,
  arrive: markArrived,
  start: startWork,
  complete: completeJob,
};

let isDraining = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

// This is called whenever the user performs an action offline.
export async function enqueueOutboxItem(
  item: Omit<
    OutboxItem,
    "localId" | "status" | "retryCount" | "nextRetryAt" | "createdAt"
  >,
): Promise<void> {
  const now = Date.now();
  await db.outbox.put({
    ...item,
    localId: crypto.randomUUID(),
    status: OutboxStatus.PENDING,
    retryCount: 0,
    nextRetryAt: now,
    createdAt: now,
  });
}

// Calculates retry delay.
function backoffDelay(retryCount: number): number {
  return Math.min(
    SYNC_CONSTANTS.BACKOFF_MAX_MS,
    SYNC_CONSTANTS.BACKOFF_BASE_MS * 2 ** (retryCount - 1),
  );
}

function isNetworkError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 0;
}

// Simply converts any error into readable text.
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Sync failed.";
}

// Gets all pending items.
async function getNextOutboxItem(): Promise<OutboxItem | undefined> {
  const now = Date.now();
  const items = await db.outbox
    .where("status")
    .equals(OutboxStatus.PENDING)
    .and((item) => item.nextRetryAt <= now)
    .sortBy("createdAt");
  return items[0];
}

// This instantly refreshes the UI.
async function refreshCacheFromDb(
  queryClient: QueryClient,
  jobId: string,
): Promise<void> {
  const [jobs, detail] = await Promise.all([
    getJobsFromDb(),
    getJobDetailFromDb(jobId),
  ]);
  queryClient.setQueryData(QUERY_KEYS.JOBS, jobs);
  if (detail) {
    queryClient.setQueryData(QUERY_KEYS.JOB(jobId), detail);
  }
}

async function replayItem(item: OutboxItem): Promise<void> {
  switch (item.entityType) {
    case OutboxEntityType.NOTE: {
      const { text } = item.payload as { text: string };
      const note = await addNote(item.jobId, text);
      await db.notes.delete(item.localEntityId);
      await db.notes.put(note);
      return;
    }
    case OutboxEntityType.CHECKLIST_ITEM: {
      const updated = await toggleChecklistItem(item.jobId, item.localEntityId);
      await db.checklistItems.put(updated);
      return;
    }
    case OutboxEntityType.SIGNATURE: {
      const { dataUrl } = item.payload as { dataUrl: string };
      const signature = await submitSignature(item.jobId, dataUrl);
      await db.signatures.put(signature);
      return;
    }
    case OutboxEntityType.JOB_ACTION: {
      const { action } = item.payload as { action: JobAction };
      const updatedJob = await JOB_ACTION_FN[action](item.jobId);
      await db.jobs.put(updatedJob);
      return;
    }
    case OutboxEntityType.PHOTO: {
      const row = await db.photos.get(item.localEntityId);
      if (!row?.blob) {
        throw new Error("Missing local photo data for outbox item.");
      }
      const photo = await uploadPhoto(item.jobId, row.blob);
      await db.photos.delete(item.localEntityId);
      await db.photos.put(photo);
      return;
    }
  }
}

async function scheduleNextRetry(queryClient: QueryClient): Promise<void> {
  const pending = await db.outbox
    .where("status")
    .equals(OutboxStatus.PENDING)
    .toArray();
  if (!pending.length) return;

  const earliest = Math.min(...pending.map((item) => item.nextRetryAt));
  const delay = Math.max(0, earliest - Date.now());

  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    void drainOutbox(queryClient);
  }, delay);
}

export async function drainOutbox(queryClient: QueryClient): Promise<void> {
  if (isDraining || !navigator.onLine) return;
  isDraining = true;

  try {
    let item = await getNextOutboxItem();
    while (item) {
      await db.outbox.update(item.localId, { status: OutboxStatus.SYNCING });

      try {
        await replayItem(item);
        await db.outbox.delete(item.localId);
        await refreshCacheFromDb(queryClient, item.jobId);
      } catch (error) {
        if (isNetworkError(error)) {
          await db.outbox.update(item.localId, {
            status: OutboxStatus.PENDING,
          });
          break;
        }

        const retryCount = item.retryCount + 1;
        const failed = retryCount >= SYNC_CONSTANTS.MAX_RETRIES;
        await db.outbox.update(item.localId, {
          status: failed ? OutboxStatus.FAILED : OutboxStatus.PENDING,
          retryCount,
          nextRetryAt: failed
            ? item.nextRetryAt
            : Date.now() + backoffDelay(retryCount),
          lastError: errorMessage(error),
        });
      }

      item = await getNextOutboxItem();
    }

    await db.meta.put({ key: "lastSyncedAt", value: Date.now() });
    await scheduleNextRetry(queryClient);
  } finally {
    isDraining = false;
  }
}

export async function retryOutboxItem(
  queryClient: QueryClient,
  localId: string,
): Promise<void> {
  await db.outbox.update(localId, {
    status: OutboxStatus.PENDING,
    nextRetryAt: Date.now(),
  });
  void drainOutbox(queryClient);
}

export async function discardOutboxItem(localId: string): Promise<void> {
  await db.outbox.delete(localId);
}
