import { useJobDetailQuery } from "@/features/jobs/hooks/useJob";

export function useChecklist(jobId: string) {
  return useJobDetailQuery(jobId, (job) => job.checklistItems);
}
