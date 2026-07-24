import { API_ENDPOINTS } from "@/constants";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type { JobSignature } from "@/features/jobs/types/job.types";
import type { ApiSuccessResponse } from "@/types/api.types";

export async function submitSignature(
  jobId: string,
  dataUrl: string,
): Promise<JobSignature> {
  const response = await httpClient.post<ApiSuccessResponse<JobSignature>>(
    API_ENDPOINTS.JOBS.SIGNATURE(jobId),
    { dataUrl },
  );
  return unwrap(response);
}
