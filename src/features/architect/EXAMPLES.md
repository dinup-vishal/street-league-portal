/**
 * Example: How to integrate Architect Portal into your main app
 * 
 * This file shows practical examples of how to use AppShell and hooks
 * in real application pages and routes.
 */

// ============================================
// EXAMPLE 1: Simple Route Integration
// ============================================

// pages/ArchitectPortalPage.tsx
import React from 'react';
import { AppShell } from '@/features/architect';

export function ArchitectPortalPage() {
  return (
    <div style={{ height: '100vh' }}>
      <AppShell />
    </div>
  );
}

// ============================================
// EXAMPLE 2: Scheduler Using Architect Data
// ============================================

// pages/SchedulerPage.tsx
import React from 'react';
import { useArchitectData } from '@/features/architect';
import { SchedulerScreen } from '@/features/scheduler';

export function SchedulerPage() {
  const {
    getAllPhases,
    getSelectedStep,
    exportForScheduler,
  } = useArchitectData();

  const selectedStep = getSelectedStep();
  const architectData = exportForScheduler();

  if (!selectedStep) {
    return (
      <div className="empty-state">
        <h2>Configuration Required</h2>
        <p>
          Please configure phases and steps in the{' '}
          <a href="/architect">Architect Portal</a> first.
        </p>
      </div>
    );
  }

  return (
    <SchedulerScreen
      phaseId={selectedStep.id}
      phases={architectData.phases}
    />
  );
}

// ============================================
// EXAMPLE 3: Dashboard Showing Status
// ============================================

// pages/DashboardPage.tsx
import React from 'react';
import { useArchitectData } from '@/features/architect';

