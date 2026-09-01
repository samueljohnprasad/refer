# Implementation Tasks: Clear Space Guided Discovery

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project builds cleanly before starting refactoring in `src/components/exercise/ToolkitShelfCategoryEngine.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update `createResponse` and phase logic in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to support the new `selecting_moment` and `review` phases.
- [x] T003 Refactor the state read/write handling in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` for `selectedMomentIndex` to ensure the component relies on the two-step phase logic.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Choose Context (Priority: P1) 🎯 MVP

**Goal**: As a learner, I want to see only the moment options first, so I can focus on identifying my current situation without being distracted by the answers.

**Independent Test**: Can be tested by rendering the exercise and verifying that the strategy taxonomy (top carousel) is completely absent and only the 4 moment cards are visible, and the "Continue" button is disabled.

### Implementation for User Story 1

- [x] T004 [US1] Remove the `tools` array visual rendering (top horizontal carousel and dividing line) entirely from `src/components/exercise/ToolkitShelfCategoryEngine.tsx`.
- [x] T005 [US1] Refactor the moments rendering loop in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to use the `CourseExerciseOptionButton` component instead of the custom local `Pressable`.
- [x] T006 [US1] Update `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to render the moment choices when `phase === "selecting_moment"`.
- [x] T007 [US1] Ensure `onInteraction(saved, false)` is called during `selecting_moment` in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to hide/disable the "Continue" primary CTA.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (the user sees the choices cleanly without answers).

---

## Phase 4: User Story 2 - Reveal Fit (Priority: P1)

**Goal**: As a learner, after choosing a moment, I want to see the specific strategy that fits my situation and a brief reason why, so I clearly understand the connection between my state and the tool.

**Independent Test**: Can be tested by selecting a moment and verifying that the UI updates in-place to highlight the chosen moment, hides the others, and reveals the corresponding strategy as a non-interactive readable block.

### Implementation for User Story 2

- [x] T008 [US2] Add tap handler in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to transition state from `selecting_moment` to `review` and save `selectedMomentIndex`.
- [x] T009 [US2] Update `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to hide unselected moments during the `review` phase and force the selected moment to render in its "selected" brand style.
- [x] T010 [US2] Refactor the result view in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to render the chosen Strategy/Tool as a non-interactive information block (soft sage surface, no prominent border) when `phase === "review"`.
- [x] T011 [US2] Remove any duplicate/excessive text from the Strategy block in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to only display the concise key (`selectedMoment.key`) and explanation (`selectedMoment.response`).
- [x] T012 [US2] Enable the "Continue" CTA during `review` in `src/components/exercise/ToolkitShelfCategoryEngine.tsx` by setting `ready: true` in `onInteraction`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Verify that no extra horizontal scroll indicators or decorative lines (e.g., the old `h-[5px]` horizontal line) are leaking into the layout in `src/components/exercise/ToolkitShelfCategoryEngine.tsx`.
- [x] T014 Run `quickstart.md` validation on the completed exercise.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Due to the sequential nature of this UI interaction (State 1 must exist before State 2 can be verified), sequential execution (US1 → US2) is recommended.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P1)**: Can start after User Story 1 - Relies on State 1 rendering properly to be testable.

### Parallel Opportunities

- The entire implementation refactors a single file (`ToolkitShelfCategoryEngine.tsx`). Parallelizing tasks across different developers is not recommended due to high risk of merge conflicts in the state machine and render function. 

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently. Verify the carousel is gone and the moment list uses `CourseExerciseOptionButton`.

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Each story adds value without breaking previous states.
