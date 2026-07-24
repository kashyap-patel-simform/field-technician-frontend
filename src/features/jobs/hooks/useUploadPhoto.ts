import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { uploadPhoto } from "@/features/jobs/api/photos.api";
import { compressImage } from "@/features/jobs/utils/image.utils";
import type { JobPhoto } from "@/features/jobs/types/job.types";

export function useUploadPhoto(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const blob = await compressImage(file);
      return uploadPhoto(jobId, blob);
    },
    onMutate: async (file: File) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PHOTOS(jobId) });
      const previous =
        queryClient.getQueryData<JobPhoto[]>(QUERY_KEYS.PHOTOS(jobId)) ?? [];
      const optimisticPhoto: JobPhoto = {
        id: `temp-${Date.now()}`,
        jobId,
        previewUrl: URL.createObjectURL(file),
        capturedAt: Date.now(),
        isPendingSync: true,
      };
      queryClient.setQueryData<JobPhoto[]>(QUERY_KEYS.PHOTOS(jobId), [
        optimisticPhoto,
        ...previous,
      ]);
      return { previous, tempId: optimisticPhoto.id };
    },
    onError: (_error, _file, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.PHOTOS(jobId), context.previous);
      }
    },
    onSuccess: (photo, _file, context) => {
      queryClient.setQueryData<JobPhoto[]>(
        QUERY_KEYS.PHOTOS(jobId),
        (current) =>
          (current ?? []).map((existing) =>
            existing.id === context?.tempId ? photo : existing,
          ),
      );
    },
  });
}
