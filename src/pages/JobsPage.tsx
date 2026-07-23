import { Briefcase } from 'lucide-react'

export function JobsPage() {
  return (
    <div className="flex flex-col bg-background">
      <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <h1 className="text-lg font-semibold text-foreground">Jobs</h1>
      </header>

      <div className="flex flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <Briefcase className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No jobs to show yet</p>
      </div>
    </div>
  )
}
