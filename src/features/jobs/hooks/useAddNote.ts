import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { addNote } from "@/features/jobs/api/notes.api";
import type { JobDetail, JobNote } from "@/features/jobs/types/job.types";

export function useAddNote(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => addNote(jobId, text),
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOB(jobId) });
      const previous = queryClient.getQueryData<JobDetail>(
        QUERY_KEYS.JOB(jobId),
      );
      const tempId = `temp-${Date.now()}`;
      if (previous) {
        const optimisticNote: JobNote = {
          id: tempId,
          jobId,
          text,
          createdAt: Date.now(),
          isPendingSync: true,
        };
        queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), {
          ...previous,
          notes: [optimisticNote, ...previous.notes],
        });
      }
      return { previous, tempId };
    },
    onError: (_error, _text, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.JOB(jobId), context.previous);
      }
    },
    onSuccess: (note, _text, context) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current
          ? {
              ...current,
              notes: current.notes.map((existing) =>
                existing.id === context?.tempId ? note : existing,
              ),
            }
          : current,
      );
    },
  });
}
