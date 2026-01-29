/**
 * RecommendationView.tsx
 * Original scheduler screen - displays recommended schedule
 * Allows staff assignment to recommended workshops
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Programme, SegmentAssignment, Staff as StaffType, Weekday } from '../types';
import { TimeGrid } from './TimeGrid';
import { UpdatedStaffListPanel } from './UpdatedStaffListPanel';
import { buildMockProgramme } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { isStaffAvailableForProgramme } from '../utils/dateMap';
import styles from './SchedulerScreen.module.css';

// Helper function to get default Monday date
const getDefaultMonday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(monday.getDate() + daysToMonday);
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const RecommendationView: React.FC = () => {
  // Initialize with default Monday
  const defaultDate = getDefaultMonday();
  const [startDate, setStartDate] = useState<string>(defaultDate);
  const [mondayWarning, setMondayWarning] = useState(false);
  const [assignments, setAssignments] = useState<SegmentAssignment[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  const programme: Programme = buildMockProgramme();
  const staff: StaffType[] = mockStaff;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);

    if (value) {
      const selected = new Date(value);
      const isMonday = selected.getDay() === 1;
      setMondayWarning(!isMonday);
    } else {
      setMondayWarning(false);
    }
  };

  // Filter available staff for the programme
  const availableStaff = useMemo(() => {
    if (!startDate) return [];
    return staff.filter((s) => isStaffAvailableForProgramme(s.availabilityPeriod?.startDateISO, startDate));
  }, [staff, startDate]);

  // Handle drop - assign staff to a segment
  const handleDrop = useCallback(
    (segmentId: string, week: number, day: string, staffId: string) => {
      const existingAssignment = assignments.find(
        (a) => a.segmentId === segmentId && a.week === week && a.day === (day as Weekday)
      );

      if (existingAssignment) {
        if (existingAssignment.staffIds.includes(staffId)) {
          const updated = {
            ...existingAssignment,
            staffIds: existingAssignment.staffIds.filter((id) => id !== staffId),
          };
          if (updated.staffIds.length === 0) {
            setAssignments(assignments.filter((a) => a !== existingAssignment));
          } else {
            setAssignments(assignments.map((a) => (a === existingAssignment ? updated : a)));
          }
        } else {
          setAssignments(
            assignments.map((a) =>
              a === existingAssignment
                ? { ...a, staffIds: [...a.staffIds, staffId] }
                : a
            )
          );
        }
      } else {
        setAssignments([
          ...assignments,
          {
            segmentId,
            week,
            day: day as Weekday,
            staffIds: [staffId],
          },
        ]);
      }
    },
    [assignments]
  );

  // Get disabled staff for current week
  const disabledStaffIds = new Set<string>();
  assignments
    .filter((a) => a.week === currentWeek)
    .forEach((a) => {
      a.staffIds.forEach((id) => {
        const count = assignments.filter(
          (a2) => a2.week === currentWeek && a2.staffIds.includes(id)
        ).length;
        if (count >= 4) disabledStaffIds.add(id);
      });
    });

  // Check if a week is fully assigned
  const isWeekComplete = useCallback(
    (week: number): boolean => {
      const weekProgramme = programme[week - 1];
      if (!weekProgramme) return false;

      const allWorkshops: string[] = [];
      weekProgramme.days.forEach((day) => {
        day.segments.forEach((seg) => {
          if (seg.category !== 'Break') {
            allWorkshops.push(seg.id);
          }
        });
      });

      if (allWorkshops.length === 0) return false;

      const assignedInWeek = new Set<string>();
      assignments
        .filter((a) => a.week === week && a.staffIds.length > 0)
        .forEach((a) => {
          assignedInWeek.add(a.segmentId);
        });

      return allWorkshops.every((ws) => assignedInWeek.has(ws));
    },
    [programme, assignments]
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Recommendation View</h1>
          <p className={styles.subtitle}>View recommended schedule and assign staff</p>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sectionTitle}>Programme Setup</h2>

            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date (Monday)
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={handleDateChange}
                className={styles.input}
              />
              {mondayWarning && (
                <p className={styles.warning}>⚠️ Selected date is not a Monday</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Area - Always show grid */}
        <main className={styles.mainArea}>
          {/* Week Selector */}
          <div className={styles.weekSelector}>
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className={styles.weekNavButton}
            >
              ← Previous
            </button>

            <div className={styles.weekDisplay}>
              {Array.from({ length: programme.length }, (_, i) => i + 1).map((week) => {
                const isComplete = isWeekComplete(week);
                return (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`${styles.weekButton} ${currentWeek === week ? styles.active : ''} ${
                      isComplete ? styles.complete : ''
                    }`}
                    aria-current={currentWeek === week ? 'page' : undefined}
                    title={isComplete ? 'Week fully assigned' : ''}
                  >
                    {week}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentWeek(Math.min(programme.length, currentWeek + 1))}
              disabled={currentWeek === programme.length}
              className={styles.weekNavButton}
            >
              Next →
            </button>
          </div>

          {/* Week Content */}
          <div className={styles.weekContent}>
            {/* Time Grid */}
            <div className={styles.gridArea}>
              {programme[currentWeek - 1] && (
                <TimeGrid
                  weekNumber={currentWeek}
                  days={programme[currentWeek - 1]!.days}
                  assignments={assignments}
                  staff={availableStaff}
                  onDrop={handleDrop}
                  disabledStaffIds={disabledStaffIds}
                />
              )}
            </div>

            {/* Staff Panel */}
            <div className={styles.staffArea}>
              <UpdatedStaffListPanel
                staff={availableStaff}
                weekNumber={currentWeek}
                assignments={assignments}
                startDate={startDate}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
