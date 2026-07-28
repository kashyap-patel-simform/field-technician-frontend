import { QUERY_KEYS, API_ENDPOINTS, ERROR_MESSAGES } from "@/constants";
import { useQueuedMutation } from "@/features/sync/hooks/useQueuedMutation";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db } from "@/lib/db/db";
import type { ChecklistItem, JobDetail } from "@/features/jobs/types/job.types";

function toggle(item: ChecklistItem): ChecklistItem {
  const isCompleted = !item.isCompleted;
  return {
    ...item,
    isCompleted,
    completedAt: isCompleted ? Date.now() : undefined,
  };
}

export function useToggleChecklistItem(jobId: string) {
  return useQueuedMutation<string, ChecklistItem>({
    entityType: OutboxEntityType.CHECKLIST_ITEM,
    jobId,
    method: "PATCH",
    endpoint: (itemId) => API_ENDPOINTS.JOBS.CHECKLIST_ITEM(jobId, itemId),
    // Built synchronously from the query cache the checkbox already renders
    // from, so the tick appears in the same tick as the tap — online or off.
    // Falling back to Dexie only covers the case where the list isn't on
    // screen, which can't happen from a user tap.
    buildEntity: (itemId, queryClient) => {
      const cached = queryClient
        .getQueryData<JobDetail>(QUERY_KEYS.JOB(jobId))
        ?.checklistItems.find((item) => item.id === itemId);

      if (cached) return toggle(cached);

      return db.checklistItems.get(itemId).then((existing) => {
        if (!existing) {
          throw new Error(ERROR_MESSAGES.CHECKLIST_ITEM_NOT_FOUND);
        }
        return toggle(existing);
      });
    },
    writeEntity: (item) => db.checklistItems.put(item),
    patchCache: (queryClient, item) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current
          ? {
              ...current,
              checklistItems: current.checklistItems.map((existing) =>
                existing.id === item.id ? item : existing,
              ),
            }
          : current,
      );
    },
    buildPayload: () => ({}),
    localEntityId: (item) => item.id,
  });
}
