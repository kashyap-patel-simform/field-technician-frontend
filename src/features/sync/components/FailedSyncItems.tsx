import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  discardOutboxItem,
  retryOutboxItem,
} from "@/features/sync/lib/syncEngine";
import type { OutboxItem } from "@/features/sync/types/outbox.types";

export function FailedSyncItems({ items }: { items: OutboxItem[] }) {
  const queryClient = useQueryClient();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3">
      <p className="text-xs font-medium text-destructive">
        {items.length} change{items.length > 1 ? "s" : ""} failed to sync
      </p>
      {items.map((item) => (
        <div
          key={item.localId}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="truncate text-muted-foreground">
            {item.method} {item.endpoint}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Retry"
              onClick={() => retryOutboxItem(queryClient, item.localId)}
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Discard"
              onClick={() => discardOutboxItem(item.localId)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
