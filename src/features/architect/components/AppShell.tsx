/**
 * AppShell.tsx
 * Main application shell for the Programme Architect Portal
 * Manages state for phase expansion and step selection
 * Two-column responsive layout with vertical nav and main panel
 */

import React, { useState, useEffect } from 'react';
import { getPhases, loadArchitectData, saveArchitectData } from '../phases.mock';
import type { Phase, Step, ArchitectData } from '../types';
import { VerticalNav } from './VerticalNav';
import { MainPanel } from './MainPanel';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  // Initialize from mock data and localStorage
  useEffect(() => {
    const mockPhases = getPhases();
    setPhases(mockPhases);

    // Try to load from localStorage
    const savedData = loadArchitectData();

    if (savedData && savedData.selectedStepId) {
      // Restore from saved state
      setExpandedPhaseIds(savedData.expandedPhaseIds || [mockPhases[0].id]);

      // Find and set the previously selected step
      for (const phase of mockPhases) {
        const step = phase.steps.find((s) => s.id === savedData.selectedStepId);
        if (step) {
          setSelectedStep(step);
          return;
        }
      }

      // Fallback if saved step not found
      const firstStep = mockPhases[0]?.steps[0];
      if (firstStep) {
        setSelectedStep(firstStep);
        setExpandedPhaseIds([mockPhases[0].id]);
      }
    } else {
      // First time: expand first phase and select its first step
      const firstPhaseId = mockPhases[0]?.id;
      const firstStep = mockPhases[0]?.steps[0];

      if (firstPhaseId) {
        setExpandedPhaseIds([firstPhaseId]);
      }
      if (firstStep) {
        setSelectedStep(firstStep);
      }
    }
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    if (selectedStep) {
      const dataToSave: ArchitectData = {
        phases,
        selectedStepId: selectedStep.id,
        expandedPhaseIds,
      };
      saveArchitectData(dataToSave);
    }
  }, [selectedStep, expandedPhaseIds, phases]);

  const handleTogglePhase = (phaseId: string) => {
    setExpandedPhaseIds((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleSelectStep = (step: Step) => {
    setSelectedStep(step);

    // Ensure the step's parent phase is expanded
    const parentPhase = phases.find((p) => p.steps.some((s) => s.id === step.id));
    if (parentPhase && !expandedPhaseIds.includes(parentPhase.id)) {
      setExpandedPhaseIds((prev) => [...prev, parentPhase.id]);
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Skip link for accessibility */}
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Header (optional) */}
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Programme Architect Portal</h1>
        <p className={styles.appSubtitle}>Configure phases, steps, and programme structure</p>
      </header>

      {/* Two-column layout */}
      <div className={styles.layoutContainer}>
        {/* Left: Vertical Navigation */}
        <VerticalNav
          phases={phases}
          expandedPhaseIds={expandedPhaseIds}
          selectedStep={selectedStep}
          onTogglePhase={handleTogglePhase}
          onSelectStep={handleSelectStep}
        />

        {/* Right: Main Content Panel */}
        <MainPanel step={selectedStep} />
      </div>
    </div>
  );
};
