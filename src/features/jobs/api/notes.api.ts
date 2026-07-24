import { API_ENDPOINTS } from "@/constants";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type { JobNote } from "@/features/jobs/types/job.types";
import type { ApiSuccessResponse } from "@/types/api.types";

export async function addNote(jobId: string, text: string): Promise<JobNote> {
  const response = await httpClient.post<ApiSuccessResponse<JobNote>>(
    API_ENDPOINTS.JOBS.NOTES(jobId),
    { text },
  );
  return unwrap(response);
}
