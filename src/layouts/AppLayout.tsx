import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
