import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { uploadPhoto } from "@/features/jobs/api/photos.api";
import { compressImage } from "@/features/jobs/utils/image.utils";
import type { JobDetail, JobPhoto } from "@/features/jobs/types/job.types";

export function useUploadPhoto(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const blob = await compressImage(file);
      return uploadPhoto(jobId, blob);
    },
    onMutate: async (file: File) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOB(jobId) });
      const previous = queryClient.getQueryData<JobDetail>(
        QUERY_KEYS.JOB(jobId),
      );
      const tempId = `temp-${Date.now()}`;
      if (previous) {
        const optimisticPhoto: JobPhoto = {
          id: tempId,
          jobId,
          previewUrl: URL.createObjectURL(file),
          capturedAt: Date.now(),
          isPendingSync: true,
        };
        queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), {
          ...previous,
          photos: [optimisticPhoto, ...previous.photos],
        });
      }
      return { previous, tempId };
    },
    onError: (_error, _file, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.JOB(jobId), context.previous);
      }
    },
    onSuccess: (photo, _file, context) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current
          ? {
              ...current,
              photos: current.photos.map((existing) =>
                existing.id === context?.tempId ? photo : existing,
              ),
            }
          : current,
      );
    },
  });
}
