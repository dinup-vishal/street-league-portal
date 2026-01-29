/**
 * PROGRAMME ARCHITECT PORTAL - INTEGRATION GUIDE
 * 
 * This guide explains how to integrate the Programme Architect Portal with
 * other features like the Scheduler, and how to use the locally-stored data.
 */

/**
 * ========================================
 * QUICK START: Using the Portal
 * ========================================
 * 
 * 1. Import and render the AppShell:
 * 
 *    import { AppShell } from '@/features/architect';
 * 
 *    function ArchitectPage() {
 *      return <AppShell />;
 *    }
 * 
 * 2. Open the page and:
 *    - Click phases to expand/collapse
 *    - Click steps to view and configure
 *    - Data auto-saves to localStorage
 */

/**
 * ========================================
 * ACCESSING DATA FROM OTHER FEATURES
 * ========================================
 * 
 * Use the useArchitectData() hook in any component:
 * 
 *    import { useArchitectData } from '@/features/architect';
 * 
 *    function MyComponent() {
 *      const {
 *        data,
 *        getAllPhases,
 *        getSelectedStep,
 *        getExpandedPhases,
 *        exportForScheduler,
 *        clearData,
 *      } = useArchitectData();
 * 
 *      // Use the data...
 *    }
 */

/**
 * ========================================
 * HOOK METHODS EXPLAINED
 * ========================================
 */

/**
 * 1. data: ArchitectData | null
 * 
 * The raw saved data object containing:
 * - phases: Phase[] (all configured phases)
 * - selectedStepId?: string (current step)
 * - expandedPhaseIds: string[] (expanded phases)
 * 
 * Example:
 *   const { data } = useArchitectData();
 *   console.log(data?.selectedStepId);
 */

/**
 * 2. getAllPhases(): Phase[]
 * 
 * Returns all configured phases from localStorage.
 * Useful for populating dropdowns, lists, or passing to other components.
 * 
 * Example:
 *   const { getAllPhases } = useArchitectData();
 *   const phases = getAllPhases();
 *   phases.forEach(phase => console.log(phase.name));
 */

/**
 * 3. getSelectedStep(): Step | null
 * 
 * Returns the currently selected step, or null if none selected.
 * Useful for showing what the user is currently configuring.
 * 
 * Example:
 *   const { getSelectedStep } = useArchitectData();
 *   const step = getSelectedStep();
 *   if (step) console.log(`Selected: ${step.name}`);
 */

/**
 * 4. getExpandedPhases(): string[]
 * 
 * Returns array of phase IDs that are expanded.
 * Useful for UI state synchronization.
 * 
 * Example:
 *   const { getExpandedPhases } = useArchitectData();
 *   const expandedIds = getExpandedPhases();
 */

/**
 * 5. exportForScheduler(): { phases, selectedStepId? }
 * 
 * Returns data in a format optimized for the Scheduler.
 * This is the main method for scheduler integration!
 * 
 * Example in SchedulerScreen.tsx:
 * 
 *   import { useArchitectData } from '@/features/architect';
 * 
 *   function SchedulerScreen() {
 *     const { exportForScheduler } = useArchitectData();
 *     const schedulerData = exportForScheduler();
 * 
 *     // Use schedulerData.phases to populate scheduler UI
 *     // Use schedulerData.selectedStepId to initialize selections
 *   }
 */

/**
 * 6. clearData(): void
 * 
 * Clears all architect data from localStorage.
 * Use cautiously - this deletes all configuration!
 * 
 * Example:
 *   const { clearData } = useArchitectData();
 *   const handleReset = () => {
 *     if (window.confirm('Clear all architect data?')) {
 *       clearData();
 *     }
 *   };
 */

/**
 * ========================================
 * INTEGRATION WITH SCHEDULER
 * ========================================
 * 
 * Here's how to integrate the Scheduler with Architect Portal data:
 * 
 * 1. In SchedulerScreen.tsx, import the hook:
 * 
 *    import { useArchitectData } from '@/features/architect';
 * 
 * 2. Get the exported data:
 * 
 *    function SchedulerScreen() {
 *      const { exportForScheduler, getSelectedStep } = useArchitectData();
 *      const { phases, selectedStepId } = exportForScheduler();
 * 
 *      // Now you have:
 *      // - phases: Phase[] with structure from Architect
 *      // - selectedStepId: the current step being configured
 * 
 *      return (
 *        <>
 *          <h1>Scheduler for: {getSelectedStep()?.name}</h1>
 *          {/* Render scheduler UI using phases data */}
 *        </>
 *      );
 *    }
 * 
 * 3. Map Architect phases/steps to Scheduler concepts:
 *    - Use Phase names as section titles
 *    - Use Step descriptions to provide context
 *    - Build schedule/roster based on selected step
 */

/**
 * ========================================
 * LOCAL STORAGE STRUCTURE
 * ========================================
 * 
 * All data is stored under the key: "street-league:architect-portal"
 * 
 * Structure:
 * {
 *   "street-league:architect-portal": {
 *     "phases": [
 *       {
 *         "id": "phase-1",
 *         "name": "Foundation Setup",
 *         "steps": [
 *           {
 *             "id": "step-1-1",
 *             "name": "Geographic Setup",
 *             "description": "Define geographical regions..."
 *           },
 *           ...
 *         ]
 *       },
 *       ...
 *     ],
 *     "selectedStepId": "step-1-1",
 *     "expandedPhaseIds": ["phase-1"]
 *   }
 * }
 * 
 * You can manually inspect/clear this in browser DevTools:
 * 
 *    // In browser console:
 *    localStorage.getItem('street-league:architect-portal')
 *    localStorage.removeItem('street-league:architect-portal')
 *    localStorage.clear() // WARNING: clears ALL local data
 */

