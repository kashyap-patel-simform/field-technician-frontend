import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { useQueuedMutation } from "@/features/sync/hooks/useQueuedMutation";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db } from "@/lib/db/db";
import type { JobDetail, JobNote } from "@/features/jobs/types/job.types";

export function useAddNote(jobId: string) {
  return useQueuedMutation<string, JobNote>({
    entityType: OutboxEntityType.NOTE,
    jobId,
    method: "POST",
    endpoint: () => API_ENDPOINTS.JOBS.NOTES(jobId),
    buildEntity: (text) => ({
      id: `temp-${crypto.randomUUID()}`,
      jobId,
      text,
      createdAt: Date.now(),
      isPendingSync: true,
    }),
    writeEntity: (note) => db.notes.put(note),
    patchCache: (queryClient, note) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current ? { ...current, notes: [note, ...current.notes] } : current,
      );
    },
    buildPayload: (text) => ({ text }),
    localEntityId: (note) => note.id,
  });
}
