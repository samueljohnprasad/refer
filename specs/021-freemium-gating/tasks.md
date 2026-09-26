# Tasks: App-Wide Freemium Gating (Model A)

**Input**: Design documents from `/specs/021-freemium-gating/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)

---

## Phase 1: Setup (Shared Types & Master Registry)

**Purpose**: Type definitions and master configurations for freemium gating

- [X] T001 [P] Define `isProOnly?: boolean` in `ExerciseConfig` interface in `src/types/exerciseFlow.ts`
- [X] T002 [P] Define `unitIndex?: number` on `JourneyNode` and `unitIndex?: number`, `isProOnly?: boolean` on `JourneyDividerItem` in `src/types/journey/node.ts`
- [X] T003 [P] Define `PRO_EXERCISE_TYPES` master set and register `isProOnly` in `src/data/exerciseRegistry.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Central hook and layout pipeline infrastructure required across all user stories

**⚠️ CRITICAL**: Must be completed before user story implementation

- [X] T004 Create centralized `useFreemiumGate` hook with `FREEMIUM_LIMITS` and `requirePro` in `src/hooks/useFreemiumGate.ts`
- [X] T005 [P] Update `journeyLayout.ts` pipeline to pass 0-indexed `unitIndex` and `isProOnly` to dividers and nodes in `src/lib/utils/journeyLayout.ts`
- [X] T006 [P] Add `disabled?: boolean` prop support to bypass reveal navigation on gated taps in `src/components/CircularRevealWrapper/CircularRevealWrapper.tsx`

**Checkpoint**: Foundation ready - user story gating can now be integrated across features

---

## Phase 3: User Story 1 - Free Journey Experience & Progressive Unit Gating (Priority: P1) 🎯 MVP

**Goal**: Keep Unit 1 free; visibly lock Unit 2+ nodes with PRO divider badge and trigger paywall on tap

**Independent Test**: Complete Unit 1 as a free user and verify lesson access. Scroll to Unit 2, verify PRO badge on divider and locked padlock icon on nodes. Tap any Unit 2 node and verify paywall is presented.

- [X] T007 [P] [US1] Add `isProGated` evaluation and paywall intercept to `useJourneyNodeCellViewModel` in `src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts`
- [X] T008 [P] [US1] Suppress route-to-flow when `isProGated` is true in `src/domains/journey/ui/components/JourneyNodeCell.tsx`
- [X] T009 [P] [US1] Add `isProOnly` prop and render PRO badge pill in `src/domains/journey/ui/components/UnitDivider.tsx`
- [X] T010 [US1] Forward `isProOnly` from `item` to `UnitDivider` in `src/domains/journey/ui/components/DividerCell.tsx`

**Checkpoint**: User Story 1 functional - Unit 1 open, Unit 2+ locked and paywalled independently

---

## Phase 4: User Story 2 - Core Foundational CBT Exercises vs. Specialized Pro Library (Priority: P1)

**Goal**: Unrestricted access to 5 foundational CBT exercises; PRO chips and paywall interception on 8 specialized exercises

**Independent Test**: Launch "Thought Catcher" as free user and verify it opens. Tap "Decatastrophizing" and verify PRO badge is displayed and tapping presents the paywall without starting the exercise.

- [X] T011 [P] [US2] Update `FeaturedExerciseHero` with `useFreemiumGate`, PRO badge chip, and reveal suppression in `src/screens/ExercisesScreen/ExercisesScreen.tsx`
- [X] T012 [P] [US2] Update `ExerciseShelfCard` with `useFreemiumGate`, top-right PRO chip, and paywall trigger in `src/screens/ExercisesScreen/ExercisesScreen.tsx`
- [X] T013 [P] [US2] Update `CompactExerciseRow` with `useFreemiumGate`, inline PRO chip, and paywall trigger in `src/screens/ExercisesScreen/ExercisesScreen.tsx`
- [X] T014 [US2] Gate `handleExercisePress` with `requirePro("exercise")` for Pro exercises in `src/screens/ExercisesScreen/ExercisesScreen.tsx`

**Checkpoint**: User Story 2 functional - Catalog visibly differentiates and gates Pro exercises

---

## Phase 5: User Story 3 - Voice Journaling Fair-Use Quota (Priority: P2)

**Goal**: Allow 3 free voice journal recordings per rolling 7 days; present paywall once quota reached

**Independent Test**: Complete 3 recordings on a free account. Attempt a 4th voice recording and verify recorder launch is blocked and paywall modal is presented.

