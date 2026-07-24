import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { toggleChecklistItem } from '@/features/jobs/api/checklist.api'
import type { ChecklistItem } from '@/features/jobs/types/job.types'

export function useToggleChecklistItem(jobId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => toggleChecklistItem(jobId, itemId),
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CHECKLIST(jobId) })
      const previous = queryClient.getQueryData<ChecklistItem[]>(QUERY_KEYS.CHECKLIST(jobId))
      if (previous) {
        queryClient.setQueryData<ChecklistItem[]>(
          QUERY_KEYS.CHECKLIST(jobId),
          previous.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
          ),
        )
      }
      return { previous }
    },
    onError: (_error, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.CHECKLIST(jobId), context.previous)
      }
    },
    onSuccess: (items) => {
      queryClient.setQueryData(QUERY_KEYS.CHECKLIST(jobId), items)
    },
  })
}
