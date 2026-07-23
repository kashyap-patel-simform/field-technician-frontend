import { Badge } from '@/components/ui/badge'
import { JOB_PRIORITY_CONFIG } from '@/constants'
import type { JobPriority } from '@/features/jobs/types/job.types'

export function JobPriorityBadge({ priority }: { priority: JobPriority }) {
  const { label, className } = JOB_PRIORITY_CONFIG[priority]
  return <Badge className={className}>{label}</Badge>
}
