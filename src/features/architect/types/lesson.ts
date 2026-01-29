/**
 * Lesson types for Architect Portal
 */

export interface Lesson {
  id: string;
  title: string;
  code: string;
  productId: string;
  duration: number; // in minutes
  createdAt: string;
}
