import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchJob } from "@/features/jobs/api/jobs.api";
import type { JobDetail } from "@/features/jobs/types/job.types";
import { getJobDetailFromDb, writeJobDetail } from "@/lib/db/hydrate";

// Cache-first job detail query. Notes/checklist/photos derive their slice
// from this same query (via `select`) instead of fetching independently,
// so they stay offline-safe and stay in sync with queued mutations.
export function useJobDetailQuery<TSelected = JobDetail>(
  jobId: string,
  select?: (job: JobDetail) => TSelected,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.JOB(jobId),
    queryFn: async () => {
      const cached = await getJobDetailFromDb(jobId);
      if (cached) {
        // A GET through the service worker's NetworkFirst cache "succeeds"
        // with a stale response when offline instead of rejecting, so an
        // offline background refresh would silently overwrite local,
        // not-yet-synced changes (e.g. a checklist toggle) with old data.
        if (navigator.onLine) {
          void fetchJob(jobId)
            .then(async (detail) => {
              await writeJobDetail(detail);
              const refreshed = await getJobDetailFromDb(jobId);
              queryClient.setQueryData(QUERY_KEYS.JOB(jobId), refreshed);
            })
            .catch(() => undefined);
        }
        return cached;
      }

      const fresh = await fetchJob(jobId);
      await writeJobDetail(fresh);
      return (await getJobDetailFromDb(jobId)) ?? fresh;
    },
    enabled: !!jobId,
    select,
  });
}

export function useJob(jobId: string) {
  return useJobDetailQuery(jobId);
}
