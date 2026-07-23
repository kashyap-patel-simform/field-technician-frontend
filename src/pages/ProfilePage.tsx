import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function ProfilePage() {
  const { technician, logout } = useAuth()

  return (
    <div className="flex flex-col gap-6 bg-background">
      <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </header>

      <div className="flex flex-col gap-6 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="size-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Technician</p>
            <p className="text-sm text-muted-foreground">
              +91 {technician?.mobileNumber}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
