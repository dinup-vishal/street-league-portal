/**
 * SchedulerTabs.tsx
 * Tab navigation wrapper for Planner and Recommendation views
 */

import React, { useState } from 'react';
import styles from './SchedulerTabs.module.css';


import { PlannerView } from './PlannerView';
import { RecommendationView } from './RecommendationView';

type TabType = 'planner' | 'recommendation';

interface SchedulerTabsProps {}

export const SchedulerTabs: React.FC<SchedulerTabsProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('planner');

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeTab === 'planner' ? styles.active : ''}`}
          onClick={() => setActiveTab('planner')}
          role="tab"
          aria-selected={activeTab === 'planner'}
          aria-controls="planner-panel"
        >
          <span className={styles.tabIcon}>📋</span>
          Planner
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'recommendation' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommendation')}
          role="tab"
          aria-selected={activeTab === 'recommendation'}
          aria-controls="recommendation-panel"
        >
          <span className={styles.tabIcon}>💡</span>
          Recommendation
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Planner Tab */}
        <div
          className={`${styles.tabPanel} ${activeTab === 'planner' ? styles.visible : ''}`}
          id="planner-panel"
          role="tabpanel"
          aria-labelledby="planner-tab"
        >
          <PlannerView />
        </div>

        {/* Recommendation Tab */}
        <div
          className={`${styles.tabPanel} ${activeTab === 'recommendation' ? styles.visible : ''}`}
          id="recommendation-panel"
          role="tabpanel"
          aria-labelledby="recommendation-tab"
        >
          <RecommendationView />
        </div>
      </div>
    </div>
  );
};
