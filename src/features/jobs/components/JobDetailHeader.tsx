import { ArrowLeft, Clock, MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JOB_PRIORITY_CONFIG } from "@/constants";
import { JobPriorityBadge } from "@/features/jobs/components/JobPriorityBadge";
import { JobStatusBadge } from "@/features/jobs/components/JobStatusBadge";
import { JobStatus, type Job } from "@/features/jobs/types/job.types";
import { buildMapsUrl } from "@/features/jobs/utils/maps.utils";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string.utils";
import { formatScheduledTime } from "@/utils/time.utils";

export function JobDetailHeader({ job }: { job: Job }) {
  const navigate = useNavigate();
  const priority = JOB_PRIORITY_CONFIG[job.priority];

  return (
    <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Back to jobs"
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        <ArrowLeft className="size-4" />
      </Button>

      <div className="flex items-start gap-3">
        <Avatar size="lg" className={priority.avatarClassName}>
          <AvatarFallback
            className={cn("font-semibold", priority.avatarClassName)}
          >
            {getInitials(job.customerName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="text-lg font-semibold leading-tight text-foreground">
            {job.customerName}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {job.jobNumber}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0" />
        <span>{job.address}</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-4 shrink-0" />
        <span>{formatScheduledTime(job.scheduledAt)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <JobPriorityBadge priority={job.priority} />
        <JobStatusBadge status={job.status} />
      </div>

      {job.status !== JobStatus.COMPLETED && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() =>
            window.open(buildMapsUrl(job), "_blank", "noopener,noreferrer")
          }
        >
          <Navigation className="size-4" />
          Get Directions
        </Button>
      )}
    </header>
  );
}