export function DashboardPage() {
  const {
    getAllPhases,
    getSelectedStep,
    getExpandedPhases,
  } = useArchitectData();

  const phases = getAllPhases();
  const selectedStep = getSelectedStep();
  const expandedPhaseIds = getExpandedPhases();

  return (
    <div className="dashboard">
      <h1>Street League Portal</h1>

      <section className="config-status">
        <h2>Configuration Status</h2>
        <div className="status-card">
          <div className="label">Phases Configured:</div>
          <div className="value">{phases.length}/3</div>
        </div>

        <div className="status-card">
          <div className="label">Current Step:</div>
          <div className="value">
            {selectedStep ? selectedStep.name : 'None selected'}
          </div>
        </div>

        <div className="status-card">
          <div className="label">Expanded Phases:</div>
          <div className="value">{expandedPhaseIds.length}</div>
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Actions</h2>
        <a href="/architect" className="btn btn-primary">
          Configure Programme
        </a>
        <a href="/scheduler" className="btn btn-secondary">
          Open Scheduler
        </a>
      </section>

      <section className="phases-overview">
        <h2>Programme Structure</h2>
        {phases.map((phase) => (
          <div key={phase.id} className="phase-card">
            <h3>{phase.name}</h3>
            <p className="step-count">{phase.steps.length} steps</p>
            <ul className="steps-list">
              {phase.steps.map((step) => (
                <li key={step.id}>
                  <span className="step-name">{step.name}</span>
                  {selectedStep?.id === step.id && (
                    <span className="badge badge-active">Current</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Navigation Component
// ============================================

// components/AppNavigation.tsx
import React from 'react';
import { useArchitectData } from '@/features/architect';

export function AppNavigation() {
  const { getSelectedStep } = useArchitectData();
  const selectedStep = getSelectedStep();

  return (
    <nav className="app-nav">
      <ul>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/architect">
            Architect Portal
            {selectedStep && (
              <span className="badge">{selectedStep.name}</span>
            )}
          </a>
        </li>
        <li>
          <a href="/scheduler">Scheduler</a>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
      </ul>
    </nav>
  );
}

// ============================================
// EXAMPLE 5: Settings with Data Reset
// ============================================

// pages/SettingsPage.tsx
import React from 'react';
import { useArchitectData } from '@/features/architect';

export function SettingsPage() {
  const { clearData, data } = useArchitectData();

  const handleClearArchitectData = () => {
    if (
      window.confirm(
        'Are you sure? This will clear all programme configuration. This action cannot be undone.'
      )
    ) {
      clearData();
      window.alert('Programme configuration cleared');
      // Optionally redirect to architect portal
      window.location.href = '/architect';
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <section className="setting-section">
        <h2>Programme Configuration</h2>

        <div className="setting-item">
          <label>Data Storage:</label>
          <p className="description">
            Your programme configuration is stored locally in your browser.
            {data ? ' Data is currently saved.' : ' No data has been configured yet.'}
          </p>
        </div>

        <div className="setting-item">
          <label>Clear Configuration:</label>
          <button
            onClick={handleClearArchitectData}
            className="btn btn-danger"
          >
            Clear All Data
          </button>
          <p className="description">
            This will remove all phases, steps, and configuration settings.
            This action cannot be undone.
          </p>
        </div>
      </section>

      <section className="setting-section">
        <h2>Data Export</h2>
        <button
          onClick={() => {
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'architect-config.json';
            a.click();
          }}
          className="btn btn-secondary"
        >
          Export Configuration
        </button>
      </section>
    </div>
  );
}

// ============================================
// EXAMPLE 6: App Router Configuration
// ============================================

// routes.tsx (or equivalent in your routing setup)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ArchitectPortalPage } from '@/pages/ArchitectPortalPage';
import { SchedulerPage } from '@/pages/SchedulerPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppNavigation } from '@/components/AppNavigation';

export function AppRoutes() {
  return (
    <>
      <AppNavigation />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/architect" element={<ArchitectPortalPage />} />
        <Route path="/scheduler" element={<SchedulerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

// ============================================
// EXAMPLE 7: Custom Hook for Data Syncing
// ============================================

// hooks/useArchitectSync.ts
// Advanced hook for syncing multiple components with architect data

import { useEffect, useState } from 'react';
import { useArchitectData } from '@/features/architect';
import type { Phase, Step } from '@/features/architect';

export function useArchitectSync() {
  const {
    getAllPhases,
    getSelectedStep,
    getExpandedPhases,
    exportForScheduler,
  } = useArchitectData();

  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load all data synchronously (it's from localStorage)
    const allPhases = getAllPhases();
    const step = getSelectedStep();

    setPhases(allPhases);
    setSelectedStep(step);
    setIsReady(true);
  }, [getAllPhases, getSelectedStep]);

  return {
    phases,
    selectedStep,
    isReady,
    schedulerData: exportForScheduler(),
    expandedPhaseIds: getExpandedPhases(),
  };
}

// Usage in a component:
// function MyComponent() {
//   const { phases, selectedStep, isReady } = useArchitectSync();
//   if (!isReady) return <Loading />;
//   return <YourComponent data={phases} />;
// }

// ============================================
// EXAMPLE 8: Component Using Architect Data
// ============================================

// components/PhaseSelector.tsx
// A dropdown/select component populated from architect data

import React, { useState } from 'react';
import { useArchitectData } from '@/features/architect';

export function PhaseSelector({ onPhaseSelect }: { onPhaseSelect: (phaseId: string) => void }) {
  const { getAllPhases } = useArchitectData();
  const phases = getAllPhases();
  const [selected, setSelected] = useState(phases[0]?.id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onPhaseSelect(e.target.value);
  };

  return (
    <select value={selected} onChange={handleChange}>
      {phases.map((phase) => (
        <option key={phase.id} value={phase.id}>
          {phase.name}
        </option>
      ))}
    </select>
  );
}

// ============================================
// SUMMARY OF KEY INTEGRATION POINTS
// ============================================

/**
 * 1. AppShell: Main wireframe interface
 *    - Render in its own page/route
 *    - Must have full height container (100vh)
 *    - Handles all state and data persistence
 *
 * 2. useArchitectData(): Access data from other components
 *    - Use in Scheduler, Dashboard, Settings
 *    - Non-blocking - returns data synchronously
 *    - Safe to call multiple times
 *
 * 3. Integration Flow:
 *    User configures in Architect → Data saved to localStorage
 *    → Other features import and use via hook → UI updates
 *
 * 4. Storage Key:
 *    "street-league:architect-portal"
 *    Accessible directly via localStorage if needed
 *
 * 5. Data Format:
 *    {
 *      phases: Phase[],
 *      selectedStepId?: string,
 *      expandedPhaseIds: string[]
 *    }
 */
