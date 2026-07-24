import { useRef, useState } from 'react'
import { Camera, CloudOff, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePhotos } from '@/features/jobs/hooks/usePhotos'
import { useUploadPhoto } from '@/features/jobs/hooks/useUploadPhoto'
import type { JobPhoto } from '@/features/jobs/types/job.types'

export function JobPhotos({ jobId }: { jobId: string }) {
  const { data: photos, isPending } = usePhotos(jobId)
  const uploadMutation = useUploadPhoto(jobId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewPhoto, setPreviewPhoto] = useState<JobPhoto | null>(null)

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      await uploadMutation.mutateAsync(file)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

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
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />
      </div>

      {isPending ? (
        <Skeleton className="h-24 rounded-xl" />
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
  )
}
