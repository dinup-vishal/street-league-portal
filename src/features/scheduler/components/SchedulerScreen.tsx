/**
 * SchedulerScreen Component
 * Full-page scheduler replacing the modal
 * Displays 10 weeks as separate grids with time slots
 * Supports drag-and-drop staff assignment
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cohort, Programme, SegmentAssignment, Staff as StaffType } from '../types';
import { TimeGrid } from './TimeGrid';
import { UpdatedStaffListPanel } from './UpdatedStaffListPanel';
import { buildMockProgramme } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { generateDateMapping, toISO } from '../utils/dateMap';
import styles from './SchedulerScreen.module.css';

interface SchedulerScreenProps {
  cohort: Cohort;
}

export const SchedulerScreen: React.FC<SchedulerScreenProps> = ({ cohort }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
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

  // Handle drop - assign staff to a segment
  const handleDrop = useCallback(
    (segmentId: string, week: number, day: string, staffId: string) => {
      // Check if staff already assigned to this segment
      const existingAssignment = assignments.find(
        (a) => a.segmentId === segmentId && a.week === week && a.day === (day as any)
      );

      if (existingAssignment) {
        if (existingAssignment.staffIds.includes(staffId)) {
          // Remove staff from this segment
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
          // Add staff to this segment
          setAssignments(
            assignments.map((a) =>
              a === existingAssignment
                ? { ...a, staffIds: [...a.staffIds, staffId] }
                : a
            )
          );
        }
      } else {
        // Create new assignment
        setAssignments([
          ...assignments,
          {
            segmentId,
            week,
            day: day as any,
            staffIds: [staffId],
          },
        ]);
      }
    },
    [assignments]
  );

  // Get disabled staff for current week (those with 4+ workshops)
  const disabledStaffIds = new Set<string>();
  assignments
    .filter((a) => a.week === currentWeek)
    .forEach((a) => {
      a.staffIds.forEach((staffId) => {
        const count = assignments
          .filter((assign) => assign.week === currentWeek && assign.staffIds.includes(staffId))
          .length;
        if (count >= 4) {
          disabledStaffIds.add(staffId);
        }
      });
    });

  const handleSave = () => {
    const newErrors: string[] = [];

    if (!startDate) {
      newErrors.push('Start date is required.');
    }

    if (assignments.length === 0) {
      newErrors.push('Please assign staff to at least one workshop.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Send to backend
    console.log('Schedule payload:', {
      cohortId: cohort.cohortId,
      startDateISO: toISO(new Date(startDate)),
      assignments,
      dateMapping: generateDateMapping(new Date(startDate) as any),
    });

    setErrors([]);
    // Navigate back to scheduler page
    navigate('/scheduler');
  };

  const handleCancel = () => {
    if (
      assignments.length > 0 &&
      !window.confirm('You have unsaved assignments. Are you sure?')
    ) {
      return;
    }
    navigate('/scheduler');
  };

  return (
    <div className={styles.screenContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Schedule: {cohort.cohortCode}</h1>
          <p className={styles.subtitle}>
            Assign staff to workshops across the 10-week programme
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar - Controls & Info */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sectionTitle}>Programme Setup</h2>

            {/* Date Picker */}
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

            {/* Cohort Info */}
            <div className={styles.cohortInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Cohort:</span>
                <span className={styles.infoValue}>{cohort.cohortCode}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Academy:</span>
                <span className={styles.infoValue}>{cohort.academyId}</span>
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className={styles.errorSection}>
              <h3 className={styles.errorTitle}>Issues</h3>
              <ul className={styles.errorList}>
                {errors.map((err, idx) => (
                  <li key={idx} className={styles.errorItem}>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Assignments:</span>
              <span className={styles.summaryValue}>{assignments.length}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Current Week:</span>
              <span className={styles.summaryValue}>{currentWeek}/10</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={!startDate || assignments.length === 0}
            >
              Save Schedule
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </aside>

        {/* Main Grid Area */}
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
              {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => (
                <button
                  key={week}
                  onClick={() => setCurrentWeek(week)}
                  className={`${styles.weekButton} ${currentWeek === week ? styles.active : ''}`}
                  aria-current={currentWeek === week ? 'page' : undefined}
                >
                  {week}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentWeek(Math.min(10, currentWeek + 1))}
              disabled={currentWeek === 10}
              className={styles.weekNavButton}
            >
              Next →
            </button>
          </div>

          {/* Current Week Grid + Staff Panel */}
          <div className={styles.weekContent}>
            {/* Time Grid */}
            <div className={styles.gridArea}>
              {programme[currentWeek - 1] && (
                <TimeGrid
                  weekNumber={currentWeek}
                  days={programme[currentWeek - 1]!.days}
                  assignments={assignments}
                  staff={staff}
                  onDrop={handleDrop}
                  disabledStaffIds={disabledStaffIds}
                />
              )}
            </div>

            {/* Staff Panel */}
            <div className={styles.staffArea}>
              <UpdatedStaffListPanel
                staff={staff}
                weekNumber={currentWeek}
                assignments={assignments}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchedulerScreen;
