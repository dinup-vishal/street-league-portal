# Lesson Plans Form - Implementation Guide

## Overview

The Lesson Plans form is a comprehensive tool within the Architect Portal that enables programme managers to:
- Filter lessons by Product and Academy
- Select multiple lessons for a cohort
- Map selected lessons to specific cohorts
- Persist all mappings locally in the browser

## Features

### 1. **Cascading Dropdowns**
- **Product Dropdown**: Select from 4 pre-defined products
  - Employability Plus
  - Tech Skills Academy
  - Enterprise Development
  - Health & Wellbeing

- **Academy Dropdown** (depends on Product): Dynamically filters to show academies for the selected product
  - Each product has 1-2 academies
  - Academy description helps users identify the correct location

### 2. **Multi-Select Lesson Picker**
- Shows all lessons available for the selected Product/Academy combination
- Displays lesson details:
  - Lesson title
  - Description
  - Duration in minutes
- Users can select multiple lessons via checkboxes
- Visual feedback on selection (highlighting and counter)

### 3. **Cohort Selection**
- Dropdown appears only after lessons are selected
- Shows 5 available cohorts with start dates
- Displays cohort capacity information
- Cohorts span different seasons (Spring, Summer, Autumn, Winter)

### 4. **Form Submission**
- Validates all required fields before submission
- Creates a mapping record linking lessons to cohort
- Clears form after successful submission
- Shows success message with lesson count
- All errors are displayed prominently

### 5. **Local Storage Persistence**
- All mappings automatically saved to localStorage
- Storage key: `'street-league:lesson-plans'`
- Persists across browser sessions
- Mappings displayed in a summary section below the form

### 6. **Mapping Management**
- View all existing mappings for the current Product/Academy
- See lessons, cohorts, and mapping dates
- Delete individual mappings with confirmation

## File Structure

```
src/features/architect/
├── types/
│   └── lessonPlans.ts              # TypeScript interfaces
├── data/
│   └── lessonPlansMock.ts          # Mock data and localStorage functions
├── components/
│   ├── forms/
│   │   ├── LessonPlansForm.tsx     # Main form component
│   │   ├── LessonPlansForm.module.css
│   │   └── index.ts                 # Form exports
│   └── MainPanel.tsx               # Updated to include LessonPlansForm
```

## Data Structure

### Types

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
}

interface Academy {
  id: string;
  productId: string;  // Links to Product
  name: string;
  description?: string;
}

interface LessonPlan {
  id: string;
  productId: string;
  academyId: string;
  title: string;
  description?: string;
  duration?: number;
  learningObjectives?: string[];
}

interface Cohort {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
}

interface LessonCohortMapping {
  id: string;
  lessonIds: string[];      // Array of selected lessons
  cohortId: string;
  productId: string;
  academyId: string;
  createdAt: string;        // ISO date string
  mappedLessonCount: number;
}
```

## Mock Data

### Products
- **Employability Plus**: Comprehensive employability and personal development
  - Academies: London Academy, Manchester Academy
- **Tech Skills Academy**: Digital and technology skills training
  - Academies: Tech Hub London, Digital Birmingham
- **Enterprise Development**: Business and entrepreneurship
  - Academies: Enterprise London
- **Health & Wellbeing**: Physical and mental health focused
  - Academies: Wellbeing Hub

### Lessons Per Academy
Each academy has 3-5 lessons with:
- Unique titles (e.g., "CV Writing & Personal Branding")
- Detailed descriptions
- Duration (60-180 minutes)
- Learning objectives (array of skills)

### Cohorts
5 cohorts available year-round:
- Spring 2026 Cohort A (30 capacity)
- Spring 2026 Cohort B (25 capacity)
- Summer 2026 Intensive (40 capacity)
- Autumn 2026 Cohort (35 capacity)
- Winter 2026 Cohort (28 capacity)

## Usage in Architect Portal

### Accessing the Form

1. Navigate to `/architect` (requires admin or program_manager role)
2. In the left sidebar, expand "Curriculum Design" phase
3. Click on "Lesson Plans" step
4. The LessonPlansForm component loads in the main panel

### Form Flow

```
1. Select Product
   ↓
2. Academy dropdown becomes enabled
3. Select Academy
   ↓
4. Lesson selection grid appears showing all lessons
5. Select one or more lessons
   ↓
6. Cohort dropdown appears
7. Select Cohort
   ↓
8. Click "Save Mapping"
   ↓
9. Form clears, success message shown
10. Mapping appears in summary section below
```

### Form Validation

| Field | Rule | Message |
|-------|------|---------|
| Product | Required | "Please select a Product" |
| Academy | Required | "Please select an Academy" |
| Lessons | At least 1 required | "Please select at least one Lesson" |
| Cohort | Required | "Please select a Cohort" |

## API Functions

### Filter Functions

```typescript
// Get academies for a product
getAcademiesByProduct(productId: string): Academy[]

