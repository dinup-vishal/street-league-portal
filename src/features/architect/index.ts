/**
 * index.ts
 * Main export file for Programme Architect Portal feature
 */

export { AppShell } from './components/AppShell';
export { VerticalNav } from './components/VerticalNav';
export { NavSection } from './components/NavSection';
export { MainPanel } from './components/MainPanel';
export { PlaceholderForm } from './components/PlaceholderForm';

export { getPhases, saveArchitectData, loadArchitectData, ARCHITECT_STORAGE_KEY } from './phases.mock';

export type { Phase, Step, ArchitectData } from './types';

export { useArchitectData } from './hooks/useArchitectData';
