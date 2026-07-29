import { CheckCircle, CheckCircle2, Play, type LucideIcon } from "lucide-react";
import {
  JobFilter,
  JobPriority,
  JobStatus,
  type Job,
} from "@/features/jobs/types/job.types";

export const JOB_FILTER_OPTIONS = [
  { value: JobFilter.TODAY, label: "Today" },
  { value: JobFilter.UPCOMING, label: "Upcoming" },
  { value: JobFilter.COMPLETED, label: "Completed" },
  { value: JobFilter.HIGH_PRIORITY, label: "High Priority" },
] as const;

export const JOB_PRIORITY_CONFIG: Record<
  JobPriority,
  {
    label: string;
    className: string;
    accentClassName: string;
    avatarClassName: string;
  }
> = {
  [JobPriority.LOW]: {
    label: "Low",
    className: "bg-muted text-muted-foreground",
    accentClassName: "bg-muted-foreground/40",
    avatarClassName: "bg-muted text-muted-foreground",
  },
  [JobPriority.MEDIUM]: {
    label: "Medium",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    accentClassName: "bg-blue-500",
    avatarClassName:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  [JobPriority.HIGH]: {
    label: "High",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    accentClassName: "bg-amber-500",
    avatarClassName:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  [JobPriority.URGENT]: {
    label: "Urgent",
    className: "bg-destructive/10 text-destructive",
    accentClassName: "bg-destructive",
    avatarClassName: "bg-destructive/10 text-destructive",
  },
};

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string }> = {
  [JobStatus.ASSIGNED]: { label: "Assigned" },
  [JobStatus.IN_PROGRESS]: { label: "In Progress" },
  [JobStatus.COMPLETED]: { label: "Completed" },
  [JobStatus.ON_HOLD]: { label: "On Hold" },
};

export function getJobActionConfig(
  job: Pick<Job, "status" | "acceptedAt">,
): { label: string; icon: LucideIcon } | undefined {
  if (job.status === JobStatus.ASSIGNED) {
    return job.acceptedAt
      ? { label: "Start Work", icon: Play }
      : { label: "Accept Job", icon: CheckCircle };
  }
  if (job.status === JobStatus.IN_PROGRESS) {
    return { label: "Complete Job", icon: CheckCircle2 };
  }
  return undefined;
}

export const JOBS_SEARCH_DEBOUNCE_MS = 250;
