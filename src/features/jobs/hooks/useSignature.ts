import { useJobDetailQuery } from "@/features/jobs/hooks/useJob";

export function useSignature(jobId: string) {
  return useJobDetailQuery(jobId, (job) => job.signature);
}
