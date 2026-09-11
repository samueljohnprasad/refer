# Implementation Tasks: Lesson Completion Celebration

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `src/components/celebration` directory and scaffold placeholder files
- [x] T002 [P] Create `src/types/celebration.ts` defining `CelebrationContext`, `LessonPhase`, and `CelebrationOverlayProps` from contracts
- [x] T003 Create `app/dev/celebration-test.tsx` as a blank Expo Router screen for Developer Testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement `src/hooks/useCelebrationTimeline.ts` scaffolding that returns Reanimated shared values (`progress`, `opacity`, etc.) but no logic yet
- [x] T005 Implement `src/components/celebration/CelebrationOverlay.tsx` shell that accepts `CelebrationOverlayProps` and renders null if `!isVisible`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Standard Lesson Completion (Priority: P1) 🎯 MVP

**Goal**: Implement the 1.45s choreographed sequence with Happy Ripple, Panda interaction, and contextual copy.

**Independent Test**: Load `app/dev/celebration-test.tsx`, tap "Trigger Standard Celebration", and observe the exact ms-level timeline in the iOS Simulator.

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement `src/components/celebration/HappyRipple.tsx` using `react-native-reanimated` shared values and Tailwind CSS for the concentric ring expansion
- [x] T007 [P] [US1] Implement `src/components/celebration/PandaMetaphor.tsx` using `lottie-react-native` (with placeholder JSON) that maps `pandaAnimationKey` to the correct animation
- [x] T008 [P] [US1] Implement `src/components/celebration/CelebrationTypography.tsx` with controlled asymmetry for primary/secondary copy rendering
- [x] T009 [US1] Complete `src/hooks/useCelebrationTimeline.ts` strictly following the 1.45s timeline (0ms haptic, 350ms Panda, 850ms Ripple, 1000ms Copy, 1450ms CTA)
- [x] T010 [US1] Update `src/hooks/useCelebrationTimeline.ts` to trigger synchronized `expo-haptics` impact feedback using JS timeouts
- [x] T011 [US1] Assemble `src/components/celebration/CelebrationOverlay.tsx` by composing the Ripple, Panda, and Typography components driven by the timeline hook, blocking screen taps during the 1.45s sequence
- [x] T012 [US1] Update `app/dev/celebration-test.tsx` with mock `CelebrationContext` state and a "Trigger Standard Celebration" button to mount the overlay

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - First Daily Completion (Priority: P2)

**Goal**: Acknowledge daily habit with stronger haptics and integrated streak indicator.

**Independent Test**: Load `app/dev/celebration-test.tsx`, tap "Trigger Daily Habit Celebration", and verify the streak indicator appears naturally and haptics are elevated.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create `src/components/celebration/StreakIndicator.tsx` using Tailwind typography to display the subtle daily streak (e.g., "7 day streak ↑")
- [x] T014 [US2] Update `src/hooks/useCelebrationTimeline.ts` to read `CelebrationContext.level`. If `level === 2`, dispatch a slightly stronger `Haptics.impactAsync` variant
- [x] T015 [US2] Update `src/components/celebration/CelebrationTypography.tsx` to organically mount `StreakIndicator` in the layout when `level === 2`
- [x] T016 [US2] Add "Trigger Daily Habit Celebration" test button to `app/dev/celebration-test.tsx` providing `level: 2` in the context

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Journey Map Continuation (Priority: P3)

**Goal**: Seamless return to the journey map, focusing on the completed node, growing the path, and unlocking the next node.

**Independent Test**: Trigger the journey map transition from the dev test screen and observe the 200ms path growth and 400ms node unlock animations.

### Implementation for User Story 3

