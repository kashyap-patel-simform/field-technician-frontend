export const JobPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const

export type JobPriority = (typeof JobPriority)[keyof typeof JobPriority]

export const JobStatus = {
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
} as const

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]

export interface JobsSummary {
  totalAssigned: number
  dueToday: number
  highPriority: number
  pendingSync: number
}
