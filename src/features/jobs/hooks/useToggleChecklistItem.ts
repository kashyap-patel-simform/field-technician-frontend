import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { useQueuedMutation } from "@/features/sync/hooks/useQueuedMutation";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db } from "@/lib/db/db";
import type { ChecklistItem, JobDetail } from "@/features/jobs/types/job.types";

export function useToggleChecklistItem(jobId: string) {
  return useQueuedMutation<string, ChecklistItem>({
    entityType: OutboxEntityType.CHECKLIST_ITEM,
    jobId,
    method: "PATCH",
    endpoint: (itemId) => API_ENDPOINTS.JOBS.CHECKLIST_ITEM(jobId, itemId),
    buildEntity: async (itemId) => {
      const existing = await db.checklistItems.get(itemId);
      if (!existing) {
        throw new Error("Checklist item not found.");
      }
      const isCompleted = !existing.isCompleted;
      return {
        ...existing,
        isCompleted,
        completedAt: isCompleted ? Date.now() : undefined,
      };
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
