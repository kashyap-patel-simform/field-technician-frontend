import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { drainOutbox, enqueueOutboxItem } from "@/features/sync/lib/syncEngine";
import type { OutboxEntityType } from "@/features/sync/types/outbox.types";

interface QueuedMutationConfig<TInput, TEntity> {
  entityType: OutboxEntityType;
  jobId: string;
  method: "POST" | "PATCH";
  endpoint: (input: TInput, entity: TEntity) => string;
  buildEntity: (input: TInput) => TEntity | Promise<TEntity>;
  writeEntity: (entity: TEntity) => Promise<unknown>;
  patchCache: (queryClient: QueryClient, entity: TEntity) => void;
  buildPayload: (input: TInput, entity: TEntity) => unknown;
  localEntityId: (entity: TEntity) => string;
}

export function useQueuedMutation<TInput, TEntity>(
  config: QueuedMutationConfig<TInput, TEntity>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TInput) => {
      const entity = await config.buildEntity(input);
      await config.writeEntity(entity);
      config.patchCache(queryClient, entity);

      await enqueueOutboxItem({
        entityType: config.entityType,
        jobId: config.jobId,
        endpoint: config.endpoint(input, entity),
        method: config.method,
        payload: config.buildPayload(input, entity),
        localEntityId: config.localEntityId(entity),
      });

      void drainOutbox(queryClient);
      return entity;
    },
  });
}
