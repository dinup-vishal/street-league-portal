/**
 * PlannerView Component
 * Custom planner - replicate RecommendationView with workshop creation capability
 * Users can create custom workshops from lessons via modal
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cohort, Programme, SegmentAssignment, Staff as StaffType, Segment, Weekday } from '../types';
import { UpdatedStaffListPanel } from './UpdatedStaffListPanel';
import { CreateWorkshopModal } from './CreateWorkshopModal';
import { buildMockProgramme, TIME_SLOTS } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { generateDateMapping, toISO, isStaffAvailableForProgramme } from '../utils/dateMap';
import styles from './SchedulerScreen.module.css';
import timeGridStyles from './TimeGrid.module.css';

interface PlannerViewProps {
  cohort: Cohort;
}

// Extended segment with lesson metadata for created workshops
interface CustomSegment extends Segment {
  lessonId?: string;
  lessonName?: string;
}

interface CustomDayPlan {
  day: Weekday;
  segments: CustomSegment[];
}

interface CustomProgrammeWeek {
  week: number;
  days: CustomDayPlan[];
}

export const PlannerView: React.FC<PlannerViewProps> = ({ cohort }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [mondayWarning, setMondayWarning] = useState(false);
  const [assignments, setAssignments] = useState<SegmentAssignment[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Custom programme state - tracks user-created workshops with lesson assignments
  const baseProgramme: Programme = buildMockProgramme();
  const [customProgramme, setCustomProgramme] = useState<CustomProgrammeWeek[]>(() =>
    baseProgramme.map((week) => ({
      week: week.week,
      days: week.days.map((day) => ({
        day: day.day,
        segments: day.segments as CustomSegment[],
      })),
    }))
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    week: number;
    day: Weekday;
    segmentId: string;
  } | null>(null);

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

  // Handle drop - assign staff to a segment (including custom workshops)
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

  // Check if a week is fully assigned (all workshops have at least 1 staff)
  const isWeekComplete = useCallback(
    (week: number): boolean => {
      const weekProgramme = customProgramme[week - 1];
      if (!weekProgramme) return false;

      const allWorkshops: string[] = [];
      weekProgramme.days.forEach((day) => {
        day.segments.forEach((seg) => {
          // Count all non-Break segments (including custom workshops)
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
    [customProgramme, assignments]
  );

  // Auto-assign staff to workshops
  const handleAutoAssign = useCallback(() => {
    if (!startDate) {
      setErrors(['Please select a start date first']);
      return;
    }

    const newAssignments = [...assignments];
    const staffWorkshopCount = new Map<string, number>();

    // Initialize workshop count
    availableStaff.forEach((s) => staffWorkshopCount.set(s.id, 0));

    // Get all workshops for current week (non-Break segments)
    const weekProgramme = customProgramme[currentWeek - 1];
    if (!weekProgramme) return;

    const workshopsToAssign: Array<{ segmentId: string; day: any }> = [];
    weekProgramme.days.forEach((day) => {
      day.segments.forEach((seg) => {
        if (seg.category !== 'Break') {
          workshopsToAssign.push({ segmentId: seg.id, day: day.day });
        }
      });
    });

    // Assign staff to workshops (one per workshop, max 4 per staff)
    for (const workshop of workshopsToAssign) {
      // Find first available staff (not yet at 4 workshops)
      const assignableStaff = availableStaff.find((s) => {
        const count = staffWorkshopCount.get(s.id) || 0;
        // Check if already assigned to this workshop
        const alreadyAssigned = newAssignments.some(
          (a) => a.segmentId === workshop.segmentId && a.staffIds.includes(s.id)
        );
        return count < 4 && !alreadyAssigned;
      });

      if (assignableStaff) {
        // Check if assignment already exists
        const existing = newAssignments.find(
          (a) => a.segmentId === workshop.segmentId && a.week === currentWeek && a.day === workshop.day
        );

        if (existing) {
          if (!existing.staffIds.includes(assignableStaff.id)) {
            existing.staffIds.push(assignableStaff.id);
            staffWorkshopCount.set(assignableStaff.id, (staffWorkshopCount.get(assignableStaff.id) || 0) + 1);
          }
        } else {
          newAssignments.push({
            segmentId: workshop.segmentId,
            week: currentWeek,
            day: workshop.day,
            staffIds: [assignableStaff.id],
          });
          staffWorkshopCount.set(assignableStaff.id, (staffWorkshopCount.get(assignableStaff.id) || 0) + 1);
        }
      }
    }

    setAssignments(newAssignments);
  }, [startDate, customProgramme, currentWeek, assignments, availableStaff]);

  // Open modal to create a workshop
  const handleAddWorkshop = (week: number, day: Weekday, segmentId: string) => {
    setSelectedSlot({ week, day, segmentId });
    setModalOpen(true);
  };

  // Create a workshop when modal is submitted
  const handleCreateWorkshop = (
    lessonId: string,
    lessonName: string,
    workshopName: string
  ) => {
    if (!selectedSlot) return;

    setCustomProgramme((prev) =>
      prev.map((week) => {
        if (week.week !== selectedSlot.week) return week;

        return {
          ...week,
          days: week.days.map((day) => {
            if (day.day !== selectedSlot.day) return day;

            return {
              ...day,
              segments: day.segments.map((segment) => {
                if (segment.id === selectedSlot.segmentId) {
                  return {
                    ...segment,
                    title: workshopName,
                    lessonId,
                    lessonName,
                  };
                }
                return segment;
              }),
            };
          }),
        };
      })
    );

    setModalOpen(false);
    setSelectedSlot(null);
  };

  // Delete a workshop (revert to blank)
  const handleDeleteWorkshop = (week: number, day: Weekday, segmentId: string) => {
    setCustomProgramme((prev) =>
      prev.map((w) => {
        if (w.week !== week) return w;

        return {
          ...w,
          days: w.days.map((d) => {
            if (d.day !== day) return d;

            return {
              ...d,
              segments: d.segments.map((seg) => {
                if (seg.id === segmentId && seg.lessonId) {
                  return {
                    ...seg,
                    title: 'Workshop',
                    lessonId: undefined,
                    lessonName: undefined,
                  };
                }
                return seg;
              }),
            };
          }),
        };
      })
    );
  };

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
      customProgramme,
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
    <>
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

            {/* Auto Assign Button */}
            <button
              onClick={handleAutoAssign}
              disabled={!startDate || availableStaff.length === 0}
              className={styles.autoAssignButton}
              title={!startDate ? 'Select a date first' : 'Auto assign staff to workshops'}
            >
              Auto Assign Staff
            </button>
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
              <span className={styles.summaryLabel}>Available Staff:</span>
              <span className={styles.summaryValue}>{availableStaff.length}</span>
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
              {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => {
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
              onClick={() => setCurrentWeek(Math.min(10, currentWeek + 1))}
              disabled={currentWeek === 10}
              className={styles.weekNavButton}
            >
              Next →
            </button>
          </div>

          {/* Current Week Grid + Staff Panel */}
          <div className={styles.weekContent}>
            {/* Custom Grid with Workshop Creation */}
            <div className={styles.gridArea}>
              {customProgramme[currentWeek - 1] && (
                <PlannerGrid
                  weekNumber={currentWeek}
                  days={customProgramme[currentWeek - 1]!.days}
                  assignments={assignments}
                  staff={availableStaff}
                  onDrop={handleDrop}
                  onAddWorkshop={handleAddWorkshop}
                  onDeleteWorkshop={handleDeleteWorkshop}
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

      {/* Create Workshop Modal */}
      {modalOpen && selectedSlot && (
        <CreateWorkshopModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSlot(null);
          }}
          onSubmit={handleCreateWorkshop}
          week={selectedSlot.week}
          day={selectedSlot.day}
        />
      )}
    </>
  );
};

