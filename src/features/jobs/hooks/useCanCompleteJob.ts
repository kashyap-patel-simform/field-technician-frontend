import { useChecklist } from '@/features/jobs/hooks/useChecklist'
import { useSignature } from '@/features/jobs/hooks/useSignature'

export function useCanCompleteJob(jobId: string) {
  const { data: signature } = useSignature(jobId)
  const { data: checklist } = useChecklist(jobId)

  const incompleteChecklistCount = checklist?.filter((item) => !item.isCompleted).length ?? 0
  const hasSignature = !!signature

  return { hasSignature, incompleteChecklistCount }
}
