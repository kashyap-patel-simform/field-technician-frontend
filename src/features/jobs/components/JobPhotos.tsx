import { useEffect, useRef, useState } from "react";
import { Camera, CloudOff, Loader2, RefreshCw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePhotos } from "@/features/jobs/hooks/usePhotos";
import { useUploadPhoto } from "@/features/jobs/hooks/useUploadPhoto";
import type { JobPhoto } from "@/features/jobs/types/job.types";
import { PHOTO_UPLOAD_CONSTANTS, PHOTO_UPLOAD_MESSAGES } from "@/constants";

interface StagedPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

export function JobPhotos({ jobId }: { jobId: string }) {
  const { data: photos, isPending } = usePhotos(jobId);
  const uploadMutation = useUploadPhoto(jobId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewPhoto, setPreviewPhoto] = useState<JobPhoto | null>(null);
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [stagingError, setStagingError] = useState<string | null>(null);
  const [isUploadingAll, setIsUploadingAll] = useState(false);

  useEffect(() => {
    return () => {
      for (const staged of stagedPhotos) {
        URL.revokeObjectURL(staged.previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const oversized = incoming.some(
      (file) => file.size > PHOTO_UPLOAD_CONSTANTS.MAX_FILE_SIZE_BYTES,
    );
    if (oversized) {
      setStagingError(PHOTO_UPLOAD_MESSAGES.FILE_TOO_LARGE);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setStagedPhotos((current) => {
      const room = PHOTO_UPLOAD_CONSTANTS.MAX_STAGED_PHOTOS - current.length;
      if (room <= 0) {
        setStagingError(PHOTO_UPLOAD_MESSAGES.TOO_MANY_PHOTOS);
        return current;
      }
      const accepted = incoming.slice(0, room);
      if (accepted.length < incoming.length) {
        setStagingError(PHOTO_UPLOAD_MESSAGES.TOO_MANY_PHOTOS);
      } else {
        setStagingError(null);
      }
      const newlyStaged = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...current, ...newlyStaged];
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemoveStaged(id: string) {
    setStagedPhotos((current) => {
      const target = current.find((staged) => staged.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((staged) => staged.id !== id);
    });
  }

  async function handleUploadStaged() {
    if (stagedPhotos.length === 0 || isUploadingAll) return;
    setIsUploadingAll(true);
    const toUpload = stagedPhotos;
    setStagedPhotos([]);
    setStagingError(null);

    try {
      for (const staged of toUpload) {
        await uploadMutation.mutateAsync(staged.file);
        URL.revokeObjectURL(staged.previewUrl);
      }
    } finally {
      setIsUploadingAll(false);
    }
  }

  const hasContent = (photos?.length ?? 0) > 0 || stagedPhotos.length > 0;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Photos</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="size-4" />
          Add Photo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={PHOTO_UPLOAD_CONSTANTS.ACCEPTED_MIME_TYPES}
          capture="environment"
          multiple
          className="hidden"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />
      </div>

      {stagingError && (
        <p className="text-xs text-destructive">{stagingError}</p>
      )}

      {stagedPhotos.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed p-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {stagedPhotos.length} photo
              {stagedPhotos.length > 1 ? "s" : ""} ready to upload
            </p>
            <Button
              type="button"
              size="sm"
              onClick={handleUploadStaged}
              disabled={isUploadingAll}
            >
              {isUploadingAll ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {isUploadingAll ? "Uploading…" : "Upload"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {stagedPhotos.map((staged) => (
              <div
                key={staged.id}
                className="relative aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  src={staged.previewUrl}
                  alt="Pending upload"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  disabled={isUploadingAll}
                  onClick={() => handleRemoveStaged(staged.id)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 disabled:opacity-50"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPending ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : !hasContent ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          {PHOTO_UPLOAD_MESSAGES.NO_PHOTOS_YET}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos?.map((photo) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => setPreviewPhoto(photo)}
              className="relative aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={photo.previewUrl}
                alt="Job site"
                className="size-full object-cover"
              />
              {photo.isPendingSync && (
                <span className="absolute right-1 top-1 rounded-full bg-background/80 p-1">
                  <CloudOff className="size-3.5 text-amber-600 dark:text-amber-400" />
                </span>
              )}
            </button>
          ))}

          {uploadMutation.isError && (
            <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-destructive/40 text-center">
              <p className="px-1 text-xs text-destructive">Upload failed</p>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Retry upload"
                onClick={() => uploadMutation.mutate(uploadMutation.variables!)}
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] text-white"
            onClick={() => setPreviewPhoto(null)}
          >
            <X className="size-6" />
          </button>
          <img
            src={previewPhoto.previewUrl}
            alt="Job site full preview"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
