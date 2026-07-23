import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/navigation/BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
