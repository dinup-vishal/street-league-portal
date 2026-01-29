/**
 * Lesson types for Architect Portal
 */

export interface Lesson {
  id: string;
  title: string;
  code: string;
  productId: string;
  academyId?: string; // Optional - can be added later
  duration: number; // in minutes
  description?: string;
  learningObjectives?: string[];
  createdAt: string;
}
