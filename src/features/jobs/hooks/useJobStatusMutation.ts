import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import type { Job, JobDetail } from "@/features/jobs/types/job.types";

export function useJobStatusMutation(
  jobId: string,
  mutationFn: (id: string) => Promise<Job>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mutationFn(jobId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOB(jobId) });
      const previous = queryClient.getQueryData<JobDetail>(
        QUERY_KEYS.JOB(jobId),
      );
      if (previous) {
        queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), {
          ...previous,
          isPendingSync: true,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.JOB(jobId), context.previous);
      }
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current ? { ...current, ...updatedJob } : (updatedJob as JobDetail),
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
    },
  });
}
