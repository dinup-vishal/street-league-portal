/**
 * TimeGrid Component
 * Displays a single week with time slots as rows and days as columns
 * Time slots are consistent across all weeks
 * Supports drag-and-drop staff assignment to workshop segments (not breaks)
 */

import React, { useState } from 'react';
import type { Segment, Weekday, SegmentAssignment, Staff } from '../types';
import { TIME_SLOTS } from '../mock/mockProgramme';
import styles from './TimeGrid.module.css';

interface TimeGridProps {
  weekNumber: number;
  days: Array<{
    day: Weekday;
    segments: Segment[];
  }>;
  assignments: SegmentAssignment[];
  staff: Staff[];
  onDrop: (segmentId: string, weekNumber: number, day: Weekday, staffId: string) => void;
  disabledStaffIds?: Set<string>; // Staff who reached 4 workshops this week
}

const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export const TimeGrid: React.FC<TimeGridProps> = ({
  weekNumber,
  days,
  assignments,
  staff,
  onDrop,
}) => {
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // Build a map of segment ID to assigned staff for this week
  const assignmentMap = new Map<string, string[]>();
  assignments
    .filter((a) => a.week === weekNumber)
    .forEach((a) => {
      assignmentMap.set(a.segmentId, a.staffIds);
    });

  // Get workshop cells for this week (only Workshop category, not breaks)
  // Note: This is for reference but assignments are fetched directly from the assignment list

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, cellId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverCell(cellId);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, segment: Segment, day: Weekday) => {
    e.preventDefault();
    setDragOverCell(null);

    if (segment.category === 'Break') return; // Can't assign staff to breaks

    try {
      const staffData = e.dataTransfer.getData('application/json');
      if (!staffData) return;

      const staffMember = JSON.parse(staffData);
      onDrop(segment.id, weekNumber, day, staffMember.id);
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  const getStaffName = (staffId: string): string => {
    return staff.find((s) => s.id === staffId)?.name || 'Unknown';
  };

  return (
    <div className={styles.weekContainer}>
      <h3 className={styles.weekTitle}>Week {weekNumber}</h3>

      <div className={styles.gridWrapper}>
        <table className={styles.timeGrid} role="table" aria-label={`Week ${weekNumber} schedule`}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Time</th>
              {WEEKDAYS.map((day) => (
                <th key={`day-${day}`} className={styles.dayHeader}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={`slot-${slot.id}`} className={styles.timeRow}>
                <td className={styles.timeCell}>
                  <div className={styles.timeLabel}>
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className={styles.timeDuration}>{slot.durationMinutes}m</div>
                </td>

                {WEEKDAYS.map((day) => {
                  const dayPlan = days.find((d) => d.day === day);
                  const segment = dayPlan?.segments.find((s) => s.timeSlotId === slot.id);

                  const cellId = `${weekNumber}-${day}-${slot.id}`;
                  const isBreak = segment?.category === 'Break';
                  const assignedStaffIds = segment ? assignmentMap.get(segment.id) || [] : [];

                  return (
                    <td key={`${day}-${slot.id}`} className={styles.contentCell}>
                      {segment && !isBreak ? (
                        <div
                          className={`${styles.workshop} ${dragOverCell === cellId ? styles.dragOver : ''}`}
                          onDragOver={(e) => handleDragOver(e, cellId)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, segment, day)}
                          role="region"
                          aria-label={`${segment.title}, ${segment.durationMinutes} minutes`}
                        >
                          <div className={styles.workshopHeader}>
                            <div className={styles.workshopTitle}>{segment.title}</div>
                            <span className={`${styles.category} ${styles[`cat-${segment.category}`]}`}>
                              {segment.category}
                            </span>
                          </div>

                          {/* Assigned Staff Display */}
                          {assignedStaffIds.length > 0 && (
                            <div className={styles.assignedStaff}>
                              {assignedStaffIds.map((staffId) => (
                                <div key={staffId} className={styles.staffBadge}>
                                  {getStaffName(staffId)}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Drop hint */}
                          {assignedStaffIds.length === 0 && (
                            <div className={styles.dropHint}>Drag staff here</div>
                          )}
                        </div>
                      ) : isBreak ? (
                        <div className={styles.breakCell}>
                          <div className={styles.breakLabel}>Break</div>
                          <div className={styles.breakDuration}>{segment.durationMinutes}m</div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
