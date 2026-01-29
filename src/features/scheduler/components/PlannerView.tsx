/**
 * PlannerView.tsx
 * Custom planner with date selection and staff assignment
 * Mirrors Recommendation view layout with workshop creation from lessons
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Programme, SegmentAssignment, Staff as StaffType } from '../types';
import { buildMockProgramme } from '../mock/mockProgramme';
import { mockStaff } from '../mock/mockStaff';
import { isStaffAvailableForProgramme } from '../utils/dateMap';
import { UpdatedStaffListPanel } from './UpdatedStaffListPanel';
import { CreateWorkshopModal } from './CreateWorkshopModal';
import styles from './SchedulerScreen.module.css';

interface CustomSegment {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  timeSlotId?: string;
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

interface CustomProgramme extends Array<CustomProgrammeWeek> {}

export const PlannerView: React.FC = () => {
  const baseProgramme: Programme = buildMockProgramme();
  const [customProgramme, setCustomProgramme] = useState<CustomProgramme>(
    baseProgramme.map((week) => ({
      week: week.week,
      days: week.days.map((day) => ({
        day: day.day,
        segments: day.segments as CustomSegment[],
      })),
    })) as CustomProgramme
  );

  // State management matching RecommendationView
  const [startDate, setStartDate] = useState<string>('');
  const [mondayWarning, setMondayWarning] = useState(false);
  const [assignments] = useState<SegmentAssignment[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Modal state for workshop creation
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    week: number;
    day: string;
    segmentId: string;
  } | null>(null);

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

  // Note: handleDrop logic can be used for drag-and-drop to staff if needed in future
  
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
      }) as CustomProgramme;
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
      }) as CustomProgramme;
    });
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
        {!startDate ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h2 className={styles.emptyTitle}>Select a Date</h2>
            <p className={styles.emptyText}>Choose a Monday to start planning your workshops.</p>
          </div>
        ) : (
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
              {/* Workshop Grid */}
              <div className={styles.gridArea}>
                {customProgramme[currentWeek - 1] && (
                  <div className={styles.gridWrapper}>
                    {/* Grid with Workshop Buttons */}
                    <table className={styles.grid}>
                      <thead>
                        <tr>
                          <th className={styles.timeHeader}>Time</th>
                          {customProgramme[currentWeek - 1]!.days.map((day) => (
                            <th key={day.day}>{day.day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customProgramme[currentWeek - 1]!.days[0]?.segments.map((_, segIdx) => (
                          <tr key={segIdx}>
                            <td className={styles.timeLabel}>Segment {segIdx + 1}</td>
                            {customProgramme[currentWeek - 1]!.days.map((day) => {
                              const segment = day.segments[segIdx];
                              if (!segment) return <td key={day.day} />;

                              return (
                                <td key={`${day.day}-${segment.id}`} className={styles.cellContent}>
                                  {segment.category === 'Break' ? (
                                    <div className={styles.breakSegment}>
                                      <span>{segment.title}</span>
                                      <span className={styles.duration}>({segment.durationMinutes}m)</span>
                                    </div>
                                  ) : segment.lessonId ? (
                                    <div
                                      className={styles.workshopSegment}
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
                                    >
                                      <div className={styles.workshopContent}>
                                        <span className={styles.workshopTitle}>{segment.title}</span>
                                        <span className={styles.lessonBadge}>{segment.lessonName}</span>
                                      </div>
                                      <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                          handleDeleteWorkshop(currentWeek, day.day, segment.id)
                                        }
                                        aria-label="Delete workshop"
                                        title="Delete"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className={styles.createBtn}
                                      onClick={() =>
                                        handleAddWorkshop(currentWeek, day.day, segment.id)
                                      }
                                    >
                                      Create
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

              {/* Staff Panel - Drag and Drop Target */}
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
        )}
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
