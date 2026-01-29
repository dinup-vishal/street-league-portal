/**
 * VerticalNav.tsx
 * Left-side vertical navigation showing phases and steps
 * Phases are collapsible, steps are selectable
 */

import React from 'react';
import type { Phase, Step } from '../types';
import { NavSection } from './NavSection';
import styles from './VerticalNav.module.css';

interface VerticalNavProps {
  phases: Phase[];
  expandedPhaseIds: string[];
  selectedStep: Step | null;
  onTogglePhase: (phaseId: string) => void;
  onSelectStep: (step: Step) => void;
}

export const VerticalNav: React.FC<VerticalNavProps> = ({
  phases,
  expandedPhaseIds,
  selectedStep,
  onTogglePhase,
  onSelectStep,
}) => {
  return (
    <nav className={styles.navContainer} aria-label="Phase Navigation">
      <div className={styles.navHeader}>
        <h2 className={styles.navTitle}>Programme Setup</h2>
      </div>

      <div className={styles.phaseList}>
        {phases.map((phase) => (
          <NavSection
            key={phase.id}
            phase={phase}
            expanded={expandedPhaseIds.includes(phase.id)}
            selectedStep={selectedStep}
            onToggle={() => onTogglePhase(phase.id)}
            onSelectStep={onSelectStep}
          />
        ))}
      </div>
    </nav>
  );
};
