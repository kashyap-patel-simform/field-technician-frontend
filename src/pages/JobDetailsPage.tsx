import { AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { JobActionBar } from "@/features/jobs/components/JobActionBar";
import { JobChecklist } from "@/features/jobs/components/JobChecklist";
import { JobDetailHeader } from "@/features/jobs/components/JobDetailHeader";
import { JobNotes } from "@/features/jobs/components/JobNotes";
import { JobPhotos } from "@/features/jobs/components/JobPhotos";
import { JobSignaturePad } from "@/features/jobs/components/JobSignaturePad";
import { useJob } from "@/features/jobs/hooks/useJob";
import { JobStatus } from "@/features/jobs/types/job.types";

const ARRIVED_OR_LATER: string[] = [
  JobStatus.ARRIVED,
  JobStatus.IN_PROGRESS,
  JobStatus.COMPLETED,
];

const IN_PROGRESS_OR_LATER: string[] = [JobStatus.IN_PROGRESS, JobStatus.COMPLETED];

export function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: job, isPending, isError } = useJob(jobId ?? "");

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <AlertTriangle className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find this job.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JobDetailHeader job={job} />

      <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-28">
        {ARRIVED_OR_LATER.includes(job.status) && (
          <JobChecklist jobId={job.id} disabled={job.status === JobStatus.COMPLETED} />
        )}
        {IN_PROGRESS_OR_LATER.includes(job.status) && <JobNotes jobId={job.id} />}
        {IN_PROGRESS_OR_LATER.includes(job.status) && <JobPhotos jobId={job.id} />}
        {IN_PROGRESS_OR_LATER.includes(job.status) && <JobSignaturePad jobId={job.id} />}
      </div>

      <JobActionBar job={job} />
    </div>
  );
}
