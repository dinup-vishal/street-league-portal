/**
 * Mock data for Lesson Plans
 * Products, Academies, Lessons, and Cohorts
 */

import type {
  Product,
  Academy,
  LessonPlan,
  Cohort,
  LessonCohortMapping,
} from '../types/lessonPlans';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Employability Plus',
    description: 'Comprehensive employability and personal development programme',
  },
  {
    id: 'prod-2',
    name: 'Tech Skills Academy',
    description: 'Digital and technology skills training',
  },
  {
    id: 'prod-3',
    name: 'Enterprise Development',
    description: 'Business and entrepreneurship programme',
  },
  {
    id: 'prod-4',
    name: 'Health & Wellbeing',
    description: 'Physical and mental health focused programme',
  },
];

export const MOCK_ACADEMIES: Academy[] = [
  {
    id: 'acad-1',
    productId: 'prod-1',
    name: 'London Academy',
    description: 'South London delivery center',
  },
  {
    id: 'acad-2',
    productId: 'prod-1',
    name: 'Manchester Academy',
    description: 'North-West delivery center',
  },
  {
    id: 'acad-3',
    productId: 'prod-2',
    name: 'Tech Hub London',
    description: 'Technology training center',
  },
  {
    id: 'acad-4',
    productId: 'prod-2',
    name: 'Digital Birmingham',
    description: 'Midlands tech delivery',
  },
  {
    id: 'acad-5',
    productId: 'prod-3',
    name: 'Enterprise London',
    description: 'Business training center',
  },
  {
    id: 'acad-6',
    productId: 'prod-4',
    name: 'Wellbeing Hub',
    description: 'Health and wellness center',
  },
];

export const MOCK_LESSONS: LessonPlan[] = [
  // Employability Plus - London Academy
  {
    id: 'lesson-1-1-1',
    productId: 'prod-1',
    academyId: 'acad-1',
    title: 'CV Writing & Personal Branding',
    description: 'Learn to create an effective CV and build your personal brand',
    duration: 120,
    learningObjectives: ['Create professional CV', 'Develop personal brand', 'Showcase achievements'],
  },
  {
    id: 'lesson-1-1-2',
    productId: 'prod-1',
    academyId: 'acad-1',
    title: 'Interview Skills Workshop',
    description: 'Master interview techniques and confidence building',
    duration: 120,
    learningObjectives: ['Answer interview questions', 'Build confidence', 'Research companies'],
  },
  {
    id: 'lesson-1-1-3',
    productId: 'prod-1',
    academyId: 'acad-1',
    title: 'Communication & Presentation',
    description: 'Develop effective communication and presentation skills',
    duration: 90,
    learningObjectives: ['Public speaking', 'Active listening', 'Non-verbal communication'],
  },
  {
    id: 'lesson-1-1-4',
    productId: 'prod-1',
    academyId: 'acad-1',
    title: 'Workplace Etiquette & Professionalism',
    description: 'Understanding workplace norms and professional behavior',
    duration: 60,
    learningObjectives: ['Professional behavior', 'Workplace etiquette', 'Team dynamics'],
  },
  {
    id: 'lesson-1-1-5',
    productId: 'prod-1',
    academyId: 'acad-1',
    title: 'Networking & Relationship Building',
    description: 'Build valuable professional networks and relationships',
    duration: 90,
    learningObjectives: ['Network effectively', 'Build relationships', 'Follow up professionally'],
  },

  // Employability Plus - Manchester Academy
  {
    id: 'lesson-1-2-1',
    productId: 'prod-1',
    academyId: 'acad-2',
    title: 'Job Search Strategies',
    description: 'Effective job search techniques and resources',
    duration: 120,
    learningObjectives: ['Job search tools', 'Application strategies', 'Market research'],
  },
  {
    id: 'lesson-1-2-2',
    productId: 'prod-1',
    academyId: 'acad-2',
    title: 'LinkedIn Mastery',
    description: 'Optimize LinkedIn profile for career growth',
    duration: 90,
    learningObjectives: ['LinkedIn optimization', 'Networking online', 'Personal branding'],
  },
  {
    id: 'lesson-1-2-3',
    productId: 'prod-1',
    academyId: 'acad-2',
    title: 'Confidence Building & Resilience',
    description: 'Build confidence and resilience in career journey',
    duration: 120,
    learningObjectives: ['Build confidence', 'Develop resilience', 'Overcome challenges'],
  },

  // Tech Skills Academy - Tech Hub London
  {
    id: 'lesson-2-3-1',
    productId: 'prod-2',
    academyId: 'acad-3',
    title: 'Introduction to Python',
    description: 'Learn Python programming fundamentals',
    duration: 180,
    learningObjectives: ['Python basics', 'Variables and functions', 'Problem solving'],
  },
  {
    id: 'lesson-2-3-2',
    productId: 'prod-2',
    academyId: 'acad-3',
    title: 'Web Development Basics',
    description: 'HTML, CSS, and JavaScript fundamentals',
    duration: 180,
    learningObjectives: ['HTML & CSS', 'JavaScript', 'Responsive design'],
  },
  {
    id: 'lesson-2-3-3',
    productId: 'prod-2',
    academyId: 'acad-3',
    title: 'Cloud Computing Essentials',
    description: 'AWS and cloud deployment fundamentals',
    duration: 150,
    learningObjectives: ['Cloud basics', 'AWS services', 'Deployment'],
  },

  // Tech Skills Academy - Digital Birmingham
  {
    id: 'lesson-2-4-1',
    productId: 'prod-2',
    academyId: 'acad-4',
    title: 'Digital Marketing Fundamentals',
    description: 'Online marketing strategies and tools',
    duration: 120,
    learningObjectives: ['Social media marketing', 'SEO basics', 'Analytics'],
  },
  {
    id: 'lesson-2-4-2',
    productId: 'prod-2',
    academyId: 'acad-4',
    title: 'Data Analysis with Excel',
    description: 'Master data analysis using Excel',
    duration: 120,
    learningObjectives: ['Data analysis', 'Pivot tables', 'Visualization'],
  },

  // Enterprise Development - Enterprise London
  {
    id: 'lesson-3-5-1',
    productId: 'prod-3',
    academyId: 'acad-5',
    title: 'Business Planning 101',
    description: 'Create a comprehensive business plan',
    duration: 180,
    learningObjectives: ['Business model', 'Market analysis', 'Financial planning'],
  },
  {
    id: 'lesson-3-5-2',
    productId: 'prod-3',
    academyId: 'acad-5',
    title: 'Entrepreneurship Mindset',
    description: 'Develop an entrepreneurial mindset and approach',
    duration: 120,
    learningObjectives: ['Innovation thinking', 'Risk taking', 'Problem solving'],
  },
  {
    id: 'lesson-3-5-3',
    productId: 'prod-3',
    academyId: 'acad-5',
    title: 'Pitch Your Idea',
    description: 'Master the art of pitching your business idea',
    duration: 90,
    learningObjectives: ['Pitch delivery', 'Persuasion', 'Storytelling'],
  },

  // Health & Wellbeing - Wellbeing Hub
  {
    id: 'lesson-4-6-1',
    productId: 'prod-4',
    academyId: 'acad-6',
    title: 'Mental Health Awareness',
    description: 'Understanding mental health and wellbeing',
    duration: 120,
    learningObjectives: ['Mental health basics', 'Stress management', 'Self-care'],
  },
  {
    id: 'lesson-4-6-2',
    productId: 'prod-4',
    academyId: 'acad-6',
    title: 'Fitness & Physical Activity',
    description: 'Benefits of regular physical activity',
    duration: 120,
    learningObjectives: ['Exercise science', 'Fitness planning', 'Nutrition basics'],
  },
  {
    id: 'lesson-4-6-3',
    productId: 'prod-4',
    academyId: 'acad-6',
    title: 'Work-Life Balance',
    description: 'Achieve sustainable work-life balance',
    duration: 90,
    learningObjectives: ['Boundary setting', 'Time management', 'Wellness planning'],
  },
];

