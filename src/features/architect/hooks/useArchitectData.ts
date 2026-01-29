/**
 * useArchitectData.ts
 * Custom hook to access and manage Programme Architect Portal data
 * Provides methods to retrieve configured phases/steps and save data for use in scheduler
 */

import { useCallback } from 'react';
import { loadArchitectData, ARCHITECT_STORAGE_KEY } from '../phases.mock';
import type { ArchitectData, Phase, Step } from '../types';

export interface UseArchitectDataReturn {
  data: ArchitectData | null;
  getAllPhases: () => Phase[];
  getSelectedStep: () => Step | null;
  getExpandedPhases: () => string[];
  exportForScheduler: () => {
    phases: Phase[];
    selectedStepId?: string;
  };
  clearData: () => void;
}

/**
 * Hook to interact with Programme Architect data
 * Used by Scheduler and other components to access configured data
 */
export function useArchitectData(): UseArchitectDataReturn {
  const data = loadArchitectData();

  const getAllPhases = useCallback((): Phase[] => {
    const savedData = loadArchitectData();
    return savedData?.phases || [];
  }, []);

  const getSelectedStep = useCallback((): Step | null => {
    const savedData = loadArchitectData();
    if (!savedData?.selectedStepId) return null;

    const phases = savedData.phases || [];
    for (const phase of phases) {
      const step = phase.steps.find((s: Step) => s.id === savedData.selectedStepId);
      if (step) return step;
    }
    return null;
  }, []);

  const getExpandedPhases = useCallback((): string[] => {
    const savedData = loadArchitectData();
    return savedData?.expandedPhaseIds || [];
  }, []);

  /**
   * Export data in a format suitable for the Scheduler
   * This allows the scheduler to use configured phases and steps
   */
  const exportForScheduler = useCallback(() => {
    const savedData = loadArchitectData();
    return {
      phases: savedData?.phases || [],
      selectedStepId: savedData?.selectedStepId,
    };
  }, []);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(ARCHITECT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear architect data:', error);
    }
  }, []);

  return {
    data,
    getAllPhases,
    getSelectedStep,
    getExpandedPhases,
    exportForScheduler,
    clearData,
  };
}
