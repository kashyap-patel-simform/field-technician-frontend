import { Button } from '@/components/ui/button'
import { JOB_STATUS_ACTION_CONFIG } from '@/constants'
import {
  acceptJob,
  completeJob,
  markArrived,
  startNavigation,
  startWork,
} from '@/features/jobs/api/jobs.api'
import { useCanCompleteJob } from '@/features/jobs/hooks/useCanCompleteJob'
import { useJobStatusMutation } from '@/features/jobs/hooks/useJobStatusMutation'
import { JobStatus, type Job } from '@/features/jobs/types/job.types'
import { buildMapsUrl } from '@/features/jobs/utils/maps.utils'

export function JobActionBar({ job }: { job: Job }) {
  const acceptMutation = useJobStatusMutation(job.id, acceptJob)
  const navigateMutation = useJobStatusMutation(job.id, startNavigation)
  const arrivedMutation = useJobStatusMutation(job.id, markArrived)
  const startWorkMutation = useJobStatusMutation(job.id, startWork)
  const completeMutation = useJobStatusMutation(job.id, completeJob)
  const { hasSignature, incompleteChecklistCount } = useCanCompleteJob(job.id)

  const actionConfig = JOB_STATUS_ACTION_CONFIG[job.status]
  if (!actionConfig) {
    return null
  }

  const { label, icon: Icon } = actionConfig
  const isComplete = job.status === JobStatus.IN_PROGRESS

  function handleClick() {
    switch (job.status) {
      case JobStatus.ASSIGNED:
        acceptMutation.mutate()
        return
      case JobStatus.ACCEPTED:
        window.open(buildMapsUrl(job), '_blank', 'noopener,noreferrer')
        navigateMutation.mutate()
        return
      case JobStatus.EN_ROUTE:
        arrivedMutation.mutate()
        return
      case JobStatus.ARRIVED:
        startWorkMutation.mutate()
        return
      case JobStatus.IN_PROGRESS: {
        if (incompleteChecklistCount > 0) {
          const proceed = window.confirm(
            `${incompleteChecklistCount} checklist item(s) incomplete. Complete anyway?`,
          )
          if (!proceed) return
        }
        completeMutation.mutate()
        return
      }
      default:
        return
    }
  }

  const isDisabled = isComplete && !hasSignature
  const isPending =
    acceptMutation.isPending ||
    navigateMutation.isPending ||
    arrivedMutation.isPending ||
    startWorkMutation.isPending ||
    completeMutation.isPending

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t bg-background px-6 py-4">
      {isComplete && isDisabled && (
        <p className="mb-2 text-center text-xs text-muted-foreground">
          Capture customer signature to complete
        </p>
      )}
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isDisabled || isPending}
        onClick={handleClick}
      >
        <Icon className="size-4" />
        {label}
      </Button>
    </div>
  )
}
