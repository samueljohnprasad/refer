# Tasks: Course Onboarding Integration, Enrollment Limits, and In-Progress Unenrollment

**Feature Directory**: `specs/020-course-onboarding-enrollment`  
**Input**: Design artifacts from `specs/020-course-onboarding-enrollment/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `quickstart.md`)  
**Status**: Ready for implementation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project constants and contract types initialization

- [x] T001 Define `ENROLLMENT_POLICY` configuration in `src/domains/journey/config/enrollmentConfig.ts` with `MAX_IN_PROGRESS_COURSES = 3`
- [x] T002 [P] Define API and contract types for start-course, unenroll, and capacity limits in `src/types/journey/enrollment.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core enrollment and unenrollment queries, mutations, and capacity selectors

- [x] T003 Implement `unenrollServerCourse` query in `src/domains/journey/data/courseServerQueries.ts` to delete in-progress `user_course_progress` and related node progress
- [x] T004 Add `unenrollCourse` mutation endpoint and tag invalidations in `src/domains/journey/data/journeyApi.ts`
- [x] T005 [P] Create selectors `selectInProgressCoursesCount` and `selectCanEnrollInCourse` in `src/domains/journey/state/journeySelectors.ts`
- [x] T006 Implement server-side `MAX_IN_PROGRESS_COURSES` capacity check in `supabase/functions/start-course/index.ts`

**Checkpoint**: Core queries, mutations, and policy selectors ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Auto-Enroll from Onboarding Motivation Selection (Priority: P1) 🎯 MVP

**Goal**: Auto-enroll newly onboarded users into the real course matching their chosen motivation option upon onboarding completion and set it as their initial active journey.

**Independent Test**: Complete onboarding selecting "Sleep & rest better"; verify user is enrolled in "Sleep Reset" and lands on its journey map ready for Lesson 1.

- [x] T007 [US1] Create motivation-to-course resolver `resolveCourseForMotivation` in `src/screens/OnboardingScreen/utils/courseResolver.ts` mapping motivation keys to published course domains/titles
- [x] T008 [US1] Wire motivation resolver into `hooks/data/useCompleteOnboarding.ts` to resolve real course ID and execute `startCourse` on onboarding completion
- [x] T009 [US1] Ensure `useActiveCourse` in `hooks/journey/useActiveCourse.ts` activates the freshly enrolled onboarding course upon navigation to `/tabs/(tabs)/home`

**Checkpoint**: User Story 1 (MVP) is fully functional — onboarding connects directly to real course enrollment.

---

## Phase 4: User Story 2 - Enforcement of Maximum In-Progress Course Limit (Priority: P2)

**Goal**: Enforce max 3 in-progress courses; completed courses do not count toward limit; block enrollment with clear message when at capacity.

**Independent Test**: Create 2 completed + 2 in-progress courses, verify user can enroll in a 3rd; when at 3 in-progress courses, verify "Start journey" button shows limit reached and blocks enrollment.

- [x] T010 [US2] Update `useCourseCatalogViewModel.ts` in `src/domains/journey/ui/hooks/useCourseCatalogViewModel.ts` to compute capacity limit flags (`isAtCapacityLimit`, `inProgressCount`, `maxCapacityLimit`) using `selectInProgressCoursesCount`
- [x] T011 [US2] Update `CourseCatalogSheetContent.tsx` in `src/domains/journey/ui/components/CourseCatalogSheet/CourseCatalogSheetContent.tsx` to forward capacity limit state to overview screen
- [x] T012 [US2] Update `CourseOverviewScreen.tsx` in `src/domains/journey/ui/components/CourseCatalogSheet/CourseOverviewScreen.tsx` to disable "Start journey" and display capacity feedback alert when user has reached max in-progress courses

**Checkpoint**: User Stories 1 AND 2 functional — capacity limit strictly enforced on client and server without penalizing completed courses.

---

## Phase 5: User Story 3 - Unenroll from an In-Progress Course (Priority: P3)

**Goal**: Allow users to unenroll from a course in `in_progress` state with confirmation, decrementing active count and freeing up an enrollment slot.

