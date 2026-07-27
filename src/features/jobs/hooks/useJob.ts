import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchJob } from "@/features/jobs/api/jobs.api";
import { getJobDetailFromDb, writeJobDetail } from "@/lib/db/hydrate";

export function useJob(jobId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.JOB(jobId),
    queryFn: async () => {
      const cached = await getJobDetailFromDb(jobId);
      if (cached) {
        void fetchJob(jobId)
          .then(async (detail) => {
            await writeJobDetail(detail);
            const refreshed = await getJobDetailFromDb(jobId);
            queryClient.setQueryData(QUERY_KEYS.JOB(jobId), refreshed);
          })
          .catch(() => undefined);
        return cached;
      }

      const fresh = await fetchJob(jobId);
      await writeJobDetail(fresh);
      return (await getJobDetailFromDb(jobId)) ?? fresh;
    },
    enabled: !!jobId,
  });
}
