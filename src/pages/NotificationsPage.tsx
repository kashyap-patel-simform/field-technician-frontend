import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { JobNotificationCard } from "@/features/jobs/components/JobNotificationCard";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

export function NotificationsPage() {
  const { data: notifications, isPending, isError } = useNotifications();

  return (
    <div className="flex flex-col bg-background">
      <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
      </header>

      <div className="flex flex-col gap-3 px-6 py-4">
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <Bell className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load notifications. Pull to refresh.
            </p>
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <Bell className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <JobNotificationCard key={notification.id} job={notification.job} />
          ))
        )}
      </div>
    </div>
  );
}
