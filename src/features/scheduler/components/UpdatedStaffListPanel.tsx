/**
 * UpdatedStaffListPanel Component
 * Displays staff with:
 * - Current week's workshop assignments
 * - Workshop count for the current week
 * - Disabled state when 4 workshops reached
 * - Draggable cards for assignment
 * - Filtered by availability based on programme start date
 * - Hidden until date is selected
 */

import React, { useMemo } from 'react';
import type { Staff, SegmentAssignment } from '../types';
import { isStaffAvailableForProgramme } from '../utils/dateMap';
import styles from './UpdatedStaffListPanel.module.css';

interface UpdatedStaffListPanelProps {
  staff: Staff[];
  weekNumber: number;
  assignments: SegmentAssignment[];
  startDate?: string; // Programme start date
}

export const UpdatedStaffListPanel: React.FC<UpdatedStaffListPanelProps> = ({
  staff,
  weekNumber,
  assignments,
  startDate,
}) => {
  // Filter staff by availability for the programme
  const availableStaff = useMemo(() => {
    if (!startDate) return []; // Hide staff until date is selected
    return staff.filter((s) => isStaffAvailableForProgramme(s.availabilityPeriod?.startDateISO, startDate));
  }, [staff, startDate]);

  // Count assignments per staff member for the current week
  const assignmentCounts = useMemo(() => {
    const map = new Map<string, number>();
    assignments
      .filter((a) => a.week === weekNumber)
      .forEach((assignment) => {
        assignment.staffIds.forEach((staffId) => {
          const current = map.get(staffId) || 0;
          map.set(staffId, current + 1);
        });
      });

    return map;
  }, [assignments, weekNumber]);

  // Group staff by role
  const staffByRole = useMemo(() => {
    const grouped: Record<string, Staff[]> = {
      Coach: [],
      Facilitator: [],
      Coordinator: [],
    };
    availableStaff.forEach((s) => {
      grouped[s.role]?.push(s);
    });
    return grouped;
  }, [availableStaff]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, staffMember: Staff, isDisabled: boolean) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(staffMember));
  };

  const renderStaffCard = (staffMember: Staff) => {
    const workshopCount = assignmentCounts.get(staffMember.id) || 0;
    const isDisabled = workshopCount >= 4;

    const getAssignedWorkshops = (): string[] => {
      const workshops: string[] = [];
      assignments
        .filter((a) => a.week === weekNumber && a.staffIds.includes(staffMember.id))
        .forEach((a) => {
          // Find segment title from assignments
          workshops.push(`${a.day}`);
        });
      return workshops;
    };

    const assignedWorkshops = getAssignedWorkshops();

    return (
      <div
        key={staffMember.id}
        className={`${styles.staffCard} ${isDisabled ? styles.disabled : ''}`}
        draggable={!isDisabled}
        onDragStart={(e) => handleDragStart(e, staffMember, isDisabled)}
        role="listitem"
        aria-label={`${staffMember.name}, ${workshopCount} workshops assigned`}
      >
        <div className={styles.cardHeader}>
          <div className={styles.staffName}>{staffMember.name}</div>
          <span className={`${styles.workshopCount} ${isDisabled ? styles.countMax : ''}`}>
            {workshopCount}/4
          </span>
        </div>

        {/* Assigned Workshops for this week */}
        {assignedWorkshops.length > 0 && (
          <div className={styles.assignedWorkshops}>
            <div className={styles.assignedLabel}>Assigned:</div>
            <div className={styles.daysList}>
              {assignedWorkshops.map((day, idx) => (
                <span key={idx} className={styles.dayBadge}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disabled indicator */}
        {isDisabled && (
          <div className={styles.disabledMessage}>Max workshops reached</div>
        )}

        {/* Availability */}
        <div className={styles.availability}>
          <span className={styles.availabilityDot}></span>
          Available
        </div>
      </div>
    );
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Coaches & Staff</h3>
        <span className={styles.weekLabel}>Week {weekNumber}</span>
      </div>

      {/* Show message if no date selected */}
      {!startDate && (
        <div className={styles.emptyState}>
          <p>Select a start date to view available staff</p>
        </div>
      )}

      {/* Show message if no available staff */}
      {startDate && availableStaff.length === 0 && (
        <div className={styles.emptyState}>
          <p>No staff available for this date</p>
        </div>
      )}

      {/* Staff by Role */}
      {startDate && availableStaff.length > 0 &&
        Object.entries(staffByRole).map(([role, staffList]) => {
          if (staffList.length === 0) return null;

          const assignedCount = staffList.filter(
            (s) => (assignmentCounts.get(s.id) || 0) > 0
          ).length;
          const maxedCount = staffList.filter((s) => (assignmentCounts.get(s.id) || 0) >= 4).length;

          return (
            <div key={role} className={styles.roleSection}>
              <div className={styles.roleHeader}>
                <span className={styles.roleName}>{role}s</span>
                <div className={styles.roleStats}>
                  <span
                    className={`${styles.badge} ${assignedCount > 0 ? styles.hasBadge : ''}`}
                    title={`${assignedCount} assigned`}
                  >
                    {assignedCount}
                  </span>
                  {maxedCount > 0 && (
                    <span className={`${styles.badge} ${styles.maxedBadge}`} title={`${maxedCount} at max`}>
                      ⚠ {maxedCount}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.staffGrid} role="list">
                {staffList.map((s) => renderStaffCard(s))}
              </div>
            </div>
          );
        })}
    </div>
  );
};