- [x] T017 [US3] Update Journey Map state/route parameters (e.g., in `app/(tabs)/journey.tsx` or equivalent) to accept an optional `completedNodeId` param on route focus
- [x] T018 [US3] Implement camera/scroll focus logic on the journey map to automatically center on the `completedNodeId` if present
- [x] T019 [US3] Add 200ms delayed path visual growth animation between the completed node and the next available node in the journey component
- [x] T020 [US3] Add 400ms soft morph unlock animation to the Journey Node component when transitioning from locked to available
- [x] T021 [US3] Wire the `onContinue` callback in `app/dev/celebration-test.tsx` to trigger this route transition and simulate the journey map flow

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T022 [P] Code cleanup: Review all new components to ensure Tailwind CSS usage (no generic stylesheets) and enforce <300 line limits per file
- [x] T023 [P] Remove any obsolete generic confetti/stat card code from the legacy completion screen if applicable
- [x] T024 Run `quickstart.md` manual validation across all 3 scenarios in iOS Simulator

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Integrates directly with US1 implementation
- **User Story 3 (P3)**: Transitions from US1/US2 into the journey map

### Parallel Opportunities

- T006, T007, T008 can be built in parallel as they are independent presentation components.
- T013 can be built independently of the timeline hook updates.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Standard Celebration) → Validate 1.45s timeline in dev screen
3. Add User Story 2 (Daily Celebration) → Validate streak and haptics
4. Add User Story 3 (Journey Map) → Validate double-dopamine transition

---

## Parallel Dispatch Execution Plan

To execute this plan using parallel subagents (e.g., via `dispatching-parallel-agents`), the tasks have been explicitly grouped into independent dispatches that avoid race conditions or merge conflicts.

### Dispatch Wave 1: Foundation (Sequential)
*Wait for this wave to complete before starting Wave 2. This creates the shared types and component shells.*
- **Agent 1 (Infrastructure)**: "Implement Phase 1 (Setup) and Phase 2 (Foundational) tasks T001 through T005. Create the directory structures, `celebration.ts` types, the shell for `useCelebrationTimeline`, and the empty `CelebrationOverlay` component."

### Dispatch Wave 2: Isolated UI Components (Parallel)
*These components have no shared state and can be built concurrently.*
- **Agent 1 (Ripple)**: "Implement T006: Create `HappyRipple.tsx` using Reanimated shared values."
- **Agent 2 (Metaphor)**: "Implement T007: Create `PandaMetaphor.tsx` using `lottie-react-native`."
- **Agent 3 (Typography)**: "Implement T008 and T013: Create `CelebrationTypography.tsx` and `StreakIndicator.tsx`."

### Dispatch Wave 3: Orchestration & Logic (Sequential)
*Wait for UI components to exist, then wire up the strict timeline and layout.*
- **Agent 1 (Timeline & Wiring)**: "Implement T009, T010, T011, T014, and T015. Fill in `useCelebrationTimeline.ts` with the precise 1.45s sequence and haptics, then compose the UI components into `CelebrationOverlay.tsx`."

### Dispatch Wave 4: Integration & Testing (Parallel)
*These impact entirely different screens (Journey Map vs Dev Test).*
- **Agent 1 (Journey Map)**: "Implement T017, T018, T019, T020. Update the Journey Map route and component to accept `completedNodeId`, handle camera focus, path growth, and unlocking animations."
- **Agent 2 (Dev Screen)**: "Implement T012, T016, T021. Wire up `app/dev/celebration-test.tsx` to trigger the standard celebration, daily celebration, and simulate the journey map transition."

### Dispatch Wave 5: Polish (Sequential)
- **Agent 1 (Cleanup)**: "Implement T022, T023, T024. Review all code for SRP/Dry principles, ensure <300 lines per file, remove legacy confetti code, and run manual validation."

## Phase 7: Convergence

- [x] T025 Wire `CelebrationOverlay` into the real exercise runner completion flow (replace the call to `LessonCompleteSheet` with `CelebrationOverlay`) per Objective and FR-1.1 (`missing`)
- [x] T026 Update `JourneyMapContainer` and `JourneyMapView` to accept `completedNodeId` and center the camera per FR-6.1 (`missing`)
- [x] T027 Implement 200ms path growth animation in Journey Map per FR-6.2 (`missing`)
- [x] T028 Implement 400ms morph unlock animation in Journey Map node per FR-6.2 (`missing`)
- [x] T029 Delete `src/domains/journey/ui/components/LessonCompleteSheet.tsx` and any other legacy generic gamification confetti/stat cards per FR-2.3, FR-4.3 (`missing`)
