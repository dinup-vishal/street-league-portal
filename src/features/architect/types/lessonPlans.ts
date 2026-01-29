/**
 * Lesson Plans types for Architect Portal
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
}

export interface Academy {
  id: string;
  productId: string;
  name: string;
  description?: string;
}

export interface LessonPlan {
  id: string;
  productId: string;
  academyId: string;
  title: string;
  description?: string;
  duration?: number;
  learningObjectives?: string[];
}

export interface Cohort {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
}

export interface LessonCohortMapping {
  id: string;
  lessonIds: string[];
  cohortId: string;
  productId: string;
  academyId: string;
  createdAt: string;
  mappedLessonCount: number;
}

export interface LessonPlansFormState {
  selectedProduct?: string;
  selectedAcademy?: string;
  selectedLessons: string[];
  selectedCohort?: string;
  mappings: LessonCohortMapping[];
}
