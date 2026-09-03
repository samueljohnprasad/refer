# Tasks: Arun's Night Audit

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure

- [x] T001 Create `src/components/exercise/TimelineRewindCategoryEngine.tsx` and `src/components/exercise/timelineRewindStyles.ts` scaffolds

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add `timeline_rewind` to `CourseExerciseCategoryEnum` in `src/types/courseExercises.ts`
- [x] T003 Register `TimelineRewindCategoryEngine` in `src/components/exercise/courseExerciseCategoryEngineRegistry.ts`
- [x] T004 Implement content reading logic and local state shape (`selectedPathId`, `revealCount`, `rewound`, `alternatePathId`) in `TimelineRewindCategoryEngine.tsx`

**Checkpoint**: Foundation ready - exercise engine is registered and ready to render content.

---

## Phase 3: User Story 1 - Initial Setup & Timeline Parity (Priority: P1) 🎯 MVP
**Goal**: The user sees a neutral setup, chooses an interpretation, and sees the timeline unfold distinguishing evidence from interpretation.

**Independent Test**: The screen initially shows no timeline. Selecting a choice expands the timeline sequentially in place. No scrolling should be required yet.

### Implementation for User Story 1
- [x] T005 [US1] Implement the initial setup UI (title, setup text, and two parity choices using `CourseExerciseOptionButton`) in `TimelineRewindCategoryEngine.tsx`
- [x] T006 [US1] Build the generic timeline row components (Evidence styling = neutral, Interpretation styling = cream/sage) in `TimelineRewindCategoryEngine.tsx` and `timelineRewindStyles.ts`
- [x] T007 [US1] Implement the auto-advancing `revealCount` timer logic when a path is selected

**Checkpoint**: At this point, User Story 1 is functional. The user can select a path and see the timeline populate.

---

## Phase 4: User Story 2 - Rewind Animation (Priority: P2)
**Goal**: The user can "Rewind" the night, collapsing their first choice into a read-only summary, and exploring the alternate timeline.

**Independent Test**: Tapping "REWIND THE NIGHT" plays a 300-450ms animation that resets the timeline, collapses the first choice without layout thrashing, and expands the second choice.

### Implementation for User Story 2
- [x] T008 [US2] Implement the "REWIND THE NIGHT" button action that triggers the `rewound` state
- [x] T009 [US2] Wrap the timeline paths in `react-native-reanimated` views with `layout` transitions (e.g., `LinearTransition`) in `TimelineRewindCategoryEngine.tsx`
- [x] T010 [US2] Implement the collapsed, read-only summary styling for the previously completed path to prevent interaction in `timelineRewindStyles.ts`

**Checkpoint**: At this point, the rewind mechanic works fluidly and prevents invalid interactions with old state.

---

## Phase 5: User Story 3 - Immediate Commit & Insight Reveal (Priority: P3)
**Goal**: Answering the final reflection commits instantly and reveals the core insight using strong typography instead of clunky dashed boxes.

**Independent Test**: The final question commits on tap without a "Check" phase, and exactly one strong typographic takeaway is displayed.

### Implementation for User Story 3
- [x] T011 [US3] Implement the reflection question UI utilizing `CourseExerciseOptionButton` for immediate commit via `onInteraction(..., true)` in `TimelineRewindCategoryEngine.tsx`
- [x] T012 [US3] Implement the final insight reveal using typography hierarchy and the final "CONTINUE" action in `TimelineRewindCategoryEngine.tsx`
- [x] T013 [US3] Ensure all UI clutter (Skip buttons post-selection, dashed bounding boxes, private pattern check pills) is explicitly removed or excluded

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories

- [x] T014 Run validation scenarios from `quickstart.md` manually via iOS Simulator
- [x] T015 Verify React Native Reanimated performance (60fps layout transitions) and ensure no visual layout shifts on button press

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Stories (Phase 3+)**: Must be executed sequentially (US1 → US2 → US3) since they build the UI progressively.
- **Polish (Final Phase)**: Depends on all user stories.

### User Story Dependencies
- **US1 (Initial Setup)**: Independent.
- **US2 (Rewind Animation)**: Depends on US1's timeline structure.
- **US3 (Immediate Commit)**: Depends on US2 completing the timeline expansion.

### Parallel Opportunities
- T002 and T003 can be executed in parallel since they touch different registry files.
- The rest of the implementation is heavily localized to `TimelineRewindCategoryEngine.tsx`, making sequential execution safer to avoid merge conflicts in the same file.

---

## Parallel Example: User Story 1
```bash
# Register the engine in both files simultaneously
Task: "Add `timeline_rewind` to `CourseExerciseCategoryEnum` in `src/types/courseExercises.ts`"
Task: "Register `TimelineRewindCategoryEngine` in `src/components/exercise/courseExerciseCategoryEngineRegistry.ts`"
```

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 and 2 (Setup & Foundation).
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Verify the timeline renders correctly and respects the ponytail mode minimal design.

### Incremental Delivery
1. Add US2 (Rewind) → Test animation performance.
2. Add US3 (Final Insight) → Verify 1-tap commit behavior.
