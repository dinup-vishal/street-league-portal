/**
 * PlannerView.tsx
 * Custom planner with workshop creation modal and staff assignment
 * Layout matches Recommendation view with additional workshop creation capability
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Programme, SegmentAssignment, Staff as StaffType, Weekday, Segment } from '../types';
import { buildMockProgramme } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { isStaffAvailableForProgramme } from '../utils/dateMap';
import { UpdatedStaffListPanel } from './UpdatedStaffListPanel';
import { CreateWorkshopModal } from './CreateWorkshopModal';
import styles from './SchedulerScreen.module.css';
import gridStyles from './PlannerGrid.module.css';

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

interface CustomSegment extends Segment {
  lessonId?: string;
  lessonName?: string;
}

interface CustomDayPlan {
  day: string;
  segments: CustomSegment[];
}

interface CustomProgrammeWeek {
  week: number;
  days: CustomDayPlan[];
}

export const PlannerView: React.FC = () => {
  // Initialize custom programme with base structure
  const baseProgramme: Programme = buildMockProgramme();
  const [customProgramme, setCustomProgramme] = useState<CustomProgrammeWeek[]>(
    baseProgramme.map((week) => ({
      week: week.week,
      days: week.days.map((day) => ({
        day: day.day,
        segments: day.segments as CustomSegment[],
      })),
    }))
  );

  // State management - initialize with default Monday
  const defaultDate = getDefaultMonday();
  const [startDate, setStartDate] = useState<string>(defaultDate);
  const [mondayWarning, setMondayWarning] = useState(false);
  const [assignments, setAssignments] = useState<SegmentAssignment[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Modal state for workshop creation
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    week: number;
    day: string;
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

  // Handle drop - assign staff to a workshop segment
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

  // Check if a week is fully assigned (all workshops have at least 1 staff)
  const isWeekComplete = useCallback(
    (week: number): boolean => {
      const weekProgramme = customProgramme[week - 1];
      if (!weekProgramme) return false;

      const allWorkshops: string[] = [];
      weekProgramme.days.forEach((day) => {
        day.segments.forEach((seg) => {
          if (seg.category === 'Workshop' && seg.lessonId) {
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

  // Handle workshop creation from modal
  const handleAddWorkshop = (week: number, day: string, segmentId: string) => {
    setSelectedSlot({ week, day, segmentId });
    setModalOpen(true);
  };

  const handleCreateWorkshop = (
    lessonId: string,
    lessonName: string,
    workshopName: string
  ) => {
    if (!selectedSlot) return;

    setCustomProgramme((prev) => {
      return prev.map((week) => {
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
                    category: 'Workshop' as const,
                  };
                }
                return segment;
              }),
            };
          }),
        };
      });
    });

    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleDeleteWorkshop = (week: number, day: string, segmentId: string) => {
    setCustomProgramme((prev) => {
      return prev.map((w) => {
        if (w.week !== week) return w;

        return {
          ...w,
          days: w.days.map((d) => {
            if (d.day !== day) return d;

            return {
              ...d,
              segments: d.segments.map((seg) => {
                if (seg.id === segmentId && seg.category === 'Workshop' && seg.lessonId) {
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
      });
    });
  };

  const getStaffName = (staffId: string): string => {
    return staff.find((s) => s.id === staffId)?.name || 'Unknown';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Planner View</h1>
          <p className={styles.subtitle}>
            Create custom workshops and assign staff to your 10-week programme
          </p>
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

        {/* Main Area */}
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
              {Array.from({ length: customProgramme.length }, (_, i) => i + 1).map((week) => {
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
              onClick={() => setCurrentWeek(Math.min(customProgramme.length, currentWeek + 1))}
              disabled={currentWeek === customProgramme.length}
              className={styles.weekNavButton}
            >
              Next →
            </button>
          </div>

          {/* Week Content */}
          <div className={styles.weekContent}>
            {/* Custom Workshop Grid */}
            <div className={styles.gridArea}>
              {customProgramme[currentWeek - 1] && (
                <div className={gridStyles.gridWrapper}>
                  <table className={gridStyles.workshopGrid}>
                    <thead>
                      <tr>
                        <th className={gridStyles.timeHeader}>Time</th>
                        {customProgramme[currentWeek - 1]!.days.map((day) => (
                          <th key={day.day}>{day.day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customProgramme[currentWeek - 1]!.days[0]?.segments.map((_, segIdx) => (
                        <tr key={segIdx}>
                          <td className={gridStyles.timeLabel}>
                            <span className={gridStyles.segment}>Segment {segIdx + 1}</span>
                          </td>
                          {customProgramme[currentWeek - 1]!.days.map((day) => {
                            const segment = day.segments[segIdx];
                            if (!segment) return <td key={day.day} />;

                            return (
                              <td key={`${day.day}-${segment.id}`} className={gridStyles.workshopCell}>
                                {segment.category === 'Break' ? (
                                  <div className={gridStyles.breakSegment}>
                                    <span>{segment.title}</span>
                                    <span className={gridStyles.duration}>({segment.durationMinutes}m)</span>
                                  </div>
                                ) : segment.lessonId ? (
                                  <div
                                    className={gridStyles.workshopBox}
                                    draggable
                                    onDragStart={(e) => {
                                      e.dataTransfer.effectAllowed = 'move';
                                      e.dataTransfer.setData(
                                        'application/json',
                                        JSON.stringify({
                                          type: 'workshop',
                                          segmentId: segment.id,
                                          week: currentWeek,
                                          day: day.day,
                                        })
                                      );
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.dataTransfer.dropEffect = 'copy';
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      try {
                                        const data = JSON.parse(e.dataTransfer.getData('application/json'));
                                        if (data.type === 'staff') {
                                          handleDrop(segment.id, currentWeek, day.day, data.staffId);
                                        }
                                      } catch {
                                        console.error('Drop error:', e);
                                      }
                                    }}
                                  >
                                    <div className={gridStyles.workshopContent}>
                                      <span className={gridStyles.workshopTitle}>{segment.title}</span>
                                      <span className={gridStyles.lessonBadge}>{segment.lessonName}</span>
                                    </div>
                                    <button
                                      className={gridStyles.deleteBtn}
                                      onClick={() =>
                                        handleDeleteWorkshop(currentWeek, day.day, segment.id)
                                      }
                                      aria-label="Delete workshop"
                                      title="Delete"
                                    >
                                      ×
                                    </button>
                                    {/* Staff assigned to this workshop */}
                                    <div className={gridStyles.staffBadges}>
                                      {assignments
                                        .filter(
                                          (a) =>
                                            a.segmentId === segment.id &&
                                            a.week === currentWeek &&
                                            a.day === day.day
                                        )
                                        .flatMap((a) => a.staffIds)
                                        .map((staffId) => (
                                          <span key={staffId} className={gridStyles.staffTag}>
                                            {getStaffName(staffId)}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    className={gridStyles.createBtn}
                                    onClick={() =>
                                      handleAddWorkshop(currentWeek, day.day, segment.id)
                                    }
                                  >
                                    Create Workshop
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Staff Panel - Drag Source */}
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
    </div>
  );
};
