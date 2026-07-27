import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchJobsSummary } from "@/features/jobs/api/jobs.api";
import { getJobsSummaryFromDb, writeJobsSummary } from "@/lib/db/hydrate";

export function useJobsSummary() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.JOBS_SUMMARY,
    queryFn: async () => {
      const cached = await getJobsSummaryFromDb();
      if (cached) {
        void fetchJobsSummary()
          .then(async (summary) => {
            await writeJobsSummary(summary);
            queryClient.setQueryData(QUERY_KEYS.JOBS_SUMMARY, summary);
          })
          .catch(() => undefined);
        return cached;
      }

      const fresh = await fetchJobsSummary();
      await writeJobsSummary(fresh);
      return fresh;
    },
  });
}