/**
 * ========================================
 * EXTENDING THE ARCHITECT PORTAL
 * ========================================
 * 
 * To add real forms to the placeholders:
 * 
 * 1. Create a new component for each step type:
 * 
 *    src/features/architect/forms/
 *    ├── GeographicSetupForm.tsx
 *    ├── StaffManagementForm.tsx
 *    ├── SkillsForm.tsx
 *    └── ...
 * 
 * 2. Update MainPanel.tsx to conditionally render forms:
 * 
 *    import { GeographicSetupForm } from '../forms/GeographicSetupForm';
 *    
 *    <MainPanel step={step} />
 *    // becomes
 *    <MainPanel step={step} renderForm={(step) => {
 *      if (step.id === 'step-1-1') return <GeographicSetupForm />;
 *      if (step.id === 'step-1-2') return <StaffManagementForm />;
 *      // etc.
 *    }} />
 * 
 * 3. Each form should save its data to a context or custom hook
 * 
 * 4. Export the combined data alongside phases via useArchitectData()
 */

/**
 * ========================================
 * EXAMPLE: Scheduler Integration
 * ========================================
 * 
 * Here's a complete example showing the Scheduler using Architect data:
 * 
 *   import React from 'react';
 *   import { useArchitectData } from '@/features/architect';
 *   
 *   function SchedulerScreen() {
 *     const {
 *       getAllPhases,
 *       getSelectedStep,
 *       exportForScheduler,
 *     } = useArchitectData();
 *   
 *     const schedulerData = exportForScheduler();
 *     const currentStep = getSelectedStep();
 *     const allPhases = getAllPhases();
 *   
 *     if (!currentStep) {
 *       return <div>Please configure a step in Architect Portal first</div>;
 *     }
 *   
 *     // Find which phase contains the current step
 *     const currentPhase = allPhases.find(p =>
 *       p.steps.some(s => s.id === currentStep.id)
 *     );
 *   
 *     return (
 *       <div className={styles.schedulerContainer}>
 *         <header>
 *           <h1>Scheduler Setup</h1>
 *           <p>Phase: {currentPhase?.name}</p>
 *           <p>Step: {currentStep.name}</p>
 *         </header>
 *   
 *         <main>
 *           {/* Render scheduling UI here */}
 *           {/* Use schedulerData.phases to populate dropdowns, lists, etc */}
 *         </main>
 *       </div>
 *     );
 *   }
 * 
 *   export default SchedulerScreen;
 */

/**
 * ========================================
 * DATA FLOW DIAGRAM
 * ========================================
 * 
 * User Configuration Flow:
 * 
 *  AppShell (Architect Portal)
 *      ↓
 *  User selects step
 *      ↓
 *  AppShell state updates
 *      ↓
 *  saveArchitectData() called
 *      ↓
 *  Data written to localStorage
 * 
 * 
 * Data Consumption Flow:
 * 
 *  Other Component (e.g., Scheduler)
 *      ↓
 *  useArchitectData() hook
 *      ↓
 *  loadArchitectData() called
 *      ↓
 *  Data read from localStorage
 *      ↓
 *  exportForScheduler() returns optimized format
 *      ↓
 *  Component renders using architect data
 */

/**
 * ========================================
 * TESTING ARCHITECT DATA
 * ========================================
 * 
 * To verify data is saving correctly:
 * 
 * 1. Open browser DevTools (F12)
 * 2. Go to Application → Local Storage
 * 3. Look for key: "street-league:architect-portal"
 * 4. Expand each phase, change selections
 * 5. Refresh page - selections should persist
 * 
 * To test Scheduler integration:
 * 
 * 1. Use Architect Portal to configure phases
 * 2. Export data: useArchitectData().exportForScheduler()
 * 3. In Scheduler component, verify data loads
 * 4. Console.log to debug data flow
 */

/**
 * ========================================
 * TYPESCRIPT TYPES
 * ========================================
 * 
 * Import these types in other features:
 * 
 *   import type { Phase, Step, ArchitectData } from '@/features/architect';
 * 
 *   interface Phase {
 *     id: string;
 *     name: string;
 *     steps: Step[];
 *   }
 *   
 *   interface Step {
 *     id: string;
 *     name: string;
 *     description?: string;
 *   }
 *   
 *   interface ArchitectData {
 *     phases: Phase[];
 *     selectedStepId?: string;
 *     expandedPhaseIds: string[];
 *   }
 */

/**
 * ========================================
 * TROUBLESHOOTING
 * ========================================
 * 
 * Q: Data not persisting across page reloads?
 * A: Check localStorage is enabled and not full.
 *    Open DevTools Console: localStorage.getItem('street-league:architect-portal')
 * 
 * Q: Scheduler not seeing Architect data?
 * A: Ensure useArchitectData() is called in Scheduler component.
 *    Verify Architect Portal was used to configure data first.
 * 
 * Q: Want to reset everything?
 * A: useArchitectData().clearData() or:
 *    localStorage.removeItem('street-league:architect-portal')
 * 
 * Q: Want to manually load data elsewhere?
 * A: import { loadArchitectData } from '@/features/architect';
 *    const data = loadArchitectData();
 */

export {};
