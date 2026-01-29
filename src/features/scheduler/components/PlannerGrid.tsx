/**
 * PlannerGrid.tsx
 * Grid display for planner with empty workshop slots for user to fill
 */

import React, { useState } from 'react';
import type { Weekday } from '../types';
import { PlannerDayCell } from './PlannerDayCell';
import styles from './ProgrammeGrid.module.css';

interface CustomSegment {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  timeSlotId?: string;
  lessonId?: string;
  lessonName?: string;
}

interface CustomDayPlan {
  day: string;
  segments: CustomSegment[];
}

interface CustomProgrammeWeek {
  week: number;
  days: CustomDayPlan[];
}

interface PlannerGridProps {
  programme: CustomProgrammeWeek[];
  onAddWorkshop: (week: number, day: string, segmentId: string) => void;
  onDeleteWorkshop: (week: number, day: string, segmentId: string) => void;
}

export const PlannerGrid: React.FC<PlannerGridProps> = ({
  programme,
  onAddWorkshop,
  onDeleteWorkshop,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition((e.currentTarget as HTMLDivElement).scrollLeft);
  };

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridContainer} onScroll={handleScroll}>
        <table className={styles.grid} role="table" aria-label="10-week planner schedule">
          {/* Header: Day names */}
          <thead>
            <tr>
              <th className={styles.weekHeaderCell} scope="col">
                Week
              </th>
              {WEEKDAYS.map((day) => (
                <th key={`day-${day}`} className={styles.dayHeaderCell} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body: 10 rows (one per week) */}
          <tbody>
            {programme.map((week) => (
              <tr key={`week-${week.week}`} className={styles.weekRow}>
                {/* Sticky week label */}
                <th className={styles.weekLabelCell} scope="row">
                  Week {week.week}
                </th>

                {/* One cell per day */}
                {WEEKDAYS.map((dayName: Weekday) => {
                  const dayPlan = week.days.find((d) => d.day === dayName);
                  return (
                    <td key={`week-${week.week}-${dayName}`} className={styles.contentCell}>
                      {dayPlan && (
                        <PlannerDayCell
                          dayPlan={dayPlan}
                          week={week.week}
                          onAddWorkshop={onAddWorkshop}
                          onDeleteWorkshop={onDeleteWorkshop}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile hint */}
      {scrollPosition < 100 && (
        <div className={styles.scrollHint} aria-live="polite">
          ← Scroll to view more →
        </div>
      )}
    </div>
  );
};
