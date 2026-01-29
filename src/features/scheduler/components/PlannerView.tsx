/**
 * PlannerView.tsx
 * Custom planner allowing users to create workshops from lessons
 * Displays 10-week template with empty workshop slots
 */

import React, { useState } from 'react';
import type { Cohort, Programme, Segment } from '../types';
import { buildMockProgramme } from '../mock/mockProgramme';
import { PlannerGrid } from './PlannerGrid';
import { CreateWorkshopModal } from './CreateWorkshopModal';
import styles from './PlannerView.module.css';

interface PlannerViewProps {
  cohort: Cohort;
}

interface CustomSegment extends Segment {
  lessonId?: string;
  lessonName?: string;
}

interface CustomProgrammeWeek {
  week: number;
  days: Array<{
    day: string;
    segments: CustomSegment[];
  }>;
}

interface CustomProgramme extends Array<CustomProgrammeWeek> {}

export const PlannerView: React.FC<PlannerViewProps> = () => {
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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    week: number;
    day: string;
    segmentId: string;
  } | null>(null);

  const handleAddWorkshop = (
    week: number,
    day: string,
    segmentId: string
  ) => {
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
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Planner View</h1>
          <p className={styles.subtitle}>Create custom workshops for your 10-week programme</p>
        </div>
      </header>

      <div className={styles.content}>
        <PlannerGrid
          programme={customProgramme}
          onAddWorkshop={handleAddWorkshop}
          onDeleteWorkshop={handleDeleteWorkshop}
        />
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
