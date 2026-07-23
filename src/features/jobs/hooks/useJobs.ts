import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchJobs } from '@/features/jobs/api/jobs.api'

export function useJobs() {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS,
    queryFn: fetchJobs,
  })
}
