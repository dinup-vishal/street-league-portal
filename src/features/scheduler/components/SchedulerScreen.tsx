/**
 * SchedulerScreen Component
 * Full-page scheduler with horizontal tabs (Planner & Recommendation)
 */

import React, { useState } from 'react';
import type { Cohort } from '../types';
import { PlannerView } from './PlannerView';
import { RecommendationView } from './RecommendationView';
import styles from './SchedulerScreen.module.css';

interface SchedulerScreenProps {
  cohort: Cohort;
}

export const SchedulerScreen: React.FC<SchedulerScreenProps> = ({ cohort }) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'recommendation'>('planner');

  return (
    <div className={styles.screenContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Schedule: {cohort.cohortCode}</h1>
          <p className={styles.subtitle}>
            Create custom workshops and assign staff to your 10-week programme
          </p>
        </div>
      </header>

      {/* Horizontal Tab Navigation */}
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'planner' ? styles.active : ''}`}
          onClick={() => setActiveTab('planner')}
          aria-selected={activeTab === 'planner'}
        >
          📋 Planner
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'recommendation' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommendation')}
          aria-selected={activeTab === 'recommendation'}
        >
          💡 Recommendation
        </button>
      </nav>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'planner' && <PlannerView cohort={cohort} />}
        {activeTab === 'recommendation' && <RecommendationView cohort={cohort} />}
      </div>
    </div>
  );
};

export default SchedulerScreen;
