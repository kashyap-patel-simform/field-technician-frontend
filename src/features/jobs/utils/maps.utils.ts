import type { Job } from '@/features/jobs/types/job.types'

export function buildMapsUrl(job: Pick<Job, 'address'>): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`
}
