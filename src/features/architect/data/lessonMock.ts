/**
 * Mock data for Lesson Management
 * Unified lesson management combining Manage and Mapping tabs
 */

import type { Lesson } from '../types/lesson';
import { MOCK_PRODUCTS, MOCK_LESSONS as MOCK_LESSONS_PLANS } from './lessonPlansMock';

export { MOCK_PRODUCTS };

/**
 * Convert mock lesson plans to lesson format
 */
function convertMockLessonsFromPlans(): Lesson[] {
  return MOCK_LESSONS_PLANS.map((lessonPlan) => ({
    id: lessonPlan.id,
    title: lessonPlan.title,
    code: `${lessonPlan.id.split('-').slice(0, 2).join('-')}`, // Generate code from ID
    productId: lessonPlan.productId,
    academyId: lessonPlan.academyId,
    duration: lessonPlan.duration || 60, // Default to 60 minutes if not specified
    description: lessonPlan.description,
    learningObjectives: lessonPlan.learningObjectives,
    createdAt: new Date().toISOString(),
  }));
}

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
 * Includes both mock lessons and user-created lessons
 */
export function loadLessons(): Lesson[] {
  try {
    const userLessons = localStorage.getItem(LESSONS_STORAGE_KEY);
    const mockLessons = convertMockLessonsFromPlans();
    const parsedUserLessons = userLessons ? JSON.parse(userLessons) : [];
    
    // Combine mock and user-created lessons, avoiding duplicates
    const mockIds = new Set(mockLessons.map((l) => l.id));
    const combinedLessons = [
      ...mockLessons,
      ...parsedUserLessons.filter((l: Lesson) => !mockIds.has(l.id)),
    ];
    
    return combinedLessons;
  } catch (error) {
    console.error('Failed to load lessons:', error);
    return convertMockLessonsFromPlans();
  }
}

/**
 * Get lessons for a specific product and academy
 * Combines mock lessons and user-created lessons
 */
export function getLessonsByProductAndAcademy(
  productId: string,
  academyId: string
): Lesson[] {
  const allLessons = loadLessons();
  return allLessons.filter(
    (lesson) => lesson.productId === productId && lesson.academyId === academyId
  );
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
