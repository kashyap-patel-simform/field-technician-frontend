import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchNotes } from '@/features/jobs/api/notes.api'

export function useNotes(jobId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTES(jobId),
    queryFn: () => fetchNotes(jobId),
    enabled: !!jobId,
  })
}
