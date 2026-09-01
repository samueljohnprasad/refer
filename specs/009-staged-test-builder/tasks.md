# Implementation Tasks: Staged Test Builder

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project builds cleanly before starting refactoring

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update `IfThenPlanContent` schema and `savedResponse` schema in `src/exercises/IfThenPlan/config.ts` to support `cueId`, `actionId`, `phase`, and nested `actions`.
- [X] T003 Migrate the existing exercise content in `src/exercises/IfThenPlan/config.ts` to use the new nested `IfThenCue` -> `IfThenAction` structure.
- [X] T004 Update the `buildResponse` logic in `src/exercises/IfThenPlan/config.ts` to handle saving the new deterministic state structure.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Choosing the Trigger (State 1) (Priority: P1) 🎯 MVP

**Goal**: As a learner, I want to see a single decision to make first (choosing an observation/trigger), so I am not overwhelmed by having to choose both the trigger and action simultaneously.

**Independent Test**: Can be tested by rendering the exercise and verifying that only the "IF" choices are visible and the "Save to My Plans" CTA is completely absent.

### Implementation for User Story 1

- [X] T005 [US1] Refactor `src/components/exercise/IfThenPlanCategoryEngine.tsx` to compute current `phase` (default to `selecting_trigger`).
- [X] T006 [US1] Update `src/components/exercise/IfThenPlanCategoryEngine.tsx` to render the "Choose something you've noticed" subtitle and the list of IF options during the `selecting_trigger` phase.
- [X] T007 [US1] Ensure the "Save to My Plans" primary CTA is explicitly hidden in `src/components/exercise/IfThenPlanCategoryEngine.tsx` during `selecting_trigger`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (the user is stuck in State 1 but it renders correctly).

---

## Phase 4: User Story 2 - Choosing the Action (State 2) (Priority: P1)

**Goal**: As a learner, I want the available actions to be contextually relevant to my chosen observation, so I can form a logical micro-experiment without creating a nonsensical plan.

**Independent Test**: Can be tested by selecting an IF option and verifying the UI transitions in place to show the selected IF and the corresponding relevant THEN choices.

### Implementation for User Story 2

- [X] T008 [US2] Add tap handler in `src/components/exercise/IfThenPlanCategoryEngine.tsx` to transition state from `selecting_trigger` to `selecting_action` and save `cueId`.
- [X] T009 [US2] Update `src/components/exercise/IfThenPlanCategoryEngine.tsx` to display the selected IF option (in "selected" brand style) and the "Choose how you'll test it." subtitle during `selecting_action`.
- [X] T010 [US2] Update `src/components/exercise/IfThenPlanCategoryEngine.tsx` to filter and render the appropriate THEN options based on the selected `cueId`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (user can progress to State 2 and see relevant choices).

---

## Phase 5: User Story 3 - Reviewing and Saving the Plan (State 3) (Priority: P1)

**Goal**: As a learner, I want to see a clean preview of my assembled plan and a clear Save action after making my choices, so I feel a sense of completion and understand the consequence of saving.

**Independent Test**: Can be tested by selecting a THEN option and verifying the UI transitions to the summary state with the assembled plan preview and the primary CTA.

### Implementation for User Story 3

- [X] T011 [US3] Add tap handler in `src/components/exercise/IfThenPlanCategoryEngine.tsx` to transition state from `selecting_action` to `review` and save `actionId`.
- [X] T012 [US3] Update `src/components/exercise/IfThenPlanCategoryEngine.tsx` to display the final assembled plan preview card during the `review` phase.
- [X] T013 [US3] Render the privacy text "Private to you. No reminders unless you ask." in `src/components/exercise/IfThenPlanCategoryEngine.tsx` during `review`.
- [X] T014 [US3] Enable the "Save to My Plans" primary CTA in `src/components/exercise/IfThenPlanCategoryEngine.tsx` during `review` to transition to `complete`.

**Checkpoint**: All user stories should now be independently functional. The user can complete the entire staged flow.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T015 Remove any hardcoded leading ellipses from IF/THEN typography in `src/components/exercise/IfThenPlanCategoryEngine.tsx`.
- [X] T016 Ensure `CourseExerciseShell` or `ScrollView` in `src/components/exercise/IfThenPlanCategoryEngine.tsx` has adequate bottom inset so the last selectable option card is not obscured by the sticky footer.
- [X] T017 Verify that no exercise-specific UI components are being created; ensure strict reuse of `CourseExerciseOptionButton` and standard components.
- [X] T018 Run `specs/009-staged-test-builder/quickstart.md` validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential execution recommended (P1 → P2 → P3) due to state transitions building on each other.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P1)**: Can start after User Story 1 (relies on State 1 rendering).
- **User Story 3 (P1)**: Can start after User Story 2 (relies on State 2 rendering).

### Parallel Opportunities

- Foundational data schema updates (T002, T003, T004) can be done together.
- Since the implementation revolves around a single core file (`IfThenPlanCategoryEngine.tsx`), parallelizing user story tasks across multiple developers is not recommended to avoid merge conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify the trigger state correctly renders.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → State 1 works
3. Add User Story 2 → Test independently → State 2 works
4. Add User Story 3 → Test independently → State 3 (Review & Save) works
5. Each story adds value without breaking previous stories.
