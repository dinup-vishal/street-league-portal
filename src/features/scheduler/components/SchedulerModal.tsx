/**
 * SchedulerModal Component
 * Main modal for scheduling a 10-week cohort programme
 * Features side-by-side programme grid and staff list with drag-and-drop
 */

import React, { useEffect, useRef, useState } from 'react';
import type { Cohort, SchedulePayload, Programme } from '../types';
import { ProgrammeGrid } from './ProgrammeGrid';
import { StaffListPanel } from './StaffListPanel';
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

    // TODO: Validate staff assignments from drag-and-drop
    // For now, we'll allow saving with just a date

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
        staffIds: [], // TODO: Collect from drag-and-drop assignments
        dateMapping: mapping,
      };

      console.log('Schedule Saved:', payload);
      alert(
        `Schedule created successfully!\n\nCohort: ${cohort.cohortCode}\nStart: ${adjustedStart}`
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
          {/* Start Date Section - Full width */}
          <section className={styles.dateSection}>
            <h2 className={styles.sectionTitle}>Select Start Date</h2>
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

          {/* Two-Column Layout: Programme Grid + Staff List */}
          <div className={styles.twoColumnLayout}>
            {/* Left: Programme Grid */}
            <section className={styles.gridSection}>
              <h2 className={styles.sectionTitle}>10-Week Programme</h2>
              <p className={styles.sectionDesc}>Drag staff from right panel to assign workshops</p>
              <ProgrammeGrid programme={programme} />
            </section>

            {/* Right: Staff Panel */}
            <section className={styles.staffSection}>
              <StaffListPanel staff={mockStaff} startDate={startDate} />
            </section>
          </div>

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
