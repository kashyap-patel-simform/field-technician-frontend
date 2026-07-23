import { Bell, Briefcase, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.DASHBOARD, icon: Home },
  { label: 'Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Profile', path: ROUTES.PROFILE, icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-stretch justify-around">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground active:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('size-5', isActive && 'fill-primary/15')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
