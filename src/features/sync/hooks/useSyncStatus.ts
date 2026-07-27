import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/db";
import { drainOutbox } from "@/features/sync/lib/syncEngine";
import {
  OutboxStatus,
  type OutboxItem,
} from "@/features/sync/types/outbox.types";
import { SyncStatus } from "@/features/sync/types/sync.types";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function useSyncStatus() {
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();

  const outboxItems = useLiveQuery(
    () => db.outbox.toArray(),
    [],
    [] as OutboxItem[],
  );
  const lastSyncedAtRow = useLiveQuery(
    () => db.meta.get("lastSyncedAt"),
    [],
    undefined,
  );

  const failedItems = outboxItems.filter(
    (item) => item.status === OutboxStatus.FAILED,
  );
  const pendingCount = outboxItems.length - failedItems.length;
  const isSyncing = outboxItems.some(
    (item) => item.status === OutboxStatus.SYNCING,
  );
  const lastSyncedAt = (lastSyncedAtRow?.value as number | undefined) ?? null;

  const status: SyncStatus = isSyncing
    ? SyncStatus.SYNCING
    : failedItems.length > 0
      ? SyncStatus.ERROR
      : pendingCount > 0
        ? SyncStatus.PENDING
        : SyncStatus.SYNCED;

  const sync = useCallback(() => drainOutbox(queryClient), [queryClient]);

  useEffect(() => {
    if (isOnline) {
      void sync();
    }
  }, [isOnline, sync]);

  return { status, pendingCount, lastSyncedAt, isOnline, sync, failedItems };
}
