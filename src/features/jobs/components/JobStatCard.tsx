import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type JobStatCardTone = 'default' | 'warning' | 'danger'

const TONE_CLASSES: Record<JobStatCardTone, string> = {
  default: 'text-foreground bg-muted',
  warning: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950',
  danger: 'text-destructive bg-destructive/10',
}

interface JobStatCardProps {
  icon: LucideIcon
  label: string
  value: number
  tone?: JobStatCardTone
}

export function JobStatCard({ icon: Icon, label, value, tone = 'default' }: JobStatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className={cn('flex size-9 items-center justify-center rounded-lg', TONE_CLASSES[tone])}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
