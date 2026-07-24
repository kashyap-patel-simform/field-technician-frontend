import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { toggleChecklistItem } from "@/features/jobs/api/checklist.api";
import type { JobDetail } from "@/features/jobs/types/job.types";

export function useToggleChecklistItem(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => toggleChecklistItem(jobId, itemId),
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOB(jobId) });
      const previous = queryClient.getQueryData<JobDetail>(
        QUERY_KEYS.JOB(jobId),
      );
      if (previous) {
        queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), {
          ...previous,
          checklistItems: previous.checklistItems.map((item) =>
            item.id === itemId
              ? { ...item, isCompleted: !item.isCompleted }
              : item,
          ),
        });
      }
      return { previous };
    },
    onError: (_error, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.JOB(jobId), context.previous);
      }
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current
          ? {
              ...current,
              checklistItems: current.checklistItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              ),
            }
          : current,
      );
    },
  });
}
