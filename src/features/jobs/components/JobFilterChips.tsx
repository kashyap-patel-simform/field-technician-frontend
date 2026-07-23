import { Button } from '@/components/ui/button'
import { JOB_FILTER_OPTIONS } from '@/constants'
import type { JobFilter } from '@/features/jobs/types/job.types'

interface JobFilterChipsProps {
  activeFilter: JobFilter | null
  onChange: (filter: JobFilter | null) => void
}

export function JobFilterChips({ activeFilter, onChange }: JobFilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {JOB_FILTER_OPTIONS.map(({ value, label }) => (
        <Button
          key={value}
          type="button"
          size="sm"
          variant={activeFilter === value ? 'default' : 'outline'}
          className="shrink-0 rounded-full"
          onClick={() => onChange(activeFilter === value ? null : value)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
