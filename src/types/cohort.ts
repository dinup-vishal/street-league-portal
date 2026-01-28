/**
 * Cohort Types
 */

export interface Cohort {
  cohortId: number;
  cohortCode: string;
  academyId: number;
  cohortNumber: number;
  maxParticipants: number;
  dayOfWeek: string;
  sessionTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  dataSource: string;
}

export interface CohortsResponse {
  success: boolean;
  data?: Cohort[];
  error?: string;
}
