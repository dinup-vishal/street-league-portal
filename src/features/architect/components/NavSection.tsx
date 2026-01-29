/**
 * NavSection.tsx
 * A single collapsible phase section in the vertical navigation
 * Displays phase header with toggle and child steps when expanded
 */

import React from 'react';
import type { Phase, Step } from '../types';
import styles from './NavSection.module.css';

interface NavSectionProps {
  phase: Phase;
  expanded: boolean;
  selectedStep: Step | null;
  onToggle: () => void;
  onSelectStep: (step: Step) => void;
}

export const NavSection: React.FC<NavSectionProps> = ({
  phase,
  expanded,
  selectedStep,
  onToggle,
  onSelectStep,
}) => {
  const handlePhaseKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const handleStepKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    step: Step
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectStep(step);
    }
  };

  const contentId = `phase-content-${phase.id}`;

  return (
    <div className={styles.section}>
      {/* Phase header button */}
      <button
        className={styles.phaseHeader}
        onClick={onToggle}
        onKeyDown={handlePhaseKeyDown}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <span className={styles.chevron}>{expanded ? '▼' : '▶'}</span>
        <span className={styles.phaseName}>{phase.name}</span>
      </button>

      {/* Collapsible steps list */}
      {expanded && (
        <ul className={styles.stepsList} id={contentId}>
          {phase.steps.map((step) => {
            const isSelected = selectedStep?.id === step.id;
            return (
              <li key={step.id} className={styles.stepItem}>
                <button
                  className={`${styles.stepButton} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSelectStep(step)}
                  onKeyDown={(e) => handleStepKeyDown(e, step)}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  <span className={styles.stepName}>{step.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
