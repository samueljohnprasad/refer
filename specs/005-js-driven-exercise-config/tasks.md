# Tasks: JS-Driven Exercise Config for Journey Map Exercises

## Phase 1: Setup
- [x] T001 Analyze `CourseExerciseCategoryConfig` interface
- [x] T002 Identify all scattered `microlearningContentValidation.ts` rules

## Phase 2: Foundational
- [x] T003 Expand `CourseExerciseCategoryConfig` in `courseExerciseCategoryConfig.ts` with semantic configuration groups.
- [x] T004 Define `DEFAULT_COURSE_EXERCISE_CONFIG` in `courseExerciseCategoryConfig.ts`.
- [x] T005 Create `resolveCourseExerciseConfig` function in `courseExerciseCategoryConfig.ts`.

## Phase 3: User Story 1 - Validation Migration (P1)
- [x] T006 Extract validation logic for early alphabet categories (A-M) into their respective `config.ts` files.
- [x] T007 Extract validation logic for late alphabet categories (N-Z) into their respective `config.ts` files.
- [x] T008 Refactor `microlearningContentValidation.ts` to dispatch via `resolveCourseExerciseConfig(category).validation`.

## Phase 4: User Story 2 - UI Flags Migration (P2)
- [x] T009 Refactor `CourseExerciseShell.tsx` (and related wrapper components) to consume UI flags (e.g., `showSubtitle`) from the config instead of `CourseExerciseCategoryEnum`.

## Phase 5: User Story 3 - Label & Transition Migration (P3)
- [x] T010 Update `ExerciseInteractionConfig` to include `getPrimaryLabel` and `getPrimaryTransition` properties in `courseExerciseCategoryConfig.ts`.
- [x] T011 Update `courseExercisePrimaryTransition.ts` to consume logic from `config.interaction`.
- [x] T012 Extract `NodeEngineRouter.helpers.ts` scattered edge cases (e.g. `getSelectedOptionFeedback`, `buildRetryResponse`) into the config.
- [x] T013 Update all existing `config.ts` files to include the base `interaction.getPrimaryLabel` and `interaction.getPrimaryTransition` mapping.
- [x] T014 Remove legacy `switch(category)` statements directly inside `courseExercisePrimaryTransition.ts`.

## Phase 6: User Story 4 - Batch Transition Migration (P4)
**Goal**: Migrate the remaining hardcoded logic inside the 7 legacy batch transition files directly into their respective exercise `config.ts` files to achieve 100% config-driven routing.

- [x] T015 [P] [US4] Extract `ParadoxCard`, `OneLineReveal`, and `WhatIfMachine` logic from `src/domains/journey/learning/courseExerciseFifthBatchTransition.ts` into their respective `src/exercises/*/config.ts` files.
- [x] T016 [P] [US4] Extract logic for `GuidedDiscoveryTrail`, `TeachBackChain`, `RecallWarmup`, `FillBlank` from `src/domains/journey/learning/courseExerciseSixthBatchTransition.ts` into their respective `config.ts` files.
- [x] T017 [P] [US4] Extract logic for `CuriosityBet`, `PanicWaveCommit`, `WaveOrdering` from `src/domains/journey/learning/courseExerciseSeventhBatchTransition.ts` into their respective `config.ts` files.
- [x] T018 [P] [US4] Extract logic for `LeverCheck`, `PrivateCheck`, `SameButDifferent` from `src/domains/journey/learning/courseExerciseNinthBatchTransition.ts` into their respective `config.ts` files.
- [x] T019 [P] [US4] Extract logic for `SocraticDialogue`, `AssociationMeter`, `LensReplay`, `ToolkitShelf`, `LeverMatch` from `src/domains/journey/learning/courseExerciseTenthBatchTransition.ts` into their respective `config.ts` files.
- [x] T020 [P] [US4] Extract logic for `LeverScenario`, `WorkedRewrite`, `FadedThoughtRecord`, `ReframeBuilder`, `SituationLanguage` from `src/domains/journey/learning/courseExerciseEleventhBatchTransition.ts` into their respective `config.ts` files.
- [x] T021 [P] [US4] Extract logic for `IfThenPlan`, `CourseCheckpoint`, `SectionMilestone` from `src/domains/journey/learning/courseExerciseFinalBatchTransition.ts` into their respective `config.ts` files.

## Phase 7: Polish & Cleanup
- [x] T022 [US4] Delete the 7 `*BatchTransition.ts` files in `src/domains/journey/learning/`.
- [x] T023 [US4] Remove `getBatchPrimaryLabel` and `getBatchPrimaryTransition` from `src/domains/journey/learning/courseExerciseBatchTransitions.ts` and `courseExercisePrimaryTransition.ts`, and delete `courseExerciseBatchTransitions.ts`.

---

## Dependencies & Execution Order
- T015-T021 can all be run in parallel, as they touch isolated exercise configs.
- T022 and T023 must run after T015-T021 are fully completed, to clean up the dead code.
