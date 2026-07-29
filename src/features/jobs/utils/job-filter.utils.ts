import { isSameDay } from "@/utils/time.utils";
import {
  JobFilter,
  JobPriority,
  JobStatus,
  type Job,
} from "@/features/jobs/types/job.types";

function matchesFilter(job: Job, filter: JobFilter): boolean {
  const now = new Date();
  const scheduledDate = new Date(job.scheduledAt);

  switch (filter) {
    case JobFilter.TODAY:
      return (
        isSameDay(scheduledDate, now) && job.status !== JobStatus.COMPLETED
      );
    case JobFilter.UPCOMING:
      return job.scheduledAt > Date.now() && job.status !== JobStatus.COMPLETED;
    case JobFilter.COMPLETED:
      return job.status === JobStatus.COMPLETED;
    case JobFilter.HIGH_PRIORITY:
      return (
        job.priority === JobPriority.HIGH || job.priority === JobPriority.URGENT
      );
    default:
      return true;
  }
}

function isVisibleInJobsList(job: Job): boolean {
  return !(job.status === JobStatus.ASSIGNED && !job.acceptedAt);
}

function matchesSearch(job: Job, query: string): boolean {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();

  return (
    job.jobNumber.toLowerCase().includes(normalized) ||
    job.customerName.toLowerCase().includes(normalized) ||
    job.address.toLowerCase().includes(normalized)
  );
}

export function filterJobs(
  jobs: Job[],
  filter: JobFilter | null,
  search: string,
): Job[] {
  return jobs
    .filter(isVisibleInJobsList)
    .filter((job) =>
      filter ? matchesFilter(job, filter) : job.status !== JobStatus.COMPLETED,
    )
    .filter((job) => matchesSearch(job, search))
    .sort((a, b) => a.scheduledAt - b.scheduledAt);
}
