import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchChecklist } from '@/features/jobs/api/checklist.api'

export function useChecklist(jobId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CHECKLIST(jobId),
    queryFn: () => fetchChecklist(jobId),
    enabled: !!jobId,
  })
}
