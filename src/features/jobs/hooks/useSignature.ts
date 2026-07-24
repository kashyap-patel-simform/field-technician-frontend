import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchSignature } from '@/features/jobs/api/signature.api'

export function useSignature(jobId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SIGNATURE(jobId),
    queryFn: () => fetchSignature(jobId),
    enabled: !!jobId,
  })
}
