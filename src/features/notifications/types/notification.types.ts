import type { Job } from "@/features/jobs/types/job.types";

export interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: number;
  job: Job;
}
