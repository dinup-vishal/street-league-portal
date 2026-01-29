/**
 * Shared types for Programme Architect Portal
 */

export interface Step {
  id: string;
  name: string;
  description?: string;
}

export interface Phase {
  id: string;
  name: string;
  steps: Step[];
}

export interface ArchitectData {
  phases: Phase[];
  selectedStepId?: string;
  expandedPhaseIds: string[];
}
