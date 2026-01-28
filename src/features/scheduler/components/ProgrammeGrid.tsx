/**
 * ProgrammeGrid Component
 * Displays a 4×10 (days × weeks) read-only schedule grid
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
          {/* Header: Week numbers */}
          <thead>
            <tr>
              <th className={styles.dayHeaderCell} scope="col">
                Week
              </th>
              {programme.map((week: ProgrammeWeek) => (
                <th key={`week-${week.week}`} className={styles.weekHeaderCell} scope="col">
                  Week {week.week}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body: 4 rows (one per day) */}
          <tbody>
            {WEEKDAYS.map((dayName) => (
              <tr key={dayName} className={styles.dayRow}>
                {/* Sticky day label */}
                <th className={styles.dayLabelCell} scope="row">
                  {dayName}
                </th>

                {/* One cell per week */}
                {programme.map((week: ProgrammeWeek) => {
                  const dayPlan = week.days.find((d: DayPlanType) => d.day === dayName);
                  return (
                    <td key={`${dayName}-week-${week.week}`} className={styles.contentCell}>
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
          ← Scroll to view more weeks →
        </div>
      )}
    </div>
  );
};
