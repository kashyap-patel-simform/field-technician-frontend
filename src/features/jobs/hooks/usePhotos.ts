import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchJob } from "@/features/jobs/api/jobs.api";

export function usePhotos(jobId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.JOB(jobId),
    queryFn: () => fetchJob(jobId),
    enabled: !!jobId,
    select: (job) => job.photos,
  });
}
