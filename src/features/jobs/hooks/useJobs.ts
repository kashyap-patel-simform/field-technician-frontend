import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchJobs } from "@/features/jobs/api/jobs.api";
import { getJobsFromDb, writeJobs } from "@/lib/db/hydrate";

export function useJobs() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.JOBS,
    queryFn: async () => {
      const cached = await getJobsFromDb();
      if (cached.length > 0) {
        void fetchJobs()
          .then(async (jobs) => {
            await writeJobs(jobs);
            queryClient.setQueryData(QUERY_KEYS.JOBS, await getJobsFromDb());
          })
          .catch(() => undefined);
        return cached;
      }

      const fresh = await fetchJobs();
      await writeJobs(fresh);
      return getJobsFromDb();
    },
  });
}
