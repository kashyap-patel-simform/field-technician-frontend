import { API_CONSTANTS } from '@/constants'
import type { JobPhoto } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockPhotosStore = new Map<string, JobPhoto[]>()

export async function fetchPhotos(jobId: string): Promise<JobPhoto[]> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return mockPhotosStore.get(jobId) ?? []
}

export async function uploadPhoto(jobId: string, blob: Blob): Promise<JobPhoto> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  const photo: JobPhoto = {
    id: `${jobId}-photo-${Date.now()}`,
    jobId,
    previewUrl: URL.createObjectURL(blob),
    capturedAt: Date.now(),
    isPendingSync: false,
  }
  const photos = mockPhotosStore.get(jobId) ?? []
  mockPhotosStore.set(jobId, [photo, ...photos])
  return photo
}
