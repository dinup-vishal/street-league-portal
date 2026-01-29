/**
 * PlannerDayCell.tsx
 * Day cell for planner with create/edit workshop functionality
 */

import React from 'react';
import styles from './PlannerDayCell.module.css';

interface CustomSegment {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  lessonId?: string;
  lessonName?: string;
}

interface PlannerDayCellProps {
  dayPlan: {
    day: string;
    segments: CustomSegment[];
  };
  week: number;
  onAddWorkshop: (week: number, day: string, segmentId: string) => void;
  onDeleteWorkshop: (week: number, day: string, segmentId: string) => void;
}

export const PlannerDayCell: React.FC<PlannerDayCellProps> = ({
  dayPlan,
  week,
  onAddWorkshop,
  onDeleteWorkshop,
}) => {
  const isWorkshop = (segment: CustomSegment) => segment.category === 'Workshop';
  const isBreak = (segment: CustomSegment) => segment.category === 'Break';
  const hasLesson = (segment: CustomSegment) => !!segment.lessonId;

  return (
    <div className={styles.cellContainer}>
      <div className={styles.cellContent}>
        {dayPlan.segments.map((seg) => (
          <div
            key={seg.id}
            className={`${styles.segmentRow} ${styles[`cat-${seg.category.toLowerCase()}`]}`}
          >
            {isBreak(seg) ? (
              // Break - display as-is
              <>
                <span className={styles.segmentTitle}>{seg.title}</span>
                <span className={styles.segmentDuration}>{seg.durationMinutes}m</span>
              </>
            ) : isWorkshop(seg) ? (
              // Workshop - show lesson if created, otherwise show create button
              <>
                {hasLesson(seg) ? (
                  // Workshop created
                  <div className={styles.workshopContainer}>
                    <div className={styles.workshopContent}>
                      <span className={styles.workshopTitle}>{seg.title}</span>
                      <span className={styles.lessonBadge}>{seg.lessonName}</span>
                      <span className={styles.workshopDuration}>{seg.durationMinutes}m</span>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDeleteWorkshop(week, dayPlan.day, seg.id)}
                      title="Delete workshop"
                      aria-label="Delete workshop"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  // Empty workshop slot
                  <button
                    className={styles.createBtn}
                    onClick={() => onAddWorkshop(week, dayPlan.day, seg.id)}
                    title="Create workshop"
                  >
                    + Create Workshop
                  </button>
                )}
              </>
            ) : (
              // Other category - display as-is
              <>
                <span className={styles.segmentTitle}>{seg.title}</span>
                <span className={styles.segmentDuration}>{seg.durationMinutes}m</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
