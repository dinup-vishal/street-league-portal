/**
 * LessonPlansTabbed.tsx
 * Tab navigation wrapper for Lesson Plans management and mapping
 */

import React, { useState } from 'react';
import styles from './LessonPlansTabbed.module.css';

import { ManageLessonPlans } from './ManageLessonPlans';
import { LessonPlansForm } from './LessonPlansForm';

type TabType = 'manage' | 'mapping';

export const LessonPlansTabbed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('manage');

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeTab === 'manage' ? styles.active : ''}`}
          onClick={() => setActiveTab('manage')}
          role="tab"
          aria-selected={activeTab === 'manage'}
          aria-controls="manage-panel"
        >
          <span className={styles.tabIcon}>📝</span>
          Manage Lesson Plans
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'mapping' ? styles.active : ''}`}
          onClick={() => setActiveTab('mapping')}
          role="tab"
          aria-selected={activeTab === 'mapping'}
          aria-controls="mapping-panel"
        >
          <span className={styles.tabIcon}>🔗</span>
          Lesson Plan Mapping
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Manage Tab */}
        <div
          className={`${styles.tabPanel} ${activeTab === 'manage' ? styles.visible : ''}`}
          id="manage-panel"
          role="tabpanel"
          aria-labelledby="manage-tab"
        >
          <ManageLessonPlans />
        </div>

        {/* Mapping Tab */}
        <div
          className={`${styles.tabPanel} ${activeTab === 'mapping' ? styles.visible : ''}`}
          id="mapping-panel"
          role="tabpanel"
          aria-labelledby="mapping-tab"
        >
          <LessonPlansForm />
        </div>
      </div>
    </div>
  );
};
