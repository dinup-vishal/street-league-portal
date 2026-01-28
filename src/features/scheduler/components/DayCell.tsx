/**
 * DayCell Component
 * Displays a compact read-only breakdown of a single day's segments
 */

import React, { useState } from 'react';
import type { DayPlan, Segment } from '../types';
import styles from './DayCell.module.css';

interface DayCellProps {
  dayPlan: DayPlan;
}

export const DayCell: React.FC<DayCellProps> = ({ dayPlan }) => {
  const [expandOpen, setExpandOpen] = useState(false);

  // Compact representation: "WS1 (90m) • Break (15m) • WS2 (60m)"
  const compactText = dayPlan.segments
    .map((seg: Segment) => {
      const shortTitle = seg.title.length > 15 ? seg.title.substring(0, 12) + '…' : seg.title;
      return `${shortTitle} (${seg.durationMinutes}m)`;
    })
    .join(' • ');

  // Full breakdown for tooltip/expanded view
  const fullText = dayPlan.segments.map((seg: Segment) => `${seg.title} – ${seg.durationMinutes} min`).join('\n');

  const toggleExpand = () => {
    setExpandOpen(!expandOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  };

  return (
    <div className={styles.cellContainer}>
      <div
        className={styles.cellContent}
        title={fullText}
        role="button"
        tabIndex={0}
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        aria-expanded={expandOpen}
        aria-label={`${dayPlan.day} schedule: ${fullText.replace(/\n/g, ', ')}`}
      >
        <span className={styles.compactText}>{compactText}</span>
        <button
          className={styles.expandBtn}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
          aria-label={expandOpen ? 'Collapse schedule details' : 'Expand schedule details'}
          title={expandOpen ? 'Collapse' : 'Expand'}
        >
          {expandOpen ? '▲' : '▼'}
        </button>
      </div>

      {expandOpen && (
        <div className={styles.expandedOverlay} role="region" aria-live="polite">
          <div className={styles.expandedContent}>
            {dayPlan.segments.map((seg: Segment) => (
              <div key={seg.id} className={styles.segmentRow}>
                <span className={styles.segmentTitle}>{seg.title}</span>
                <span className={styles.segmentDuration}>{seg.durationMinutes}m</span>
                <span className={`${styles.segmentCategory} ${styles[`cat-${seg.category}`]}`}>
                  {seg.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
