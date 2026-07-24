import { API_ENDPOINTS } from "@/constants";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type { ChecklistItem } from "@/features/jobs/types/job.types";
import type { ApiSuccessResponse } from "@/types/api.types";

export async function toggleChecklistItem(
  jobId: string,
  itemId: string,
): Promise<ChecklistItem> {
  const response = await httpClient.patch<ApiSuccessResponse<ChecklistItem>>(
    API_ENDPOINTS.JOBS.CHECKLIST_ITEM(jobId, itemId),
  );
  return unwrap(response);
}