export const MOCK_COHORTS: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Spring 2026 Cohort A',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    capacity: 30,
  },
  {
    id: 'cohort-2',
    name: 'Spring 2026 Cohort B',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    capacity: 25,
  },
  {
    id: 'cohort-3',
    name: 'Summer 2026 Intensive',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    capacity: 40,
  },
  {
    id: 'cohort-4',
    name: 'Autumn 2026 Cohort',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    capacity: 35,
  },
  {
    id: 'cohort-5',
    name: 'Winter 2026 Cohort',
    startDate: '2026-11-15',
    endDate: '2027-02-28',
    capacity: 28,
  },
];

/**
 * Get academies filtered by product
 */
export function getAcademiesByProduct(productId: string): Academy[] {
  return MOCK_ACADEMIES.filter((academy) => academy.productId === productId);
}

/**
 * Get lessons filtered by product and academy
 */
export function getLessonsByProductAndAcademy(productId: string, academyId: string): LessonPlan[] {
  return MOCK_LESSONS.filter(
    (lesson) => lesson.productId === productId && lesson.academyId === academyId
  );
}

/**
 * Storage key for lesson plans mappings
 */
export const LESSON_PLANS_STORAGE_KEY = 'street-league:lesson-plans';

/**
 * Save lesson plans mappings to localStorage
 */
export function saveLessonPlansMappings(mappings: LessonCohortMapping[]): void {
  try {
    localStorage.setItem(LESSON_PLANS_STORAGE_KEY, JSON.stringify(mappings));
  } catch (error) {
    console.error('Failed to save lesson plans mappings:', error);
  }
}

/**
 * Load lesson plans mappings from localStorage
 */
export function loadLessonPlansMappings(): LessonCohortMapping[] {
  try {
    const data = localStorage.getItem(LESSON_PLANS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load lesson plans mappings:', error);
    return [];
  }
}

/**
 * Get existing mappings for a specific product and academy
 */
export function getMappingsByProductAndAcademy(
  productId: string,
  academyId: string,
  mappings: LessonCohortMapping[]
): LessonCohortMapping[] {
  return mappings.filter(
    (mapping) => mapping.productId === productId && mapping.academyId === academyId
  );
}
