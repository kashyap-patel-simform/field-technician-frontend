import { Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ConnectivityBadge({ isOnline }: { isOnline: boolean }) {
  if (isOnline) {
    return (
      <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <Wifi className="size-3.5" />
        Online
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="gap-1.5">
      <WifiOff className="size-3.5" />
      Offline
    </Badge>
  )
}
