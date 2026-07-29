import { API_ENDPOINTS } from "@/constants";
import { toAbsoluteUploadUrl } from "@/features/jobs/utils/media.utils";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type {
  Job,
  JobAction,
  JobDetail,
  JobsSummary,
} from "@/features/jobs/types/job.types";
import { JobAction as JobActionValues } from "@/features/jobs/types/job.types";
import type { ApiSuccessResponse } from "@/types/api.types";

function withAbsolutePhotoUrls(job: JobDetail): JobDetail {
  return {
    ...job,
    photos: job.photos.map((photo) => ({
      ...photo,
      previewUrl: toAbsoluteUploadUrl(photo.previewUrl),
    })),
  };
}

export async function fetchJobs(): Promise<Job[]> {
  const response = await httpClient.get<ApiSuccessResponse<Job[]>>(
    API_ENDPOINTS.JOBS.LIST,
  );
  return unwrap(response);
}

export async function fetchJob(id: string): Promise<JobDetail> {
  const response = await httpClient.get<ApiSuccessResponse<JobDetail>>(
    API_ENDPOINTS.JOBS.DETAIL(id),
  );
  return withAbsolutePhotoUrls(unwrap(response));
}

export async function fetchJobsSummary(): Promise<JobsSummary> {
  const response = await httpClient.get<ApiSuccessResponse<JobsSummary>>(
    API_ENDPOINTS.JOBS.SUMMARY,
  );
  return unwrap(response);
}

async function performJobAction(id: string, action: JobAction): Promise<Job> {
  const response = await httpClient.post<ApiSuccessResponse<Job>>(
    API_ENDPOINTS.JOBS.ACTION(id, action),
  );
  return unwrap(response);
}

export const acceptJob = (id: string) =>
  performJobAction(id, JobActionValues.ACCEPT);

export const startWork = (id: string) =>
  performJobAction(id, JobActionValues.START);

export const completeJob = (id: string) =>
  performJobAction(id, JobActionValues.COMPLETE);
