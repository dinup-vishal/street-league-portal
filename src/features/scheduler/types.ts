/**
 * Scheduler Domain Types
 * Defines all data structures for the 10-week programme scheduler
 */

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
export type SessionTime = 'Morning' | 'Afternoon' | 'Evening' | string; // Allow any string for flexibility
export type StaffRole = 'Coach' | 'Facilitator' | 'Coordinator';
export type SegmentCategory = 'Workshop' | 'Break' | 'Sport' | 'Qualification' | 'Employability';

/**
 * Cohort: Represents a Street League Academy cohort
 * Flexible to accept different cohort structures
 */
export interface Cohort {
  cohortId: number;
  cohortCode: string;
  academyId: number;
  dayOfWeek?: string; // Can be any day (flexible)
  sessionTime?: SessionTime;
  maxParticipants?: number;
  createdAt?: string;
}

/**
 * Segment: A single activity/session within a delivery day
 * e.g., "Workshop 1", "Break", "Outdoor session"
 */
export interface Segment {
  id: string;
  title: string;
  durationMinutes: number;
  category: SegmentCategory;
}

/**
 * DayPlan: The complete schedule for a single day (Mon-Thu)
 */
export interface DayPlan {
  day: Weekday;
  segments: Segment[];
}

/**
 * ProgrammeWeek: All delivery days for a single week (1-10)
 */
export interface ProgrammeWeek {
  week: number;
  days: DayPlan[];
}

/**
 * Programme: Complete 10-week curriculum (array of weeks)
 */
export type Programme = ProgrammeWeek[];

/**
 * Staff: A member of the delivery team
 */
export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  availability: Array<{
    day: Weekday | 'Friday';
    start: string; // "09:00"
    end: string; // "17:00"
  }>;
  hubs?: string[];
}

/**
 * Assignment: Staff allocation to a programme
 */
export interface Assignment {
  staffIds: string[];
  scope: 'Programme' | 'Day'; // MVP: Programme scope only
}

/**
 * SchedulePayload: Data sent on save
 */
export interface SchedulePayload {
  cohortId: number;
  startDateISO: string;
  staffIds: string[];
  dateMapping: Array<{
    week: number;
    day: Weekday;
    dateISO: string;
  }>;
}
