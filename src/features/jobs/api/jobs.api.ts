import { API_CONSTANTS } from '@/constants'
import { JobPriority, JobStatus, type Job, type JobsSummary } from '@/features/jobs/types/job.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hoursFromNow(hours: number): number {
  return Date.now() + hours * 60 * 60 * 1000
}

function buildMockJobs(): Job[] {
  return [
    {
      id: 'job-1',
      jobNumber: 'JOB-1042',
      customerName: 'Anita Sharma',
      address: '221B Residency Road, Bengaluru',
      scheduledAt: hoursFromNow(1),
      priority: JobPriority.URGENT,
      status: JobStatus.ASSIGNED,
      distanceKm: 3.2,
      isPendingSync: false,
    },
    {
      id: 'job-2',
      jobNumber: 'JOB-1043',
      customerName: 'Rohit Verma',
      address: '14 MG Road, Bengaluru',
      scheduledAt: hoursFromNow(3),
      priority: JobPriority.HIGH,
      status: JobStatus.ASSIGNED,
      distanceKm: 5.8,
      isPendingSync: false,
    },
    {
      id: 'job-3',
      jobNumber: 'JOB-1044',
      customerName: 'Priya Nair',
      address: '9 Indiranagar 100ft Road, Bengaluru',
      scheduledAt: hoursFromNow(-2),
      priority: JobPriority.MEDIUM,
      status: JobStatus.IN_PROGRESS,
      distanceKm: 1.4,
      isPendingSync: true,
    },
    {
      id: 'job-4',
      jobNumber: 'JOB-1045',
      customerName: 'Karan Mehta',
      address: '78 Koramangala 5th Block, Bengaluru',
      scheduledAt: hoursFromNow(-6),
      priority: JobPriority.LOW,
      status: JobStatus.COMPLETED,
      distanceKm: 7.1,
      isPendingSync: false,
    },
    {
      id: 'job-5',
      jobNumber: 'JOB-1046',
      customerName: 'Sneha Iyer',
      address: '3 HSR Layout Sector 2, Bengaluru',
      scheduledAt: hoursFromNow(-24),
      priority: JobPriority.HIGH,
      status: JobStatus.COMPLETED,
      distanceKm: 4.6,
      isPendingSync: true,
    },
    {
      id: 'job-6',
      jobNumber: 'JOB-1047',
      customerName: 'Vikram Singh',
      address: '56 Whitefield Main Road, Bengaluru',
      scheduledAt: hoursFromNow(26),
      priority: JobPriority.MEDIUM,
      status: JobStatus.ASSIGNED,
      distanceKm: 12.3,
      isPendingSync: false,
    },
    {
      id: 'job-7',
      jobNumber: 'JOB-1048',
      customerName: 'Deepa Rao',
      address: '18 Jayanagar 4th Block, Bengaluru',
      scheduledAt: hoursFromNow(48),
      priority: JobPriority.URGENT,
      status: JobStatus.ON_HOLD,
      distanceKm: 6.0,
      isPendingSync: false,
    },
    {
      id: 'job-8',
      jobNumber: 'JOB-1049',
      customerName: 'Arjun Kumar',
      address: '42 Electronic City Phase 1, Bengaluru',
      scheduledAt: hoursFromNow(5),
      priority: JobPriority.LOW,
      status: JobStatus.ASSIGNED,
      isPendingSync: false,
    },
  ]
}

export async function fetchJobsSummary(): Promise<JobsSummary> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)

  return {
    totalAssigned: 12,
    dueToday: 4,
    highPriority: 3,
    pendingSync: 2,
  }
}

export async function fetchJobs(): Promise<Job[]> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return buildMockJobs()
}
