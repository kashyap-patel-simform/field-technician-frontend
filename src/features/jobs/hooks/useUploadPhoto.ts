import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { compressImage } from "@/features/jobs/utils/image.utils";
import type { JobDetail } from "@/features/jobs/types/job.types";
import { drainOutbox, enqueueOutboxItem } from "@/features/sync/lib/syncEngine";
import { OutboxEntityType } from "@/features/sync/types/outbox.types";
import { db, type PhotoRow } from "@/lib/db/db";

export function useUploadPhoto(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const blob = await compressImage(file);
      const photo: PhotoRow = {
        id: `temp-${crypto.randomUUID()}`,
        jobId,
        previewUrl: "",
        capturedAt: Date.now(),
        isPendingSync: true,
        blob,
      };
      await db.photos.put(photo);

      const withPreviewUrl = {
        ...photo,
        previewUrl: URL.createObjectURL(blob),
      };
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current
          ? { ...current, photos: [withPreviewUrl, ...current.photos] }
          : current,
      );

      await enqueueOutboxItem({
        entityType: OutboxEntityType.PHOTO,
        jobId,
        endpoint: API_ENDPOINTS.JOBS.PHOTOS(jobId),
        method: "POST",
        payload: { photoLocalId: photo.id },
        localEntityId: photo.id,
      });

      void drainOutbox(queryClient);
      return withPreviewUrl;
    },
  });
}
