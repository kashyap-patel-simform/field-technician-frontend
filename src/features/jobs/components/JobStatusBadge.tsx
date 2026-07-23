import { Badge } from '@/components/ui/badge'
import { JOB_STATUS_CONFIG } from '@/constants'
import type { JobStatus } from '@/features/jobs/types/job.types'

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const { label, className } = JOB_STATUS_CONFIG[status]
  return <Badge className={className}>{label}</Badge>
}
