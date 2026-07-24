import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchPhotos } from '@/features/jobs/api/photos.api'

export function usePhotos(jobId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PHOTOS(jobId),
    queryFn: () => fetchPhotos(jobId),
    enabled: !!jobId,
  })
}