**Independent Test**: Open an in-progress course, tap "Unenroll from journey", confirm dialog, verify course returns to "Start journey" and in-progress count decrements by 1.

- [x] T013 [US3] Add unenroll action handler `handleUnenrollCourse` in `src/domains/journey/ui/hooks/useCourseCatalogViewModel.ts` invoking `useUnenrollCourseMutation`
- [x] T014 [US3] Add quiet "Unenroll from journey" button and confirmation dialog modal in `src/domains/journey/ui/components/CourseCatalogSheet/CourseOverviewScreen.tsx` for `in_progress` courses
- [x] T015 [US3] Handle active journey fallback in `hooks/journey/useActiveCourse.ts` so unenrolling the currently active journey switches smoothly to another enrolled course or catalog

**Checkpoint**: User Stories 1, 2, and 3 functional — learners can drop active courses to manage their learning workload.

---

## Phase 6: User Story 4 - Restrict Unenrollment on Completed and Not-Started Courses (Priority: P4)

**Goal**: Guarantee unenrollment is strictly restricted to in-progress courses; completely hidden and forbidden on completed and not-started courses.

**Independent Test**: View a completed course; verify no unenroll button is rendered. View a not-started course; verify no unenroll button is rendered.

- [x] T016 [US4] Enforce status guard in `src/domains/journey/ui/components/CourseCatalogSheet/CourseOverviewScreen.tsx` so unenroll button renders IF AND ONLY IF `isEnrolled && !isCompleted`
- [x] T017 [US4] Enforce server-side guard in `src/domains/journey/data/courseServerQueries.ts` ensuring unenroll queries reject if the target course status is `completed` or missing

**Checkpoint**: Milestones and achievements permanently protected; unenroll strictly bounded to in-progress state.

---

## Phase 7: User Story 5 - Configurable In-Progress Course Limit (Priority: P5)

**Goal**: Enable tuning course limit threshold from single config source without database migrations or multi-file edits.

**Independent Test**: Modify `MAX_IN_PROGRESS_COURSES` in `enrollmentConfig.ts` to `2` and verify client selectors and catalog UI instantly reflect the new limit.

- [x] T018 [US5] Verify client-side selector `selectCanEnrollInCourse` in `src/domains/journey/state/journeySelectors.ts` directly consumes `ENROLLMENT_POLICY.MAX_IN_PROGRESS_COURSES`
- [x] T019 [US5] Wire `ENROLLMENT_POLICY.MAX_IN_PROGRESS_COURSES` into catalog presentation subtitles/badges in `src/domains/journey/ui/components/CourseCatalogSheet/CourseOverviewScreen.tsx`

**Checkpoint**: Centralized configurability verified end-to-end.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification, TypeScript compliance, line count constraints, and knowledge graph update

- [x] T020 Run TypeScript type check (`npx tsc --noEmit`) to verify zero type errors across all touched files
- [x] T021 Validate line counts ensuring all touched hooks, components, and helpers remain <= 300 lines per repo guidelines
- [x] T022 Execute manual validation scenarios from `specs/020-course-onboarding-enrollment/quickstart.md`
- [x] T023 Run `graphify update .` to synchronize knowledge graph with updated architecture

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2. MVP increment.
- **User Story 2 (Phase 4)**: Depends on Phase 2. Enforces capacity limit.
- **User Story 3 (Phase 5)**: Depends on Phase 2 & Phase 4 (interacts with capacity limit).
- **User Story 4 (Phase 6)**: Depends on Phase 5 (adds guards to unenroll).
- **User Story 5 (Phase 7)**: Depends on Phase 4 & Phase 5.
- **Polish (Phase 8)**: Depends on all user stories completed.

### Parallel Opportunities
- T001 and T002 in Phase 1 can run in parallel (distinct files).
- T004, T005, and T006 in Phase 2 can run in parallel once T003 is established.
- Within User Story 1: T007 and T008 can be built in close coordination.
- Within User Story 2: T010 and T011 can run in parallel.
