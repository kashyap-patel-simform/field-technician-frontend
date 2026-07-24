import { API_CONSTANTS } from '@/constants'
import type { JobNote } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockNotesStore = new Map<string, JobNote[]>()

export async function fetchNotes(jobId: string): Promise<JobNote[]> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return mockNotesStore.get(jobId) ?? []
}

export async function addNote(jobId: string, text: string): Promise<JobNote> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  const note: JobNote = {
    id: `${jobId}-note-${Date.now()}`,
    jobId,
    text,
    createdAt: Date.now(),
    isPendingSync: false,
  }
  const notes = mockNotesStore.get(jobId) ?? []
  mockNotesStore.set(jobId, [note, ...notes])
  return note
}
