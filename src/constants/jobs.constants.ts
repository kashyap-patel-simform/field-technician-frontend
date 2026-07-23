import {
  JobFilter,
  JobPriority,
  JobStatus,
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

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; className: string }
> = {
  [JobStatus.ASSIGNED]: {
    label: "Assigned",
    className: "bg-secondary text-secondary-foreground",
  },
  [JobStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  [JobStatus.COMPLETED]: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  [JobStatus.ON_HOLD]: {
    label: "On Hold",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
};

export const JOBS_SEARCH_DEBOUNCE_MS = 250;
