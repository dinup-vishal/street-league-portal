/**
 * Mock Cohort Service
 * Provides mock data for cohorts
 */

import type { Cohort, CohortsResponse } from '../types/cohort';

// Mock cohorts data
const MOCK_COHORTS: Cohort[] = [
  {
    cohortId: 1199,
    cohortCode: 'COH-1198119811981198',
    academyId: 159,
    cohortNumber: 3,
    maxParticipants: 14,
    dayOfWeek: 'Monday',
    sessionTime: 'Afternoon',
    status: 'Completed',
    createdAt: '2026-01-06T17:02:27.156421',
    updatedAt: '2026-01-06T17:02:27.156421',
    isActive: true,
    dataSource: 'dbldatagen_synthetic',
  },
  {
    cohortId: 1200,
    cohortCode: 'COH-1199119911991199',
    academyId: 257,
    cohortNumber: 4,
    maxParticipants: 15,
    dayOfWeek: 'Wednesday',
    sessionTime: 'Afternoon',
    status: 'Active',
    createdAt: '2026-01-06T17:02:27.156421',
    updatedAt: '2026-01-06T17:02:27.156421',
    isActive: true,
    dataSource: 'dbldatagen_synthetic',
  },
  {
    cohortId: 1201,
    cohortCode: 'COH-1200120012001200',
    academyId: 159,
    cohortNumber: 5,
    maxParticipants: 12,
    dayOfWeek: 'Tuesday',
    sessionTime: 'Morning',
    status: 'Active',
    createdAt: '2026-01-07T10:15:33.245678',
    updatedAt: '2026-01-07T10:15:33.245678',
    isActive: true,
    dataSource: 'dbldatagen_synthetic',
  },
  {
    cohortId: 1202,
    cohortCode: 'COH-1201120112011201',
    academyId: 340,
    cohortNumber: 6,
    maxParticipants: 16,
    dayOfWeek: 'Friday',
    sessionTime: 'Morning',
    status: 'Active',
    createdAt: '2026-01-08T14:30:45.567890',
    updatedAt: '2026-01-08T14:30:45.567890',
    isActive: true,
    dataSource: 'dbldatagen_synthetic',
  },
];

/**
 * Mock API call to fetch active cohorts
 */
export const fetchActiveCohorts = async (): Promise<CohortsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // Filter active cohorts only
    const activeCohorts = MOCK_COHORTS.filter(cohort => cohort.isActive);

    return {
      success: true,
      data: activeCohorts,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch cohorts',
    };
  }
};

/**
 * Mock API call to fetch all cohorts
 */
export const fetchAllCohorts = async (): Promise<CohortsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    return {
      success: true,
      data: MOCK_COHORTS,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch cohorts',
    };
  }
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};
