import { zodResolver } from '@hookform/resolvers/zod'
import { CloudOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { VALIDATION_MESSAGES } from '@/constants'
import { useAddNote } from '@/features/jobs/hooks/useAddNote'
import { useNotes } from '@/features/jobs/hooks/useNotes'
import { formatTimeAgo } from '@/utils/time.utils'

const noteSchema = z.object({
  text: z.string().trim().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD),
})

type NoteFormValues = z.infer<typeof noteSchema>

export function JobNotes({ jobId }: { jobId: string }) {
  const { data: notes, isPending } = useNotes(jobId)
  const addNoteMutation = useAddNote(jobId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { text: '' },
  })

  async function onSubmit(values: NoteFormValues) {
    await addNoteMutation.mutateAsync(values.text)
    reset()
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">Notes</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Textarea
          placeholder="Add a note about this job"
          aria-invalid={!!errors.text}
          disabled={isSubmitting}
          {...register('text')}
        />
        {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
        <Button type="submit" size="sm" disabled={isSubmitting} className="self-end">
          {isSubmitting ? 'Adding…' : 'Add Note'}
        </Button>
      </form>

      {isPending ? (
        <Skeleton className="h-20 rounded-xl" />
      ) : (
        <div className="flex flex-col gap-2">
          {notes?.map((note) => (
            <div key={note.id} className="rounded-lg border px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(note.createdAt)}
                </span>
                {note.isPendingSync && (
                  <CloudOff className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <p className="mt-1 text-foreground">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
