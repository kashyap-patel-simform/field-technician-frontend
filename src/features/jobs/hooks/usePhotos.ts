import { useJobDetailQuery } from "@/features/jobs/hooks/useJob";

export function usePhotos(jobId: string) {
  return useJobDetailQuery(jobId, (job) => job.photos);
}
