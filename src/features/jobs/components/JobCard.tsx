import { ChevronRight, Clock, CloudOff, MapPin, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { JOB_PRIORITY_CONFIG, getJobDetailsPath } from '@/constants'
import { JobPriorityBadge } from '@/features/jobs/components/JobPriorityBadge'
import { JobStatusBadge } from '@/features/jobs/components/JobStatusBadge'
import type { Job } from '@/features/jobs/types/job.types'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/string.utils'
import { formatScheduledTime } from '@/utils/time.utils'

export function JobCard({ job }: { job: Job }) {
  const priority = JOB_PRIORITY_CONFIG[job.priority]

  return (
    <Link to={getJobDetailsPath(job.id)} className="block">
      <Card className="overflow-hidden p-0 transition-shadow active:shadow-none">
        <CardContent className="flex gap-3 p-0">
          <div className={cn('w-1.5 shrink-0', priority.accentClassName)} />

          <div className="flex flex-1 flex-col gap-3 py-4 pr-4">
            <div className="flex items-start gap-3">
              <Avatar size="lg" className={priority.avatarClassName}>
                <AvatarFallback className={cn('font-semibold', priority.avatarClassName)}>
                  {getInitials(job.customerName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold leading-tight text-foreground">
                    {job.customerName}
                  </p>
                  {job.isPendingSync && (
                    <CloudOff className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{job.jobNumber}</p>
              </div>

              <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            </div>

            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span className="line-clamp-1">{job.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 shrink-0" />
                <span>{formatScheduledTime(job.scheduledAt)}</span>
              </div>
              {job.distanceKm !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Navigation className="size-4 shrink-0" />
                  <span>{job.distanceKm} km</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <JobPriorityBadge priority={job.priority} />
              <JobStatusBadge status={job.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
