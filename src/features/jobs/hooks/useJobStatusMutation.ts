import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import type { Job } from '@/features/jobs/types/job.types'

export function useJobStatusMutation(jobId: string, mutationFn: (id: string) => Promise<Job>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => mutationFn(jobId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOB(jobId) })
      const previous = queryClient.getQueryData<Job>(QUERY_KEYS.JOB(jobId))
      if (previous) {
        queryClient.setQueryData<Job>(QUERY_KEYS.JOB(jobId), {
          ...previous,
          isPendingSync: true,
        })
      }
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.JOB(jobId), context.previous)
      }
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(QUERY_KEYS.JOB(jobId), updatedJob)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS })
    },
  })
}
