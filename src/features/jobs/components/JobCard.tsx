import {
  ChevronRight,
  Clock,
  CloudOff,
  MapPin,
  Navigation,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { JOB_PRIORITY_CONFIG, getJobDetailsPath } from "@/constants";
import { JobPriorityBadge } from "@/features/jobs/components/JobPriorityBadge";
import { JobStatusBadge } from "@/features/jobs/components/JobStatusBadge";
import type { Job } from "@/features/jobs/types/job.types";
import { cn } from "@/lib/utils";
import { formatScheduledTime } from "@/utils/time.utils";

export function JobCard({ job }: { job: Job }) {
  const priority = JOB_PRIORITY_CONFIG[job.priority];

  return (
    <Link to={getJobDetailsPath(job.id)} className="block">
      <Card className="gap-0 p-0 shadow-sm transition-all hover:shadow-md active:scale-[0.99] active:shadow-none">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  priority.accentClassName,
                )}
              />
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {job.jobNumber}
              </span>
              {job.isPendingSync && (
                <CloudOff className="size-3.5 shrink-0 text-muted-foreground" />
              )}
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          <p className="truncate text-base font-semibold leading-tight text-foreground">
            {job.customerName}
          </p>

          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span className="line-clamp-1">{job.address}</span>
          </div>

          <div className="flex items-center justify-between gap-2 border-t pt-3">
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

            <div className="flex items-center gap-1.5">
              <JobPriorityBadge priority={job.priority} />
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
