import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { submitSignature } from "@/features/jobs/api/signature.api";
import type { JobDetail } from "@/features/jobs/types/job.types";

export function useSubmitSignature(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dataUrl: string) => submitSignature(jobId, dataUrl),
    onSuccess: (signature) => {
      queryClient.setQueryData<JobDetail>(QUERY_KEYS.JOB(jobId), (current) =>
        current ? { ...current, signature } : current,
      );
    },
  });
}
