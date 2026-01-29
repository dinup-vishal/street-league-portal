/**
 * ProgrammeGrid Component
 * Displays a 10×4 (weeks × days) read-only schedule grid
 */

import React, { useState } from 'react';
import type { Programme, Weekday, ProgrammeWeek, DayPlan as DayPlanType } from '../types';
import { DayCell } from './DayCell';
import styles from './ProgrammeGrid.module.css';

interface ProgrammeGridProps {
  programme: Programme;
}

export const ProgrammeGrid: React.FC<ProgrammeGridProps> = ({ programme }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition((e.currentTarget as HTMLDivElement).scrollLeft);
  };

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridContainer} onScroll={handleScroll}>
        <table className={styles.grid} role="table" aria-label="10-week programme schedule">
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
            {programme.map((week: ProgrammeWeek) => (
              <tr key={`week-${week.week}`} className={styles.weekRow}>
                {/* Sticky week label */}
                <th className={styles.weekLabelCell} scope="row">
                  Week {week.week}
                </th>

                {/* One cell per day */}
                {WEEKDAYS.map((dayName: Weekday) => {
                  const dayPlan = week.days.find((d: DayPlanType) => d.day === dayName);
                  return (
                    <td key={`week-${week.week}-${dayName}`} className={styles.contentCell}>
                      {dayPlan && <DayCell dayPlan={dayPlan} />}
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
