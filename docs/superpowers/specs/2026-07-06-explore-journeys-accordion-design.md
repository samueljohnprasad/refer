# Explore Journeys: Accordion Design Spec

## Overview
The "Explore Journeys" screen (`CourseCatalogSheet.tsx`) is being redesigned to replace the cluttered horizontal carousel and nested cards with a premium, minimalist vertical accordion list. This design prioritizes a cleaner visual hierarchy, reduced cognitive load, and satisfying micro-interactions, combining Apple's minimalist aesthetics with Duolingo's polished gamification.

## 1. Layout & Structure
- **Container**: The sheet will use a vertical `FlatList` (or `ScrollView`) taking up the full width, eliminating the horizontal scrolling top area.
- **Header**: The "Explore Journeys" header will use slightly larger, elegant serif typography (from the app's token system) to establish a premium feel.
- **List Items**: Each course will be represented as a full-width expandable accordion row.

## 2. Accordion Interactions & Animations
- **Exclusive State**: The accordion state will be managed by the parent component (`CourseCatalogSheetContent`). Only one course can be expanded at a time. Expanding a new course will automatically collapse the previously expanded one.
- **Spring Animations**: `react-native-reanimated` will be used to drive the height expansion and collapse, providing a bouncy, physics-based spring feel.
- **Chevron Indicator**: A chevron icon on the right side of the card will smoothly rotate 180 degrees upward when the card expands, and downward when it collapses.

## 3. Card Interiors & Content
### Collapsed State
- **Appearance**: A clean white card with a very soft, diffused shadow.
- **Elements**: Course icon (or monogram), Course Title, "Enrolled" pill (if applicable), and the Chevron.

### Expanded State
- **Highlighting**: The background of the expanded card will subtly shift to a 10% opacity tint of the course's unique `courseAccentColor` to visually anchor it as active.
- **Revealed Content**:
  1. **Description**: Clean, readable text flowing naturally without nested borders.
  2. **Minimalist Stats**: The previous 4 distinct stat boxes are replaced by a single, elegant line of text (e.g., `2 Units • 10 Lessons • 1.5 hrs`).
  3. **Journey Preview**: The timeline of sections will render seamlessly below the stats, removing any outer bounding cards.
  4. **Primary Action**: The "Enroll in Course" or "Open Journey" button will sit at the bottom of the expanded area.

## 4. Technical Constraints
- The changes are isolated to `src/components/journey/CourseCatalogSheet.tsx`.
- The existing API hooks (`useGetCourseCatalogQuery`, `useGetCourseTreeQuery`) and data structures remain unchanged.
- The new `CourseAccordionCard` component will need to cleanly handle the `CourseCatalogListItem` and its corresponding `preview` data.
