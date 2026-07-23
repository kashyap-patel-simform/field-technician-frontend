import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchJobsSummary } from '@/features/jobs/api/jobs.api'

export function useJobsSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS_SUMMARY,
    queryFn: fetchJobsSummary,
  })
}
