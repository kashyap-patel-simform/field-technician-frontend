import { CheckCircle, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JOB_PRIORITY_CONFIG, getJobDetailsPath } from "@/constants";
import { JobPriorityBadge } from "@/features/jobs/components/JobPriorityBadge";
import { useJobStatusMutation } from "@/features/jobs/hooks/useJobStatusMutation";
import { JobAction, type Job } from "@/features/jobs/types/job.types";
import { cn } from "@/lib/utils";
import { formatScheduledTime } from "@/utils/time.utils";

export function JobNotificationCard({ job }: { job: Job }) {
  const priority = JOB_PRIORITY_CONFIG[job.priority];
  const acceptMutation = useJobStatusMutation(job.id, JobAction.ACCEPT);

  function handleAccept(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    acceptMutation.mutate();
  }

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
            </div>
            <JobPriorityBadge priority={job.priority} />
          </div>

          <p className="truncate text-base font-semibold leading-tight text-foreground">
            {job.customerName}
          </p>

          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span className="line-clamp-1">{job.address}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span>{formatScheduledTime(job.scheduledAt)}</span>
          </div>

          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={acceptMutation.isPending}
            onClick={handleAccept}
          >
            <CheckCircle className="size-4" />
            Accept Job
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
