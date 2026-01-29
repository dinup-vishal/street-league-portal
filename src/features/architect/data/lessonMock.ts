/**
 * Mock data for Lesson Management
 */

import type { Lesson } from '../types/lesson';
import { MOCK_PRODUCTS } from './lessonPlansMock';

export { MOCK_PRODUCTS };

/**
 * Storage key for lessons
 */
export const LESSONS_STORAGE_KEY = 'street-league:lessons';

/**
 * Save lessons to localStorage
 */
export function saveLessons(lessons: Lesson[]): void {
  try {
    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error('Failed to save lessons:', error);
  }
}

/**
 * Load lessons from localStorage
 */
export function loadLessons(): Lesson[] {
  try {
    const data = localStorage.getItem(LESSONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load lessons:', error);
    return [];
  }
}

/**
 * Get lessons for a specific product
 */
export function getLessonsByProduct(productId: string, lessons: Lesson[]): Lesson[] {
  return lessons.filter((lesson) => lesson.productId === productId);
}

/**
 * Get a specific lesson by ID
 */
export function getLessonById(lessonId: string, lessons: Lesson[]): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

/**
 * Find lesson by code
 */
export function getLessonByCode(code: string, lessons: Lesson[]): Lesson | undefined {
  return lessons.find((lesson) => lesson.code === code);
}

/**
 * Check if lesson code already exists
 */
export function lessonCodeExists(code: string, lessons: Lesson[], excludeId?: string): boolean {
  return lessons.some((lesson) => 
    lesson.code === code && (!excludeId || lesson.id !== excludeId)
  );
}
