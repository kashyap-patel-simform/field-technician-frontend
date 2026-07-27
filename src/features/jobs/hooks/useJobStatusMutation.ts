import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { useQueuedMutation } from "@/features/sync/hooks/useQueuedMutation";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db } from "@/lib/db/db";
import type {
  Job,
  JobAction,
  JobDetail,
} from "@/features/jobs/types/job.types";

export function useJobStatusMutation(jobId: string, action: JobAction) {
  return useQueuedMutation<void, Job>({
    entityType: OutboxEntityType.JOB_ACTION,
    jobId,
    method: "POST",
    endpoint: () => API_ENDPOINTS.JOBS.ACTION(jobId, action),
    buildEntity: async () => {
      const existing = await db.jobs.get(jobId);
      if (!existing) {
        throw new Error("Job not found.");
      }
      return { ...existing, isPendingSync: true };
    },
    writeEntity: (job) => db.jobs.put(job),
    patchCache: (queryClient, job) => {
      queryClient.setQueryData<Job[]>(QUERY_KEYS.JOBS, (jobs) =>
        jobs?.map((existing) => (existing.id === jobId ? job : existing)),
      );
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current ? { ...current, isPendingSync: true } : current,
      );
    },
    buildPayload: () => ({ action }),
    localEntityId: () => jobId,
  });
}
