export const JobPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type JobPriority = (typeof JobPriority)[keyof typeof JobPriority];

export const JobStatus = {
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ON_HOLD: "ON_HOLD",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const JobFilter = {
  TODAY: "TODAY",
  UPCOMING: "UPCOMING",
  COMPLETED: "COMPLETED",
  HIGH_PRIORITY: "HIGH_PRIORITY",
} as const;

export type JobFilter = (typeof JobFilter)[keyof typeof JobFilter];

export interface ChecklistItem {
  id: string;
  jobId: string;
  label: string;
  isCompleted: boolean;
  completedAt?: number;
}

export interface JobNote {
  id: string;
  jobId: string;
  text: string;
  createdAt: number;
  isPendingSync: boolean;
}

export interface JobPhoto {
  id: string;
  jobId: string;
  previewUrl: string;
  thumbnailUrl: string | null;
  capturedAt: number;
  isPendingSync: boolean;
}

export interface JobSignature {
  jobId: string;
  dataUrl: string;
  capturedAt: number;
}

export interface JobsSummary {
  totalAssigned: number;
  dueToday: number;
  highPriority: number;
  pendingSync: number;
}

export interface Job {
  id: string;
  jobNumber: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  lat?: number;
  lng?: number;
  scheduledAt: number;
  priority: JobPriority;
  status: JobStatus;
  distanceKm?: number;
  isPendingSync: boolean;
  acceptedAt?: number;
  startedAt?: number;
  completedAt?: number;
}

export interface JobDetail extends Job {
  checklistItems: ChecklistItem[];
  notes: JobNote[];
  photos: JobPhoto[];
  signature: JobSignature | null;
}

export const JobAction = {
  ACCEPT: "accept",
  START: "start",
  COMPLETE: "complete",
} as const;

export type JobAction = (typeof JobAction)[keyof typeof JobAction];