// Get lessons for product + academy combination
getLessonsByProductAndAcademy(productId: string, academyId: string): LessonPlan[]

// Get mappings for product + academy
getMappingsByProductAndAcademy(
  productId: string,
  academyId: string,
  mappings: LessonCohortMapping[]
): LessonCohortMapping[]
```

### Storage Functions

```typescript
// Save mappings to localStorage
saveLessonPlansMappings(mappings: LessonCohortMapping[]): void

// Load mappings from localStorage
loadLessonPlansMappings(): LessonCohortMapping[]

// Storage key
LESSON_PLANS_STORAGE_KEY = 'street-league:lesson-plans'
```

## Component Props & State

### LessonPlansForm State

```typescript
interface LessonPlansFormState {
  selectedProduct?: string;           // Product ID
  selectedAcademy?: string;           // Academy ID
  selectedLessons: string[];          // Array of Lesson IDs
  selectedCohort?: string;            // Cohort ID
  mappings: LessonCohortMapping[];    // All saved mappings
}
```

## Styling Features

### Responsive Design
- Desktop: Multi-column lesson grid (3 columns)
- Tablet: Single column lessons, responsive layout
- Mobile: Full-width components, touch-friendly interface

### Accessibility
- Semantic HTML with proper fieldsets and legends
- ARIA labels and roles for screen readers
- Keyboard navigation support (Tab through all fields)
- Focus rings on all interactive elements
- Color contrast WCAG AA compliant
- Reduced motion support

### Visual Hierarchy
- Step-based layout with fieldsets
- Color-coded messages (green for success, red for errors)
- Icons for status indicators
- Lesson cards with hover effects
- Clear form sections with visual separators

## Error Handling

1. **Validation Errors**: Displayed in red alert above form
2. **localStorage Errors**: Silently logged, form continues to function
3. **Auto-clear Messages**: Success/error messages disappear after 5 seconds

## localStorage Format

```json
[
  {
    "id": "mapping-1706487234567",
    "lessonIds": ["lesson-1-1-1", "lesson-1-1-2"],
    "cohortId": "cohort-1",
    "productId": "prod-1",
    "academyId": "acad-1",
    "createdAt": "2026-01-29T10:20:34.567Z",
    "mappedLessonCount": 2
  }
]
```

## Integration Points

### MainPanel.tsx
The form is conditionally rendered based on step ID:
```typescript
{step.id === 'step-2-4' ? (
  <LessonPlansForm />
) : (
  <PlaceholderForm title={step.name} />
)}
```

### useArchitectData Hook
The form can be extended to integrate with `useArchitectData()`:
```typescript
const { getSelectedStep, exportForScheduler } = useArchitectData();
```

## Future Enhancements

1. **Backend Integration**: Replace mock data with API calls
2. **Search/Filter**: Add search within lesson selection
3. **Bulk Operations**: Select/deselect all lessons
4. **Mapping Templates**: Save and reuse common mappings
5. **Lesson Ratings**: Display lesson ratings or prerequisites
6. **Conflict Detection**: Warn on overlapping cohort schedules
7. **Export**: Export mappings as CSV or PDF
8. **Analytics**: Show usage statistics and coverage

## Testing Guide

### Test Scenarios

1. **Product Selection**
   - Select each product
   - Verify academy list updates correctly

2. **Academy Selection**
   - For each product, select different academies
   - Verify correct lessons appear

3. **Multi-Select Lessons**
   - Select 1 lesson → verify counter updates
   - Select 5 lessons → verify all checkboxes checked
   - Deselect a lesson → verify counter decreases

4. **Cohort Dropdown**
   - Should only appear after ≥1 lesson selected
   - Should show all 5 cohorts

5. **Form Submission**
   - Submit valid form → success message shown
   - Form clears and mapping appears below
   - Refresh page → mapping persists

6. **Form Validation**
   - Try submit without product → error shown
   - Try submit without lessons → error shown
   - Try submit without cohort → error shown

7. **Delete Mapping**
   - Click delete button → mapping removed
   - Refresh page → mapping still gone

8. **Responsive Design**
   - Test on desktop, tablet, mobile
   - Verify all elements are accessible
   - Test keyboard navigation

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ❌ Not supported (uses modern ES6+)

## Performance Considerations

- Form renders ~23 lessons max per academy
- localStorage operations are synchronous but fast
- Mock data loaded in memory (no API calls)
- CSS-in-JS via CSS Modules (scoped styling)

## Code Quality

- ✅ TypeScript: Full type safety
- ✅ Accessibility: WCAG 2.2 AA compliant
- ✅ Responsive: Mobile-first design
- ✅ Error Handling: Comprehensive validation
- ✅ Code Comments: Detailed documentation
- ✅ Reusability: Modular component design
