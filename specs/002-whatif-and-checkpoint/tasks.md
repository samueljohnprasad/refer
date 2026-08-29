# Implementation Tasks: whatif-and-checkpoint

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create What-If dev fixture in src/screens/CourseExercisesTestScreen/fixtures/whatIf.ts
- [x] T002 [P] Create Checkpoint dev fixture in src/screens/CourseExercisesTestScreen/fixtures/checkpoint.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create What-If content and response types in src/components/exercise/whatif/whatIfContent.ts
- [x] T004 [P] Create What-If response types in src/components/exercise/whatif/whatIfResponse.ts
- [x] T005 [P] Create Checkpoint content and response types in src/components/exercise/checkpoint/checkpointContent.ts
- [x] T006 [P] Create Checkpoint response types in src/components/exercise/checkpoint/checkpointResponse.ts
- [x] T007 Wire validators into src/components/exercise/microlearning/microlearningContentValidation.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - What-If Machine: User-Paced Consequence Flow (Priority: P1) 🎯 MVP

**Goal**: Implement a timer-free, user-paced What-If Machine with robust state recovery and a neutral final comparison.

**Independent Test**: Load the What-If fixture. Make a prediction, tap "Run it", and advance manually through each consequence until the final comparison. Wait 30 seconds at any point to verify no auto-advancing occurs.

### Implementation for User Story 1

- [x] T008 [US1] Create whatIfState.ts (state transitions and recovery) in src/components/exercise/whatif/whatIfState.ts
- [x] T009 [US1] Update getProgressLabel and getNextProgressState for what_if in src/domains/journey/learning/courseExercisePrimaryTransition.ts
- [x] T010 [US1] Implement WhatIfCategoryEngine.tsx (prediction, consequences, comparison) in src/components/exercise/whatif/WhatIfCategoryEngine.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Course Checkpoint: Strict Item Adapters (Priority: P1)

**Goal**: Implement a strictly typed Course Checkpoint presenting one item at a time (intro, item adapters, summary) with 1 retry before worked support, and concept ID aggregation.

**Independent Test**: Load the Checkpoint fixture. Complete a single-choice item, an ordering item, a matching item, and a recall item sequentially, confirming only one appears at a time and retries function correctly.

### Implementation for User Story 2

- [x] T011 [US2] Create checkpointState.ts (state transitions, retry logic, aggregation) in src/components/exercise/checkpoint/checkpointState.ts
- [x] T012 [US2] Update getProgressLabel and getNextProgressState for checkpoint in src/domains/journey/learning/courseExercisePrimaryTransition.ts
- [x] T013 [US2] Implement CheckpointCategoryEngine.tsx (intro, summary, and container) in src/components/exercise/checkpoint/CheckpointCategoryEngine.tsx
- [x] T014 [US2] Implement Checkpoint item adapters (single choice, ordering, matching, recall) within src/components/exercise/checkpoint/CheckpointCategoryEngine.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 Run quickstart.md validation manually to ensure all scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 and User Story 2 can be developed in parallel once Foundational is complete since they touch different engine files.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel.
- Foundational tasks T003, T004, T005, and T006 can run in parallel.
- Once Foundational phase completes, User Story 1 and User Story 2 can be worked on entirely in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via dev fixture.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently


## Phase 6: Convergence

**Purpose**: Address gaps identified by speckit-converge against the feature specification.

- [x] T016 Update `recordItemOutcome` in checkpointState.ts to preserve "review_soon" once set for a concept ID per FR-008 (contradicts)
- [x] T017 Change worked support threshold in CheckpointAdapters.tsx to `attempts >= 2` to allow 1 retry per FR-007 (missing)
- [x] T018 Add UI logic in CheckpointAdapters.tsx (OrderingAdapter) to highlight incorrectly positioned items when `attempts === 1` per FR-007 (missing)
- [x] T019 Add conditional styling in WhatIfCategoryEngine.tsx to compactly collapse older consequences per US1/AC2 (partial)
