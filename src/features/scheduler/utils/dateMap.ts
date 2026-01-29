/**
 * Date Mapping Utilities
 * Converts between week/day and actual calendar dates
 */

import type { Weekday } from '../types';

export const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const WEEKDAY_OFFSET: Record<Weekday, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
};

/**
 * Ensure a date falls on a Monday
 * If not, returns the next upcoming Monday
 */
export function ensureMonday(date: Date): Date {
  const d = new Date(date);
  const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (dayOfWeek === 1) {
    return d;
  }

  // Calculate days to add to reach next Monday
  const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  d.setDate(d.getDate() + daysToAdd);
  return d;
}

/**
 * Map a week number and weekday to an actual calendar date
 * @param startDate The Monday of Week 1 (must be a Monday)
 * @param week Week number (1-10)
 * @param weekday Target day (Mon-Thu)
 * @returns Computed date
 */
export function mapWeekdayToDate(startDate: Date, week: number, weekday: Weekday): Date {
  const d = new Date(startDate);

  // Add (week - 1) * 7 days
  d.setDate(d.getDate() + (week - 1) * 7);

  // Add weekday offset
  d.setDate(d.getDate() + WEEKDAY_OFFSET[weekday]);

  return d;
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 */
export function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Check if a given date is a Monday
 */
export function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

/**
 * Generate a date mapping for the entire 10-week programme
 */
export function generateDateMapping(startDateISO: string) {
  const startDate = new Date(startDateISO);
  const adjustedStart = ensureMonday(startDate);
  const mapping: Array<{ week: number; day: Weekday; dateISO: string }> = [];

  for (let week = 1; week <= 10; week++) {
    for (const weekday of WEEKDAYS) {
      const date = mapWeekdayToDate(adjustedStart, week, weekday);
      mapping.push({
        week,
        day: weekday,
        dateISO: toISO(date),
      });
    }
  }

  return {
    adjustedStart: toISO(adjustedStart),
    mapping,
  };
}

/**
 * Check if a staff member is available for a given start date + 10-week period
 * @param staffAvailabilityStartISO Staff's availability start date
 * @param programmeStartISO Programme start date (Monday)
 * @returns true if staff is available for at least part of the programme
 */
export function isStaffAvailableForProgramme(
  staffAvailabilityStartISO: string | undefined,
  programmeStartISO: string
): boolean {
  if (!staffAvailabilityStartISO) return true; // No restriction if not specified

  const staffStart = new Date(staffAvailabilityStartISO);
  const programmeEnd = new Date(programmeStartISO);
  programmeEnd.setDate(programmeEnd.getDate() + 70); // 10 weeks = 70 days

  // Staff is available if their start date is before or on the programme end date
  return staffStart <= programmeEnd;
}
