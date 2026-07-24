import { API_ENDPOINTS } from "@/constants";
import { toAbsoluteUploadUrl } from "@/features/jobs/utils/media.utils";
import { httpClient, unwrap } from "@/lib/http/http-client";
import type { JobPhoto } from "@/features/jobs/types/job.types";
import type { ApiSuccessResponse } from "@/types/api.types";

export async function uploadPhoto(
  jobId: string,
  blob: Blob,
): Promise<JobPhoto> {
  const formData = new FormData();
  formData.append("photo", blob, "photo.jpg");

  const response = await httpClient.post<ApiSuccessResponse<JobPhoto>>(
    API_ENDPOINTS.JOBS.PHOTOS(jobId),
    formData,
  );
  const photo = unwrap(response);
  return { ...photo, previewUrl: toAbsoluteUploadUrl(photo.previewUrl) };
}
