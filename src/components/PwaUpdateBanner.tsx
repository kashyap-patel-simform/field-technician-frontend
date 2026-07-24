import { Button } from "@/components/ui/button";
import { usePwaUpdate } from "@/hooks/use-pwa-update";

export function PwaUpdateBanner() {
  const { needRefresh, offlineReady, updateServiceWorker, close } =
    usePwaUpdate();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-lg"
    >
      <span>
        {needRefresh
          ? "A new version is available."
          : "App is ready to work offline."}
      </span>
      <div className="flex shrink-0 gap-2">
        {needRefresh && (
          <Button size="sm" onClick={() => updateServiceWorker(true)}>
            Reload
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={close}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
