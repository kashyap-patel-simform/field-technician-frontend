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
  // Prefer building synchronously (reading from the query cache rather than
  // Dexie) — a sync build lets the cache patch below land in the same tick as
  // the user's tap, with no IndexedDB round-trip in front of the UI update.
  buildEntity: (
    input: TInput,
    queryClient: QueryClient,
  ) => TEntity | Promise<TEntity>;
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
    networkMode: "always",
    mutationFn: async (input: TInput) => {
      const built = config.buildEntity(input, queryClient);
      const entity: TEntity =
        built instanceof Promise ? await built : (built as TEntity);

      // Patch the UI first — this is what makes the toggle feel instant.
      // The Dexie/outbox writes below still happen (and still win the race
      // against a concurrent background refresh, since enqueue happens
      // before that write), but the user shouldn't wait on IndexedDB to see
      // their tap register.
      config.patchCache(queryClient, entity);

      await enqueueOutboxItem({
        entityType: config.entityType,
        jobId: config.jobId,
        endpoint: config.endpoint(input, entity),
        method: config.method,
        payload: config.buildPayload(input, entity),
        localEntityId: config.localEntityId(entity),
      });

      await config.writeEntity(entity);

      void drainOutbox(queryClient);
      return entity;
    },
  });
}
