/**
 * Mock Programme Data
 * 10-week curriculum with Mon-Thu delivery
 * Fixed time slots across all weeks:
 * - 10:00-12:00: Morning Workshop (120 min)
 * - 12:00-12:15: Break (15 min)
 * - 12:15-13:15: Afternoon Workshop (60 min)
 */

import type { Programme, DayPlan, Segment, TimeSlot } from '../types';

// Fixed time slots used across all weeks
export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-morning', startTime: '10:00', endTime: '12:00', durationMinutes: 120 },
  { id: 'slot-break', startTime: '12:00', endTime: '12:15', durationMinutes: 15 },
  { id: 'slot-afternoon', startTime: '12:15', endTime: '13:15', durationMinutes: 60 },
];

const MONDAY_SEGMENTS: Segment[] = [
  { id: 'mon-ws1', title: 'Workshop 1', durationMinutes: 120, category: 'Workshop', timeSlotId: 'slot-morning' },
  { id: 'mon-brk', title: 'Break', durationMinutes: 15, category: 'Break', timeSlotId: 'slot-break' },
  { id: 'mon-ws2', title: 'Workshop 2', durationMinutes: 60, category: 'Workshop', timeSlotId: 'slot-afternoon' },
];

const TUESDAY_SEGMENTS: Segment[] = [
  { id: 'tue-ws1', title: 'Workshop 3', durationMinutes: 120, category: 'Workshop', timeSlotId: 'slot-morning' },
  { id: 'tue-brk', title: 'Break', durationMinutes: 15, category: 'Break', timeSlotId: 'slot-break' },
  { id: 'tue-ws2', title: 'Workshop 4', durationMinutes: 60, category: 'Workshop', timeSlotId: 'slot-afternoon' },
];

const WEDNESDAY_SEGMENTS: Segment[] = [
  { id: 'wed-ws1', title: 'Qualification Unit', durationMinutes: 120, category: 'Qualification', timeSlotId: 'slot-morning' },
  { id: 'wed-brk', title: 'Break', durationMinutes: 15, category: 'Break', timeSlotId: 'slot-break' },
  { id: 'wed-ws2', title: 'Functional Skills', durationMinutes: 60, category: 'Employability', timeSlotId: 'slot-afternoon' },
];

const THURSDAY_SEGMENTS: Segment[] = [
  { id: 'thu-ws1', title: 'Employability', durationMinutes: 120, category: 'Employability', timeSlotId: 'slot-morning' },
  { id: 'thu-brk', title: 'Break', durationMinutes: 15, category: 'Break', timeSlotId: 'slot-break' },
  { id: 'thu-ws2', title: 'Team Activity', durationMinutes: 60, category: 'Sport', timeSlotId: 'slot-afternoon' },
];

export function buildMockProgramme(): Programme {
  const programme: Programme = [];

  for (let week = 1; week <= 10; week++) {
    // Use same segments for all weeks (consistent structure)
    programme.push({
      week,
      days: [
        { day: 'Monday', segments: MONDAY_SEGMENTS },
        { day: 'Tuesday', segments: TUESDAY_SEGMENTS },
        { day: 'Wednesday', segments: WEDNESDAY_SEGMENTS },
        { day: 'Thursday', segments: THURSDAY_SEGMENTS },
      ],
    });
  }

  return programme;
}

export const mockProgrammeWeek1: DayPlan[] = [
  { day: 'Monday', segments: MONDAY_SEGMENTS },
  { day: 'Tuesday', segments: TUESDAY_SEGMENTS },
  { day: 'Wednesday', segments: WEDNESDAY_SEGMENTS },
  { day: 'Thursday', segments: THURSDAY_SEGMENTS },
];

