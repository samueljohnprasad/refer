# Context: Course Completion & Next Journey Bridge

## 1. Domain Problem
When a user completes all nodes in a course and dismisses the celebration overlay, the Journey Map currently leaves them on the final node of the completed course with no obvious next step or prompt. We need a clean, rewarding, and frictionless retention bridge to the next course.

## 2. Core Decisions (ADR: Post-Completion UX)

### D1: Primary UI Surface
- **Decision:** Persistent Floating Bottom Dock on the completed journey map.
- **Rationale:** Keeps the user's completed map visible and scrollable behind it, while providing a clear physical affordance for what to do next.
- **Visuals:** Pure white card (`bg-brand-surface`), 2px neutral border, rounded-2xl, elevated above bottom navigation bar.

### D2: Next Course Determination
- **Decision:** Sequential Catalog Recommendation.
- **Algorithm:**
  1. Fetch all published courses from `courses` ordered by `order_index`.
  2. Find the first course where `user_course_progress.status !== 'completed'`.
  3. If an uncompleted course is found, recommend it as `nextCourse`.
  4. If all courses are completed, trigger the **"All Caught Up"** state.

### D3: Action Triggers
- **Primary CTA:** 3D tactile `Button` (`variant="primary"`, `size="lg"`): `"Start [Next Course Title]"`.
  - On tap: Enrolls user via `useStartCourseMutation`, sets active course, and transitions map to the new course.
- **Secondary CTA:** `"Browse all courses"` text button.
  - On tap: Opens the existing `CourseCatalogSheet` to let the user pick any course.

### D4: "All Caught Up" Edge Case
- When all published courses are completed:
  - Header: `"You mastered all journeys! 🌟"`
  - Subtitle: `"Revisit your favorite lessons or practice anytime."`
  - Primary CTA: 3D tactile `Button`: `"Browse Course Catalog"` (opens `CourseCatalogSheet`).

### D5: Map Replay Coexistence
- Adheres to `docs/prd-completed-journey-revisit.md`: All completed nodes remain tappable and replayable for practice. The floating dock does not block user interaction with the road map.
