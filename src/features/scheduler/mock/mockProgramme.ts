/**
 * Mock Programme Data
 * 10-week curriculum with Mon-Thu delivery
 */

import type { Programme, DayPlan, Segment } from '../types';

const MONDAY_SEGMENTS: Segment[] = [
  { id: 'mon-ws1', title: 'Workshop 1', durationMinutes: 90, category: 'Workshop' },
  { id: 'mon-brk', title: 'Break', durationMinutes: 15, category: 'Break' },
  { id: 'mon-ws2', title: 'Workshop 2', durationMinutes: 60, category: 'Workshop' },
  { id: 'mon-sport', title: 'Afternoon Sport', durationMinutes: 90, category: 'Sport' },
];

const TUESDAY_SEGMENTS: Segment[] = [
  { id: 'tue-ws3', title: 'Workshop 3', durationMinutes: 45, category: 'Workshop' },
  { id: 'tue-brk', title: 'Break', durationMinutes: 15, category: 'Break' },
  { id: 'tue-out', title: 'Outdoor Session', durationMinutes: 120, category: 'Sport' },
];

const WEDNESDAY_SEGMENTS: Segment[] = [
  { id: 'wed-qual', title: 'Qualification Unit 1', durationMinutes: 120, category: 'Qualification' },
  { id: 'wed-brk', title: 'Break', durationMinutes: 15, category: 'Break' },
  { id: 'wed-func', title: 'Functional Skills', durationMinutes: 90, category: 'Employability' },
];

const THURSDAY_SEGMENTS: Segment[] = [
  { id: 'thu-emp', title: 'Employability Session', durationMinutes: 120, category: 'Employability' },
  { id: 'thu-brk', title: 'Break', durationMinutes: 15, category: 'Break' },
  { id: 'thu-team', title: 'Team Sport Session', durationMinutes: 90, category: 'Sport' },
];

export function buildMockProgramme(): Programme {
  const programme: Programme = [];

  for (let week = 1; week <= 10; week++) {
    // Vary the segments slightly for weeks 6-10 (advanced modules)
    const isAdvancedWeek = week > 5;

    const mondaySegments = isAdvancedWeek
      ? [
          { id: `mon-adv${week}-1`, title: 'Advanced Workshop 1', durationMinutes: 90, category: 'Workshop' as const },
          { id: `mon-adv${week}-brk`, title: 'Break', durationMinutes: 15, category: 'Break' as const },
          { id: `mon-adv${week}-2`, title: 'Advanced Workshop 2', durationMinutes: 60, category: 'Workshop' as const },
          { id: `mon-adv${week}-sport`, title: 'Afternoon Sport', durationMinutes: 90, category: 'Sport' as const },
        ]
      : MONDAY_SEGMENTS;

    const tuesdaySegments = isAdvancedWeek
      ? [
          { id: `tue-adv${week}-1`, title: 'Advanced Module', durationMinutes: 45, category: 'Workshop' as const },
          { id: `tue-adv${week}-brk`, title: 'Break', durationMinutes: 15, category: 'Break' as const },
          { id: `tue-adv${week}-out`, title: 'Outdoor Experience', durationMinutes: 120, category: 'Sport' as const },
        ]
      : TUESDAY_SEGMENTS;

    programme.push({
      week,
      days: [
        { day: 'Monday', segments: mondaySegments },
        { day: 'Tuesday', segments: tuesdaySegments },
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
