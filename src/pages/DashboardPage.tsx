import {
  AlertTriangle,
  Briefcase,
  CalendarClock,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJobsSummary } from "@/features/jobs/hooks/useJobsSummary";
import { JobStatCard } from "@/features/jobs/components/JobStatCard";
import { useSyncStatus } from "@/features/sync/hooks/useSyncStatus";
import { ConnectivityBadge } from "@/features/sync/components/ConnectivityBadge";
import { FailedSyncItems } from "@/features/sync/components/FailedSyncItems";
import { SyncStatusBadge } from "@/features/sync/components/SyncStatusBadge";
import { SyncStatus } from "@/features/sync/types/sync.types";
import { formatTimeAgo } from "@/utils/time.utils";

export function DashboardPage() {
  const { technician } = useAuth();
  const { data: jobsSummary, isPending } = useJobsSummary();
  const { status, pendingCount, lastSyncedAt, isOnline, sync, failedItems } =
    useSyncStatus();

  return (
    <div className="flex flex-col bg-background">
      <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <p className="text-lg font-semibold text-foreground">
          👋 Welcome, Technician
        </p>
        <p className="text-sm text-muted-foreground">
          +91 {technician?.mobileNumber}
        </p>
      </header>

      <div className="flex flex-col gap-6 px-6 py-5">
        <div className="flex items-center gap-2">
          <ConnectivityBadge isOnline={isOnline} />
          <SyncStatusBadge status={status} />
        </div>

        <FailedSyncItems items={failedItems} />

        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Your Jobs
          </h2>
          {isPending ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <JobStatCard
                icon={Briefcase}
                label="Assigned Jobs"
                value={jobsSummary?.totalAssigned ?? 0}
              />
              <JobStatCard
                icon={CalendarClock}
                label="Due Today"
                value={jobsSummary?.dueToday ?? 0}
                tone="warning"
              />
              <JobStatCard
                icon={AlertTriangle}
                label="High Priority"
                value={jobsSummary?.highPriority ?? 0}
                tone="danger"
              />
              <JobStatCard
                icon={CloudOff}
                label="Pending Sync"
                value={pendingCount}
                tone={pendingCount > 0 ? "warning" : "default"}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Last synced</p>
            <p className="text-sm font-medium text-foreground">
              {formatTimeAgo(lastSyncedAt)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={
              !isOnline || status === SyncStatus.SYNCING || pendingCount === 0
            }
            onClick={sync}
            className="gap-1.5"
          >
            <RefreshCw
              className={`size-4 ${status === SyncStatus.SYNCING ? "animate-spin" : ""}`}
            />
            Sync Now
          </Button>
        </div>
      </div>
    </div>
  );
}
