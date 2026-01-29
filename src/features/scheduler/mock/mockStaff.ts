/**
 * Mock Staff Data
 * Team members with availability across Mon-Thu delivery
 * availabilityPeriod indicates when staff are available for the programme
 */

import type { Staff } from '../types';

export const mockStaff: Staff[] = [
  {
    id: 'staff-001',
    name: 'Sarah Ahmed',
    role: 'Coach',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-02', // Available from early Feb (week 1)
    },
    hubs: ['North Academy', 'Central Hub'],
  },
  {
    id: 'staff-002',
    name: 'James Martin',
    role: 'Facilitator',
    availability: [
      { day: 'Monday', start: '10:00', end: '15:00' }, // Limited hours
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-02', // Available from early Feb (week 1)
    },
    hubs: ['Central Hub'],
  },
  {
    id: 'staff-003',
    name: 'Priya Patel',
    role: 'Coach',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '13:00', end: '17:00' }, // Afternoon only
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-16', // Available from week 3 onwards
    },
    hubs: ['South Academy'],
  },
  {
    id: 'staff-004',
    name: 'David Chen',
    role: 'Coordinator',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-02', // Available from early Feb (week 1)
    },
    hubs: ['Central Hub', 'North Academy', 'South Academy'],
  },
  {
    id: 'staff-005',
    name: 'Emma Thompson',
    role: 'Facilitator',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '12:00' }, // Morning only - conflict
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-09', // Available from week 2 onwards
    },
    hubs: ['North Academy'],
  },
  {
    id: 'staff-006',
    name: 'Marcus Johnson',
    role: 'Coach',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-02', // Available from early Feb (week 1)
    },
    hubs: ['South Academy'],
  },
  {
    id: 'staff-007',
    name: 'Lucia Rodriguez',
    role: 'Facilitator',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '14:00', end: '17:00' }, // Late starts Thursday
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-02', // Available from early Feb (week 1)
    },
    hubs: ['Central Hub'],
  },
  {
    id: 'staff-008',
    name: 'Tom Wilson',
    role: 'Coach',
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
    ],
    availabilityPeriod: {
      startDateISO: '2026-02-23', // Available from week 4 onwards
    },
    hubs: ['North Academy', 'South Academy'],
  },
];

/**
 * Determine availability status based on staff availability
 */
export function getAvailabilityStatus(
  staff: Staff,
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'
): 'Available' | 'Limited' | 'Conflict' {
  const dayAvailability = staff.availability.find((a) => a.day === day);

  if (!dayAvailability) return 'Conflict';

  const [startHour] = dayAvailability.start.split(':').map(Number);
  const [endHour] = dayAvailability.end.split(':').map(Number);
  const availableHours = endHour - startHour;

  // Less than 5 hours = Limited
  if (availableHours < 5) return 'Limited';

  // Standard 8-hour day
  if (availableHours >= 8) return 'Available';

  return 'Limited';
}
