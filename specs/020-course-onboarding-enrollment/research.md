# Research: Course Onboarding Integration, Enrollment Limits, and In-Progress Unenrollment

## Decision 1: Motivation-to-Course Resolution Architecture

- **Decision**: Introduce a resilient resolution function `resolveCourseForMotivation(motivation, catalog)` backed by a domain/slug mapping constant. During onboarding completion in `useCompleteOnboarding.ts`, query the published catalog (or seed mapping) to find the matching course ID (`anxiety-quieting-the-storm`, `sleep-reset`, `stress-steady-under-pressure`, `self-understanding-coming-home-to-yourself`, `mood-finding-light`).
- **Rationale**: Currently `MOTIVATION_COURSE_MAP` contains placeholder UUIDs (`00000000-...-0001`), which causes `startCourse` to fail or defer silently. Resolving against real published courses ensures newly onboarded learners immediately receive a valid, functional course progress record and land directly on their personalized journey map.
- **Alternatives Considered**:
  - *Hardcoding generated UUIDs*: Brittle across database resets and migration recreations.
  - *Network lookup blocking onboarding*: If network fails during onboarding, user could get stuck on the paywall/welcome step. Our approach uses an instant catalog/seed lookup with graceful fallback to the primary anxiety course.

## Decision 2: In-Progress Course Limit Enforcement & Configuration

- **Decision**: Centralize the capacity limit in `src/domains/journey/config/enrollmentConfig.ts`:
  ```typescript
  export const ENROLLMENT_POLICY = {
    MAX_IN_PROGRESS_COURSES: 3,
  } as const;
  ```
  Enforce the check at two levels:
  1. **Client**: `selectCanEnrollInCourse(state)` and `useCourseCatalogViewModel.ts` compute `inProgressCount = enrolledCourses.filter(c => c.status === 'in_progress').length`. If `inProgressCount >= ENROLLMENT_POLICY.MAX_IN_PROGRESS_COURSES`, disable new enrollment and show the limit alert/badge.
  2. **Server (Edge Function `start-course`)**: Query `user_course_progress` where `user_id = user.id AND status = 'in_progress'`. If count >= limit, reject with `400 Bad Request` ("Maximum active courses reached").
- **Rationale**: Completed courses (`status === 'completed'`) are explicitly excluded from the count. Centralizing the limit ensures that modifying `MAX_IN_PROGRESS_COURSES` in one file immediately updates both client calculation and server threshold without architecture refactoring.
- **Alternatives Considered**:
  - *Client-only validation*: Insecure against concurrent taps or multi-session enrollments.
  - *Database trigger*: Harder to update dynamically in code without SQL migrations.

## Decision 3: In-Progress Unenrollment Data Model & Deletion Strategy

- **Decision**: Implement `unenrollCourse(courseId)` which removes the `user_course_progress` record where `course_id = courseId AND user_id = user.id AND status = 'in_progress'`, and removes any associated `user_node_progress` for nodes in that course.
- **Rationale**:
  - The `user_course_progress` table has a check constraint `CHECK (status IN ('in_progress','completed'))`. Introducing a status like `'unregistered'` or `'abandoned'` would require a database migration and touch multiple queries.
  - Deleting the in-progress row cleanly decrements the active count, resets node attempts, and allows the learner to start fresh from Lesson 1 if they ever re-enroll.
  - Completed courses are strictly protected: if `status === 'completed'`, the unenroll endpoint/action explicitly rejects the operation.
- **Alternatives Considered**:
  - *Soft-delete column (`is_deleted` or `unregistered_at`)*: Adds unnecessary schema complexity (YAGNI) for an operation that represents dropping a class.

## Decision 4: UI Placement for Unenrollment

- **Decision**: Place the "Unenroll from journey" control on `CourseOverviewScreen`:
  - Position: Rendered as a quiet, text-style destructive button below the primary action button or within the header overflow, visible **only** when `isEnrolled && !isCompleted`.
  - Confirmation: Tapping triggers an accessible native confirmation dialog ("Unenroll from [Course]? Your progress in this course will be reset so you can free up a slot.") with "Keep Course" and "Unenroll" actions.
  - When `isCompleted === true`, the unenroll action is completely hidden.
  - When `!isEnrolled`, only "Start journey" is shown.
- **Rationale**: Follows Constitution Principle VI (editorial calm, non-punitive) and Principle IV (one intentional action at a time with clear confirmation).

## Decision 5: Active Course Fallback on Unenrollment

- **Decision**: When an active course is unenrolled:
  1. RTK Query invalidates `EnrolledCourses`, `CourseProgress`, and `CourseTree`.
  2. `useActiveCourse` re-evaluates available enrollments. If other courses remain in `enrolledIds`, it switches active focus to `enrolledIds[0]`. If no enrolled courses remain, it falls back to the first catalog course or null.
- **Rationale**: Prevents crashes or blank screens if a user unenrolls from the course they were currently viewing on the main Journey tab.