- [X] T015 [P] [US3] Verify `useJournalLimit` 3-entry weekly limit hook integration in `hooks/useJournalLimit.ts`
- [X] T016 [US3] Add paywall guard and route bounce on quota exceeded in `app/tabs/screens/(recording)/voice-recorder.tsx`

**Checkpoint**: User Story 3 functional - Voice recording quota enforced without data loss

---

## Phase 6: User Story 4 - Coping Cards Deck Capacity Limit (Priority: P2)

**Goal**: Cap active pocket deck capacity at 5 coping cards for free users; gate saving additional cards

**Independent Test**: Populate deck with 5 active cards. Attempt to save a card from an exercise summary; verify warning haptic and paywall trigger while inputs remain intact.

- [X] T017 [US4] Integrate `useFreemiumGate` quota check into `saveCard` mutation in `src/hooks/useCopingCards.ts`

**Checkpoint**: User Story 4 functional - 5-card capacity limit enforced across all summary screens

---

## Phase 7: User Story 5 - Daily Habit Tracking Capacity (Priority: P3)

**Goal**: Limit simultaneous active habits to 3 for free users; gate "+ Add Habit" when limit reached

**Independent Test**: Add 3 active habits on a free account. Tap "+ Add Habit"; verify creation modal does not open and paywall is presented.

- [X] T018 [US5] Intercept `handleAddHabitPress` with `requirePro("habits", habits.length)` in `src/components/habits/HabitsSection.tsx`

**Checkpoint**: User Story 5 functional - 3-habit limit enforced with graceful upgrade prompt

---

## Phase 8: User Story 6 - Advanced Timeline Analytics & Therapist Reports (Priority: P3)

**Goal**: Keep 7-day mood history free; present locked preview cards for Belief Decay and Therapist Notebook

**Independent Test**: Open Timeline tab as free user. Verify basic mood chart is visible, while Belief Decay and Therapist Notebook cards show lock overlays with unlock CTAs.

- [X] T019 [P] [US6] Ensure `LockedBeliefCard` and `LockedNotebookCard` present paywall cleanly in `src/components/insights/BeliefDecayCard.tsx` and `src/components/insights/TherapistNotebookCard.tsx`

**Checkpoint**: User Story 6 functional - Deep clinical analytics gated behind Pro

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Verification, type checking, and documentation updates across all user stories

- [X] T020 [P] Run strict TypeScript typecheck verification (`npx tsc --noEmit`)
- [X] T021 [P] Verify scenarios in `specs/021-freemium-gating/quickstart.md`
- [X] T022 Update codebase knowledge graph with `graphify update .`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Journeys) and US2 (Exercises) can run in parallel
  - US3 (Voice), US4 (Cards), US5 (Habits), US6 (Timeline) can proceed independently
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Journeys)**: Depends on T001, T002, T004, T005
- **User Story 2 (P1 - Exercises)**: Depends on T001, T003, T004, T006
- **User Story 3 (P2 - Voice)**: Depends on T004
- **User Story 4 (P2 - Coping Cards)**: Depends on T004
- **User Story 5 (P3 - Habits)**: Depends on T004
- **User Story 6 (P3 - Timeline)**: Depends on T004

---

## Parallel Opportunities

- **Phase 1 Setup**: T001, T002, and T003 can execute in parallel
- **Phase 2 Foundation**: T005 and T006 can execute in parallel
- **Phase 3 (US1)**: T007, T008, and T009 can execute in parallel
- **Phase 4 (US2)**: T011, T012, and T013 can execute in parallel
- **Cross-Story**: Once Phase 2 is complete, US1, US2, US3, US4, US5, and US6 can all be executed independently without file conflicts

---

## Implementation Strategy

### MVP First (User Story 1 & User Story 2)

1. Complete Phase 1: Setup (`exerciseFlow.ts`, `node.ts`, `exerciseRegistry.ts`)
2. Complete Phase 2: Foundational (`useFreemiumGate.ts`, `journeyLayout.ts`, `CircularRevealWrapper.tsx`)
3. Complete Phase 3: User Story 1 (Unit 1 free, Unit 2+ locked)
4. Complete Phase 4: User Story 2 (5 core free, 8 specialized Pro)
5. **STOP and VALIDATE**: Verify primary learning journey and catalog gating

### Incremental Delivery

1. Complete Setup + Foundational → Gating foundation ready
2. Add US1 & US2 → Core curriculum gating active (MVP)
3. Add US3 & US4 → Voice and Coping Card quotas active
4. Add US5 & US6 → Habits and Timeline analytics active
5. Polish & Verification → End-to-end typecheck and knowledge graph synchronization
