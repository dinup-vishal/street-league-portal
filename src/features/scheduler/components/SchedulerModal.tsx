/**
 * SchedulerModal Component
 * Main modal for scheduling a 10-week cohort programme
 */

import React, { useEffect, useRef, useState } from 'react';
import type { Cohort, SchedulePayload, Programme } from '../types';
import { ProgrammeGrid } from './ProgrammeGrid';
import { StaffSelect } from './StaffSelect';
import { buildMockProgramme } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { ensureMonday, generateDateMapping, toISO } from '../utils/dateMap';
import styles from './SchedulerModal.module.css';

interface SchedulerModalProps {
  cohort: Cohort;
  onClose: () => void;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({ cohort, onClose }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mondayWarning, setMondayWarning] = useState(false);

  const programme: Programme = buildMockProgramme();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap on mount
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus on close
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  // Handle date change
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

  // Validate and save
  const handleSave = () => {
    const newErrors: string[] = [];

    if (!startDate) {
      newErrors.push('Start date is required.');
    }

    if (selectedStaff.length === 0) {
      newErrors.push('Please select at least one staff member.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      const selectedDate = new Date(startDate);
      const adjustedDate = ensureMonday(selectedDate);

      const { adjustedStart, mapping } = generateDateMapping(toISO(adjustedDate));

      const payload: SchedulePayload = {
        cohortId: cohort.cohortId,
        startDateISO: adjustedStart,
        staffIds: selectedStaff,
        dateMapping: mapping,
      };

      console.log('Schedule Saved:', payload);
      alert(
        `Schedule created successfully!\n\nCohort: ${cohort.cohortCode}\nStart: ${adjustedStart}\nStaff: ${selectedStaff.length}`
      );

      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-labelledby="sched-title"
        aria-describedby="sched-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 id="sched-title" className={styles.title}>
              Schedule 10-Week Programme
            </h1>
            <p id="sched-desc" className={styles.cohortStrip}>
              <strong>Cohort:</strong> {cohort.cohortCode} • <strong>Academy:</strong> {cohort.academyId} •{' '}
              <strong>Day:</strong> {cohort.dayOfWeek} • <strong>Time:</strong> {cohort.sessionTime}
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close scheduler"
            title="Close (Esc)"
          >
            ✕
          </button>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Start Date */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Step 1: Select Start Date</h2>
            <label htmlFor="start-date" className={styles.label}>
              Programme Start Date <span className={styles.required}>*</span>
            </label>
            <input
              ref={firstFocusableRef}
              id="start-date"
              type="date"
              value={startDate}
              onChange={handleDateChange}
              className={styles.dateInput}
              aria-describedby="date-help"
              disabled={isSubmitting}
            />
            <p id="date-help" className={styles.helperText}>
              Programmes run Monday–Thursday. Week 1 starts from the Monday you select. If you pick another day, we
              will auto-adjust to the next Monday on save.
            </p>
            {mondayWarning && (
              <p className={styles.warning} role="alert">
                ⚠ Selected date is not a Monday. We will automatically adjust to the next Monday ({' '}
                {new Date(new Date(startDate).getTime() + (((1 + 7 - new Date(startDate).getDay()) % 7) * 86400000))
                  .toLocaleDateString()}
                ).
              </p>
            )}
          </section>

          {/* Section 2: Programme Grid */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Step 2: Review 10-Week Programme</h2>
            <p className={styles.sectionDesc}>
              The schedule below shows all workshops and activities for each day. You cannot modify individual sessions
              in this release.
            </p>
            <ProgrammeGrid programme={programme} />
          </section>

          {/* Section 3: Staff Selection */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Step 3: Assign Staff</h2>
            <p className={styles.sectionDesc}>
              Select which team members will deliver this cohort. All selected staff will be assigned to the entire
              10-week programme.
            </p>
            <StaffSelect staff={mockStaff} selected={selectedStaff} onChange={setSelectedStaff} />
            {/* TODO: Per-day staff assignment (future scope) */}
          </section>

          {/* Errors */}
          {errors.length > 0 && (
            <div className={styles.errorBox} role="alert">
              <strong>Please fix the following:</strong>
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Schedule'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SchedulerModal;
