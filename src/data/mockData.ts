/**
 * Mock Data for Development
 * Replace with actual API calls by setting VITE_USE_MOCK_DATA=false
 */

import type { BaseEntity } from '../types';

export interface MockDataExample extends BaseEntity {
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
}

// Example mock data - expand based on your application needs
export const mockDataExamples: MockDataExample[] = [
  {
    id: '1',
    title: 'Example Item 1',
    description: 'This is a mock data example for testing',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Example Item 2',
    description: 'Another mock data entry',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Example Item 3',
    description: 'Third mock data example',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
];

// Simulate delay for realistic API behavior
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
