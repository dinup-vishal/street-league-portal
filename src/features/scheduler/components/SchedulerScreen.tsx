/**
 * SchedulerScreen Component
 * Full-page scheduler with tabbed interface (Planner & Recommendation)
 */

import React from 'react';
import type { Cohort } from '../types';
import { SchedulerTabs } from './SchedulerTabs';
import styles from './SchedulerScreen.module.css';

interface SchedulerScreenProps {
  cohort: Cohort;
}

export const SchedulerScreen: React.FC<SchedulerScreenProps> = ({ cohort }) => {

  return (
    <div className={styles.screenContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Schedule: {cohort.cohortCode}</h1>
          <p className={styles.subtitle}>
            Manage your programme with the Planner or assign staff with Recommendations
          </p>
        </div>
      </header>

      {/* Tab Navigation & Content */}
      <SchedulerTabs />
    </div>
  );
};

export default SchedulerScreen;
