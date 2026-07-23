import { CheckCircle2, CloudOff, Loader2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SyncStatus, type SyncStatus as SyncStatusType } from '@/features/sync/types/sync.types'

const STATUS_CONFIG: Record<
  SyncStatusType,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  [SyncStatus.SYNCED]: {
    label: 'Synced',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  },
  [SyncStatus.SYNCING]: {
    label: 'Syncing…',
    icon: Loader2,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  },
  [SyncStatus.PENDING]: {
    label: 'Pending Sync',
    icon: CloudOff,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  [SyncStatus.ERROR]: {
    label: 'Sync Failed',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive',
  },
}

export function SyncStatusBadge({ status }: { status: SyncStatusType }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status]

  return (
    <Badge className={className}>
      <Icon className={`size-3.5 ${status === SyncStatus.SYNCING ? 'animate-spin' : ''}`} />
      {label}
    </Badge>
  )
}
