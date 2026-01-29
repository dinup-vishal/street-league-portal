/**
 * DayCell Component
 * Displays segments inline within the cell (no tooltip, full breakdown)
 */

import React from 'react';
import type { DayPlan, Segment } from '../types';
import styles from './DayCell.module.css';

interface DayCellProps {
  dayPlan: DayPlan;
  onSegmentClick?: (segment: Segment) => void;
}

export const DayCell: React.FC<DayCellProps> = ({ dayPlan, onSegmentClick }) => {
  return (
    <div className={styles.cellContainer}>
      <div className={styles.cellContent}>
        {dayPlan.segments.map((seg: Segment) => (
          <div
            key={seg.id}
            className={styles.segmentRow}
            role="button"
            tabIndex={0}
            onClick={() => onSegmentClick?.(seg)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSegmentClick?.(seg);
              }
            }}
            aria-label={`${seg.title}, ${seg.durationMinutes} minutes, ${seg.category}`}
          >
            <span className={styles.segmentTitle}>{seg.title}</span>
            <span className={styles.segmentDuration}>{seg.durationMinutes}m</span>
            <span className={`${styles.segmentCategory} ${styles[`cat-${seg.category}`]}`}>
              {seg.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
