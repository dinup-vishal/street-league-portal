/**
 * PROGRAMME ARCHITECT PORTAL
 * Wireframe Documentation
 * 
 * ========================================
 * PURPOSE
 * ========================================
 * The Programme Architect Portal is a configuration interface where administrators
 * define the structure of the Street League programme including phases, steps, and
 * configuration workflows. Data configured here is persisted locally and can be
 * accessed by other features like the Scheduler.
 *
 * ========================================
 * ARCHITECTURE
 * ========================================
 *
 * COMPONENT HIERARCHY:
 * 
 * AppShell (Container)
 * ├── VerticalNav (Left sidebar)
 * │   └── NavSection (per Phase)
 * │       └── Steps list
 * └── MainPanel (Right content)
 *     └── PlaceholderForm (Form surface)
 *
 * ========================================
 * STATE MANAGEMENT
 * ========================================
 *
 * AppShell manages three pieces of state:
 *
 * 1. phases: Phase[] 
 *    - Loaded from getPhases() on mount
 *    - Immutable during session
 *
 * 2. expandedPhaseIds: string[]
 *    - Tracks which phases are expanded in the nav
 *    - Persisted to localStorage
 *    - Toggled via handleTogglePhase()
 *
 * 3. selectedStep: Step | null
 *    - Currently active step displayed in main panel
 *    - Updated via handleSelectStep()
 *    - Auto-expands parent phase when selected
 *
 * ========================================
 * DATA PERSISTENCE
 * ========================================
 *
 * All state is persisted to localStorage via:
 *
 * Key: "street-league:architect-portal"
 * Format: ArchitectData = { phases, selectedStepId, expandedPhaseIds }
 *
 * Functions:
 * - saveArchitectData(data) → writes to localStorage
 * - loadArchitectData() → reads from localStorage
 * - ARCHITECT_STORAGE_KEY → constant key name
 *
 * Benefits:
 * - User's configuration persists across page reloads
 * - Other features can import and use the saved data
 * - No backend required for this wireframe
 *
 * ========================================
 * ACCESSING DATA FROM OTHER FEATURES
 * ========================================
 *
 * USE THE HOOK: useArchitectData()
 *
 * Example in Scheduler:
 *
 *   import { useArchitectData } from '../architect';
 *
 *   function SchedulerScreen() {
 *     const { data, exportForScheduler, getAllPhases } = useArchitectData();
 *
 *     // Get all configured phases
 *     const phases = getAllPhases();
 *
 *     // Get export-ready data
 *     const schedulerData = exportForScheduler();
 *
 *     // Use in your scheduler logic...
 *   }
 *
 * ========================================
 * MOCK DATA MODEL
 * ========================================
 *
 * Phase 1: Foundation Setup
 *   - Geographic Setup (configure regions/locations)
 *   - Staff Management (add staff, roles, availability)
 *   - Product Types (define offerings)
 *
 * Phase 2: Curriculum Design
 *   - Themes (overarching learning themes)
 *   - Skill Categories (organize skills)
 *   - Skills (individual competencies)
 *   - Lesson Plans (create lessons)
 *   - Skill Mapping (map lessons to skills)
 *
 * Phase 3: Program Deployment
 *   - Academy Creation (set up academies)
 *   - Cohort Formation (create cohorts and intake schedules)
 *
 * ========================================
 * ACCESSIBILITY FEATURES
 * ========================================
 *
 * WCAG 2.2 AA Compliance:
 *
 * ✓ Semantic HTML
 *   - <nav> for navigation
 *   - <main> for content area
 *   - <button> for interactive elements
 *   - <form> for form areas
 *
 * ✓ Keyboard Navigation
 *   - Tab through all focusable elements
 *   - Enter/Space to toggle phases and select steps
 *   - Up/Down arrow support planned for step navigation
 *
 * ✓ ARIA Attributes
 *   - aria-label on nav
 *   - aria-expanded on phase headers
 *   - aria-controls to link controls to content
 *   - aria-current="page" on selected step
 *
 * ✓ Focus Management
 *   - 3px solid #22d3ee outline with 2px offset
 *   - Visible focus ring on all interactive elements
 *   - Skip link to main content
 *
 * ✓ Color Contrast
 *   - All text meets WCAG AA minimum ratio
 *   - Not relying on color alone for information
 *
 * ✓ Motion & Animation
 *   - Respects prefers-reduced-motion media query
 *   - Smooth transitions disabled for users who prefer reduced motion
 *
 * ========================================
 * RESPONSIVE DESIGN
 * ========================================
 *
 * Desktop (>768px):
 *   - Two-column layout
 *   - Left nav fixed width (~300px)
 *   - Right panel takes remaining space
 *
 * Tablet/Mobile (≤768px):
 *   - Stacked layout
 *   - Nav takes 50% height with scroll
 *   - Content takes 50% height with scroll
 *
 * Mobile (<480px):
 *   - Full-width, single column
 *   - Optimized touch targets
 *   - Header subtitle hidden
 *
 * ========================================
 * STYLING APPROACH
 * ========================================
 *
 * CSS Modules for scoped styling:
 * - AppShell.module.css (layout, header)
 * - VerticalNav.module.css (sidebar)
 * - NavSection.module.css (phase sections)
 * - MainPanel.module.css (content area)
 * - PlaceholderForm.module.css (form styling)
 *
 * Color Tokens:
 *   - Text: #0F172A (slate-900)
 *   - Surface: #FFFFFF
 *   - Muted: #64748B (slate-500)
 *   - Border: #E2E8F0 (slate-200)
 *   - Accent: #2563EB (blue-600)
 *   - Focus: #22D3EE (cyan-400)
 *
 * ========================================
 * EXTENDING THE WIREFRAME
 * ========================================
 *
 * To add actual forms:
 * 1. Replace PlaceholderForm content with real fields
 * 2. Add validation using a form library (react-hook-form, etc.)
 * 3. Update the form submission to persist step-specific data
 * 4. Export configured data structure for other features
 *
 * To integrate with Scheduler:
 * 1. In SchedulerScreen, call useArchitectData()
 * 2. Use getAllPhases() to populate phase/step selectors
 * 3. Use exportForScheduler() to seed scheduler UI
 * 4. Create mapping between architect steps and scheduler components
 *
 * ========================================
 * FILE STRUCTURE
 * ========================================
 *
 * src/features/architect/
 * ├── components/
 * │   ├── AppShell.tsx
 * │   ├── AppShell.module.css
 * │   ├── VerticalNav.tsx
 * │   ├── VerticalNav.module.css
 * │   ├── NavSection.tsx
 * │   ├── NavSection.module.css
 * │   ├── MainPanel.tsx
 * │   ├── MainPanel.module.css
 * │   ├── PlaceholderForm.tsx
 * │   └── PlaceholderForm.module.css
 * ├── hooks/
 * │   └── useArchitectData.ts
 * ├── types.ts
 * ├── phases.mock.ts
 * ├── index.ts
 * └── README.md (this file)
 *
 * ========================================
 * QUICK START
 * ========================================
 *
 * 1. Import AppShell:
 *    import { AppShell } from '@/features/architect';
 *
 * 2. Render in your route/page:
 *    <AppShell />
 *
 * 3. Access data from other features:
 *    const { getAllPhases, exportForScheduler } = useArchitectData();
 *
 * ========================================
 */

export {};
