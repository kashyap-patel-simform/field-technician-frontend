import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OFFLINE_INDICATOR_VISIBLE_MS } from "@/constants";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(!isOnline);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, OFFLINE_INDICATOR_VISIBLE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={`sticky top-0 z-50 flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-medium ${
        isOnline
          ? "bg-emerald-600 text-white"
          : "bg-destructive text-destructive-foreground"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="size-3.5" />
          Back online
        </>
      ) : (
        <>
          <WifiOff className="size-3.5" />
          You're offline. Changes will sync when you're back online.
        </>
      )}
    </div>
  );
}
