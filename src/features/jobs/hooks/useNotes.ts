import { useJobDetailQuery } from "@/features/jobs/hooks/useJob";

export function useNotes(jobId: string) {
  return useJobDetailQuery(jobId, (job) => job.notes);
}
