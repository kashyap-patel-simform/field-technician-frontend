import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { useQueuedMutation } from "@/features/sync/hooks/useQueuedMutation";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db } from "@/lib/db/db";
import type { JobDetail, JobSignature } from "@/features/jobs/types/job.types";

export function useSubmitSignature(jobId: string) {
  return useQueuedMutation<string, JobSignature>({
    entityType: OutboxEntityType.SIGNATURE,
    jobId,
    method: "POST",
    endpoint: () => API_ENDPOINTS.JOBS.SIGNATURE(jobId),
    buildEntity: (dataUrl) => ({ jobId, dataUrl, capturedAt: Date.now() }),
    writeEntity: (signature) => db.signatures.put(signature),
    patchCache: (queryClient, signature) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current ? { ...current, signature } : current,
      );
    },
    buildPayload: (dataUrl) => ({ dataUrl }),
    localEntityId: () => jobId,
  });
}
