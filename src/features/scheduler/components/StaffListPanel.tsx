/**
 * StaffListPanel Component
 * Side-by-side staff list with drag-and-drop capabilities
 * Filters available staff based on selected date and 10-week timeframe
 */

import React, { useMemo } from 'react';
import type { Staff } from '../types';
import { getAvailabilityStatus } from '../mock/mockStaff';
import { WEEKDAYS, mapWeekdayToDate } from '../utils/dateMap';
import styles from './StaffListPanel.module.css';

interface StaffListPanelProps {
  staff: Staff[];
  startDate: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, staff: Staff) => void;
  selectedStaff?: string[];
}

export const StaffListPanel: React.FC<StaffListPanelProps> = ({
  staff,
  startDate,
  onDragStart,
  selectedStaff = [],
}) => {
  // Calculate available staff based on date range
  const availableStaff = useMemo(() => {
    if (!startDate) return staff;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + 70); // 10 weeks = 70 days

    return staff.filter((s) => {
      // Check if staff is available for at least one day in the timeframe
      return WEEKDAYS.some((day) => {
        const staffDay = s.availability.find((a) => a.day === day);
        if (!staffDay) return false;

        // Check if within date range and time window
        const dayDate = mapWeekdayToDate(startDateObj, 1, day);
        return dayDate >= startDateObj && dayDate <= endDateObj;
      });
    });
  }, [staff, startDate]);

  // Group staff by role
  const staffByRole = useMemo(() => {
    return {
      Coach: availableStaff.filter((s) => s.role === 'Coach'),
      Facilitator: availableStaff.filter((s) => s.role === 'Facilitator'),
      Coordinator: availableStaff.filter((s) => s.role === 'Coordinator'),
    };
  }, [availableStaff]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, staffMember: Staff) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(staffMember));
    onDragStart?.(e, staffMember);
  };

  const emptyMessage = !startDate ? 'Select a start date to see available staff' : 'No staff available for selected dates';

  if (availableStaff.length === 0) {
    return (
      <div className={styles.panelContainer}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Available Staff</h3>
          <span className={styles.staffCount}>0</span>
        </div>
        <div className={styles.emptyState}>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Available Staff</h3>
        <span className={styles.staffCount}>{availableStaff.length}</span>
      </div>

      <div className={styles.panelContent}>
        {/* Coaches */}
        {staffByRole.Coach.length > 0 && (
          <div className={styles.roleSection}>
            <h4 className={styles.roleTitle}>Coaches ({staffByRole.Coach.length})</h4>
            <div className={styles.staffGrid}>
              {staffByRole.Coach.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  isSelected={selectedStaff.includes(s.id)}
                  onDragStart={(e) => handleDragStart(e, s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Facilitators */}
        {staffByRole.Facilitator.length > 0 && (
          <div className={styles.roleSection}>
            <h4 className={styles.roleTitle}>Facilitators ({staffByRole.Facilitator.length})</h4>
            <div className={styles.staffGrid}>
              {staffByRole.Facilitator.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  isSelected={selectedStaff.includes(s.id)}
                  onDragStart={(e) => handleDragStart(e, s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Coordinators */}
        {staffByRole.Coordinator.length > 0 && (
          <div className={styles.roleSection}>
            <h4 className={styles.roleTitle}>Coordinators ({staffByRole.Coordinator.length})</h4>
            <div className={styles.staffGrid}>
              {staffByRole.Coordinator.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  isSelected={selectedStaff.includes(s.id)}
                  onDragStart={(e) => handleDragStart(e, s)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        <p className={styles.dragHint}>📌 Drag staff to assign to workshops</p>
      </div>
    </div>
  );
};

interface StaffCardProps {
  staff: Staff;
  isSelected?: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, isSelected, onDragStart }) => {
  const mondayAvail = getAvailabilityStatus(staff, 'Monday');

  return (
    <div
      className={`${styles.staffCard} ${isSelected ? styles.selected : ''}`}
      draggable
      onDragStart={onDragStart}
      role="button"
      tabIndex={0}
      aria-label={`${staff.name}, ${staff.role}`}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          // Future: Add click handler for selection
        }
      }}
    >
      <div className={styles.cardName}>{staff.name}</div>
      <div className={styles.cardRole}>{staff.role}</div>
      <div className={`${styles.cardAvail} ${styles[`avail-${mondayAvail}`]}`}>{mondayAvail}</div>
    </div>
  );
};
