import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function DashboardPage() {
  const { technician, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <Button variant="ghost" size="icon" aria-label="Logout" onClick={logout}>
          <LogOut className="size-5" />
        </Button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-lg font-medium text-foreground">Welcome, Technician</p>
        <p className="text-sm text-muted-foreground">
          Logged in with +91 {technician?.mobileNumber}
        </p>
      </div>
    </div>
  )
}