// Custom grid component for Planner with workshop creation buttons
interface PlannerGridProps {
  weekNumber: number;
  days: CustomDayPlan[];
  assignments: SegmentAssignment[];
  staff: StaffType[];
  onDrop: (segmentId: string, weekNumber: number, day: string, staffId: string) => void;
  onAddWorkshop: (week: number, day: Weekday, segmentId: string) => void;
  onDeleteWorkshop: (week: number, day: Weekday, segmentId: string) => void;
  disabledStaffIds?: Set<string>;
}

const PlannerGrid: React.FC<PlannerGridProps> = ({
  weekNumber,
  days,
  assignments,
  staff,
  onDrop,
  onAddWorkshop,
  onDeleteWorkshop,
}) => {
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // Build assignment map for this week
  const assignmentMap = new Map<string, string[]>();
  assignments
    .filter((a) => a.week === weekNumber)
    .forEach((a) => {
      assignmentMap.set(a.segmentId, a.staffIds);
    });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, cellId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverCell(cellId);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, segment: CustomSegment, day: Weekday) => {
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

  const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  return (
    <div className={timeGridStyles.weekContainer}>
      <h3 className={timeGridStyles.weekTitle}>Week {weekNumber}</h3>

      <div className={timeGridStyles.gridWrapper}>
        <table className={timeGridStyles.timeGrid} role="table" aria-label={`Week ${weekNumber} schedule`}>
          <thead>
            <tr>
              <th className={timeGridStyles.timeHeader}>Time</th>
              {WEEKDAYS.map((day) => (
                <th key={`day-${day}`} className={timeGridStyles.dayHeader}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot: any) => (
              <tr key={`slot-${slot.id}`} className={timeGridStyles.timeRow}>
                <td className={timeGridStyles.timeCell}>
                  <div className={timeGridStyles.timeLabel}>
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className={timeGridStyles.timeDuration}>{slot.durationMinutes}m</div>
                </td>

                {WEEKDAYS.map((day) => {
                  const dayPlan = days.find((d) => d.day === day);
                  const segment = dayPlan?.segments.find((s) => s.timeSlotId === slot.id);
                  const cellId = `${weekNumber}-${day}-${slot.id}`;
                  const isBreak = segment?.category === 'Break';
                  const assignedStaffIds = segment ? assignmentMap.get(segment.id) || [] : [];
                  const isWorkshopWithLesson = segment && segment.category === 'Workshop' && segment.lessonId;
                  const isEmptyWorkshop = segment && segment.category === 'Workshop' && !segment.lessonId;

                  return (
                    <td key={`${day}-${slot.id}`} className={timeGridStyles.contentCell}>
                      {isBreak ? (
                        <div className={timeGridStyles.breakCell}>
                          <div className={timeGridStyles.breakLabel}>Break</div>
                          <div className={timeGridStyles.breakDuration}>{segment.durationMinutes}m</div>
                        </div>
                      ) : isWorkshopWithLesson ? (
                        <div
                          className={`${timeGridStyles.workshop} ${dragOverCell === cellId ? timeGridStyles.dragOver : ''}`}
                          onDragOver={(e) => handleDragOver(e, cellId)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, segment, day)}
                          role="region"
                          aria-label={`${segment.title}, ${segment.durationMinutes} minutes`}
                        >
                          <div className={timeGridStyles.workshopHeader}>
                            <div className={timeGridStyles.workshopTitle}>{segment.title}</div>
                            <span className={`${timeGridStyles.category} ${timeGridStyles.catWorkshop}`}>
                              {segment.lessonName}
                            </span>
                          </div>

                          {/* Delete button for custom workshops */}
                          <button
                            onClick={() => onDeleteWorkshop(weekNumber, day, segment.id)}
                            className={styles.deleteWorkshopBtn}
                            title="Delete workshop"
                            aria-label="Delete workshop"
                          >
                            ×
                          </button>

                          {/* Assigned Staff Display */}
                          {assignedStaffIds.length > 0 && (
                            <div className={timeGridStyles.assignedStaff}>
                              {assignedStaffIds.map((staffId) => (
                                <div key={staffId} className={timeGridStyles.staffBadge}>
                                  {getStaffName(staffId)}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Drop hint */}
                          {assignedStaffIds.length === 0 && (
                            <div className={timeGridStyles.dropHint}>Drag staff here</div>
                          )}
                        </div>
                      ) : isEmptyWorkshop ? (
                        <button
                          className={styles.createWorkshopBtn}
                          onClick={() => onAddWorkshop(weekNumber, day, segment.id)}
                        >
                          + Create Workshop
                        </button>
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

export default PlannerView;
