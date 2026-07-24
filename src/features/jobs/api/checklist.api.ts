import { API_CONSTANTS, ERROR_MESSAGES, MOCK_CHECKLIST_TEMPLATE } from '@/constants'
import type { ChecklistItem } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockChecklistStore = new Map<string, ChecklistItem[]>()

function getOrSeedChecklist(jobId: string): ChecklistItem[] {
  if (!mockChecklistStore.has(jobId)) {
    mockChecklistStore.set(
      jobId,
      MOCK_CHECKLIST_TEMPLATE.map((label, index) => ({
        id: `${jobId}-checklist-${index}`,
        jobId,
        label,
        isCompleted: false,
      })),
    )
  }
  return mockChecklistStore.get(jobId)!
}

export async function fetchChecklist(jobId: string): Promise<ChecklistItem[]> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return getOrSeedChecklist(jobId)
}

export async function toggleChecklistItem(
  jobId: string,
  itemId: string,
): Promise<ChecklistItem[]> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  const items = getOrSeedChecklist(jobId)
  const item = items.find((existing) => existing.id === itemId)
  if (!item) {
    throw new Error(ERROR_MESSAGES.CHECKLIST_ITEM_NOT_FOUND)
  }
  item.isCompleted = !item.isCompleted
  item.completedAt = item.isCompleted ? Date.now() : undefined
  return [...items]
}
