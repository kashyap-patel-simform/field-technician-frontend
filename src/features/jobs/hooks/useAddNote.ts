import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { addNote } from '@/features/jobs/api/notes.api'
import type { JobNote } from '@/features/jobs/types/job.types'

export function useAddNote(jobId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => addNote(jobId, text),
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTES(jobId) })
      const previous = queryClient.getQueryData<JobNote[]>(QUERY_KEYS.NOTES(jobId)) ?? []
      const optimisticNote: JobNote = {
        id: `temp-${Date.now()}`,
        jobId,
        text,
        createdAt: Date.now(),
        isPendingSync: true,
      }
      queryClient.setQueryData<JobNote[]>(QUERY_KEYS.NOTES(jobId), [optimisticNote, ...previous])
      return { previous, tempId: optimisticNote.id }
    },
    onError: (_error, _text, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.NOTES(jobId), context.previous)
      }
    },
    onSuccess: (note, _text, context) => {
      queryClient.setQueryData<JobNote[]>(QUERY_KEYS.NOTES(jobId), (current) =>
        (current ?? []).map((existing) => (existing.id === context?.tempId ? note : existing)),
      )
    },
  })
}
