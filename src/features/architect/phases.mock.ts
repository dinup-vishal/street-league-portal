/**
 * Mock data for Programme Architect Portal
 * In-memory phases and steps for wireframe demonstration
 */

import type { Phase } from './types';

export function getPhases(): Phase[] {
  return [
    {
      id: 'phase-1',
      name: 'Foundation Setup',
      steps: [
        {
          id: 'step-1-1',
          name: 'Geographic Setup',
          description: 'Define geographical regions and locations where the programme will operate.',
        },
        {
          id: 'step-1-2',
          name: 'Staff Management',
          description: 'Add and configure staff roles, responsibilities, and availability.',
        },
        {
          id: 'step-1-3',
          name: 'Product Types',
          description: 'Define product categories and types offered through the programme.',
        },
      ],
    },
    {
      id: 'phase-2',
      name: 'Curriculum Design',
      steps: [
        {
          id: 'step-2-1',
          name: 'Themes',
          description: 'Create overarching themes that structure the learning experience.',
        },
        {
          id: 'step-2-2',
          name: 'Skill Categories',
          description: 'Organize skills into categories for better curriculum mapping.',
        },
        {
          id: 'step-2-3',
          name: 'Skills',
          description: 'Define individual skills and competencies to be taught.',
        },
        {
          id: 'step-2-4',
          name: 'Lesson Plans',
          description: 'Create detailed lesson plans aligned with themes and skills.',
        },
        {
          id: 'step-2-5',
          name: 'Skill Mapping',
          description: 'Map lessons to skills and ensure comprehensive coverage.',
        },
      ],
    },
    {
      id: 'phase-3',
      name: 'Program Deployment',
      steps: [
        {
          id: 'step-3-1',
          name: 'Academy Creation',
          description: 'Set up academies and assign them to operational locations.',
        },
        {
          id: 'step-3-2',
          name: 'Cohort Formation',
          description: 'Create cohorts and configure intake schedules and enrollment.',
        },
      ],
    },
  ];
}

/**
 * Local storage key for persisting architect data
 */
export const ARCHITECT_STORAGE_KEY = 'street-league:architect-portal';

/**
 * Save architect data to localStorage
 */
export function saveArchitectData(data: any): void {
  try {
    localStorage.setItem(ARCHITECT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save architect data:', error);
  }
}

/**
 * Load architect data from localStorage
 */
export function loadArchitectData(): any {
  try {
    const stored = localStorage.getItem(ARCHITECT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load architect data:', error);
    return null;
  }
}
