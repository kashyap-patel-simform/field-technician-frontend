import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES, getJobActionConfig } from "@/constants";
import { useCanCompleteJob } from "@/features/jobs/hooks/useCanCompleteJob";
import { useJobStatusMutation } from "@/features/jobs/hooks/useJobStatusMutation";
import {
  JobAction,
  JobStatus,
  type Job,
} from "@/features/jobs/types/job.types";

export function JobActionBar({ job }: { job: Job }) {
  const navigate = useNavigate();
  const acceptMutation = useJobStatusMutation(job.id, JobAction.ACCEPT);
  const startWorkMutation = useJobStatusMutation(job.id, JobAction.START);
  const completeMutation = useJobStatusMutation(job.id, JobAction.COMPLETE);
  const { hasSignature, incompleteChecklistCount } = useCanCompleteJob(job.id);

  const actionConfig = getJobActionConfig(job);
  if (!actionConfig) {
    return null;
  }

  const { label, icon: Icon } = actionConfig;
  const isComplete = job.status === JobStatus.IN_PROGRESS;

  function handleClick() {
    if (job.status === JobStatus.ASSIGNED) {
      if (job.acceptedAt) {
        startWorkMutation.mutate();
      } else {
        acceptMutation.mutate();
      }
      return;
    }
    if (job.status === JobStatus.IN_PROGRESS) {
      if (incompleteChecklistCount > 0) {
        const proceed = window.confirm(
          `${incompleteChecklistCount} checklist item(s) incomplete. Complete anyway?`,
        );
        if (!proceed) return;
      }
      completeMutation.mutate(undefined, {
        onSuccess: () => navigate(ROUTES.JOBS),
      });
    }
  }

  const isDisabled = isComplete && !hasSignature;
  const isPending =
    acceptMutation.isPending ||
    startWorkMutation.isPending ||
    completeMutation.isPending;

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
  );
}
