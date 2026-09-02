# Implementation Tasks: Interactive Reframe Correct/Wrong States

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No shared infrastructure setup is required for this feature as it modifies existing components in an established repository).*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

-[X] T001 Extend `InteractiveReframeStagger` to accept `path` prop (`'correct'` | `'wrong'`) instead of `stepType` in `src/components/exercise/InteractiveReframeStagger.tsx`
-[X] T002 Update local state in `InteractiveReframeCategoryEngine` to track `selectedPath: 'correct' | 'wrong' | null` in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Replacing Choice with Meaningful Consequence (Priority: P1) 🎯 MVP

**Goal**: Provide meaningful, interactive consequences instead of generic feedback so learners understand the underlying mental model.

**Independent Test**: Select wrong answer and see consequence cascade; reset. Select correct answer, see correct cascade, see "Remember" takeaway.

### Implementation for User Story 1

-[X] T003 [US1] Add wrong path text sequence ("TRY HARDER -> more checking -> more pressure") to `InteractiveReframeStagger` in `src/components/exercise/InteractiveReframeStagger.tsx`
-[X] T004 [US1] Add UI for the two initial choice buttons ("What might have shifted?" and "Should I try harder tonight?") in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`
-[X] T005 [US1] Implement branching logic when choices are tapped (set `selectedPath` and `step=1`) in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`
-[X] T006 [US1] Add "TRY ANOTHER READING" button for the wrong path reset logic in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`
-[X] T007 [US1] Hide global Continue footer entirely until correct path is completed in `src/exercises/InteractiveReframe/config.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The cascades should work, and the exercise should branch properly.

---

## Phase 4: User Story 2 - Removing Punitive Error States (Priority: P2)

**Goal**: Ensure wrong choices feel like an exploration of a misconception rather than a failure by removing hostile red styling and "Not quite" feedback.

**Independent Test**: Make a wrong choice and verify that only the selected option button turns red, while the hero box and consequence cascade remain neutrally styled without generic error text.

### Implementation for User Story 2

-[X] T008 [US2] Style the "Should I try harder tonight?" button with a red border only when selected as the wrong path in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`
-[X] T009 [US2] Update hero box container styles to use neutral/warning colors instead of red when revealing wrong consequence in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`
-[X] T010 [US2] Ensure "NOT QUITE" text is not rendered anywhere in the wrong path UI in `src/components/exercise/InteractiveReframeCategoryEngine.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. The wrong path should feel exploratory rather than punitive.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

-[X] T011 Verify smooth `FadeInUp` and `LinearTransition` animations trigger seamlessly for all layout changes
-[X] T012 Run quickstart.md validation locally on the iOS simulator

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately (empty for this feature).
- **Foundational (Phase 2)**: BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. Must proceed sequentially (US1 → US2) as US2 styles the elements created in US1.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational Phase (Phase 2).
- **User Story 2 (P2)**: Depends on User Story 1 (P1) as it refines the styling of the branching elements.

### Within Each User Story

- State and structure implementation before visual styling.
- Core implementation before integration.

### Parallel Opportunities

- Foundational tasks (T001, T002) can be worked on in parallel by different developers.
- Polishing tasks can be executed in parallel after the main implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test branching paths on the iOS simulator.
4. Deploy/demo if ready.

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test branching and cascades → Demo
3. Add User Story 2 → Test non-punitive styling → Demo

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable

## Phase 5: Convergence

- [X] T013 Add `disabled={step > 0}` to choice buttons to prevent visual active states on multiple rapid taps per Edge Cases (missing)
