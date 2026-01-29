/**
 * MainPanel.tsx
 * Right-side main content area
 * Displays the form for the currently selected step
 */

import React from 'react';
import type { Step } from '../types';
import { PlaceholderForm } from './PlaceholderForm';
import { LessonPlansForm } from './forms';
import styles from './MainPanel.module.css';

interface MainPanelProps {
  step: Step | null;
}

export const MainPanel: React.FC<MainPanelProps> = ({ step }) => {
  return (
    <main className={styles.mainContainer} id="main">
      {!step ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>No Step Selected</h2>
          <p className={styles.emptyText}>
            Select a step from the navigation to begin configuring your programme.
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.stepTitle}>{step.name}</h1>
            {step.description && (
              <p className={styles.stepDescription}>{step.description}</p>
            )}
          </header>

          <section className={styles.formSection}>
            {step.id === 'step-2-4' ? (
              <LessonPlansForm />
            ) : (
              <PlaceholderForm title={step.name} />
            )}
          </section>
        </div>
      )}
    </main>
  );
};
