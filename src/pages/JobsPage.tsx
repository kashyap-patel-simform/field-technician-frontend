import { useMemo, useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobFilterChips } from "@/features/jobs/components/JobFilterChips";
import { filterJobs } from "@/features/jobs/utils/job-filter.utils";
import type { JobFilter } from "@/features/jobs/types/job.types";

export function JobsPage() {
  const { data: jobs, isPending } = useJobs();
  const [activeFilter, setActiveFilter] = useState<JobFilter | null>(null);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(
    () => filterJobs(jobs ?? [], activeFilter, search),
    [jobs, activeFilter, search],
  );

  return (
    <div className="flex flex-col bg-background">
      <header className="border-b px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <h1 className="text-lg font-semibold text-foreground">Jobs</h1>
      </header>

      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer, address or job ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 pl-9"
          />
        </div>

        <JobFilterChips
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Briefcase className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No jobs match your filters
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
