import { API_CONSTANTS } from '@/constants'
import type { JobSignature } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockSignatureStore = new Map<string, JobSignature>()

export async function fetchSignature(jobId: string): Promise<JobSignature | null> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return mockSignatureStore.get(jobId) ?? null
}

export async function submitSignature(jobId: string, dataUrl: string): Promise<JobSignature> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  const signature: JobSignature = { jobId, dataUrl, capturedAt: Date.now() }
  mockSignatureStore.set(jobId, signature)
  return signature
}
