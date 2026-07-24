import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { submitSignature } from '@/features/jobs/api/signature.api'

export function useSubmitSignature(jobId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dataUrl: string) => submitSignature(jobId, dataUrl),
    onSuccess: (signature) => {
      queryClient.setQueryData(QUERY_KEYS.SIGNATURE(jobId), signature)
    },
  })
}
