import { API_CONSTANTS } from '@/constants'
import type { JobsSummary } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchJobsSummary(): Promise<JobsSummary> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)

  return {
    totalAssigned: 12,
    dueToday: 4,
    highPriority: 3,
    pendingSync: 2,
  }
}
