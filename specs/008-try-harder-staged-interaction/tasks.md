# Implementation Tasks: Staged Interaction for "Try Harder to Sleep"

**Branch**: `008-try-harder-staged-interaction` | **Date**: 2026-08-31 | **Spec**: specs/008-try-harder-staged-interaction/spec.md

## Phase 1: Setup
**Purpose**: Environment and configuration readiness

- [x] T001 Update exercise config for explicit submission mode and stage routing in `src/exercises/ParadoxCard/config.ts`

---

## Phase 2: Foundational
**Purpose**: Component structural changes necessary for all states

- [x] T002 Refactor state tracking to use explicit "ready" | "result" | "explanation" stages instead of alarm/pushCount integers in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
- [x] T003 Remove the side-by-side comparison cards and related UI from `src/components/exercise/ParadoxCardCategoryEngine.tsx`

---

## Phase 3: User Story 1 - Initial Observation (Ready State) (Priority: P1) 🎯 MVP
**Goal**: Render only the expectation, alertness gauge, and CTA

- [x] T004 [US1] Implement conditional rendering to hide the explanation section when stage is "ready" in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
- [x] T005 [US1] Update the alertness gauge styling and label to "Body alertness" in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
- [x] T006 [US1] Set initial gauge position to near calm in `src/components/exercise/ParadoxCardCategoryEngine.tsx`

---

## Phase 4: User Story 2 - Experiencing the Consequence (Result State) (Priority: P1)
**Goal**: Animate the gauge and update text upon interaction without revealing explanation

- [x] T007 [US2] Update `getPrimaryTransition` and `getPrimaryLabel` to advance stage to "result" and label to "See why" in `src/exercises/ParadoxCard/config.ts`
- [x] T008 [US2] Implement animation to move gauge toward "wired" when stage transitions to "result" in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
- [x] T009 [US2] Update display text to "What happened: More effort → more alertness" when stage is "result" in `src/components/exercise/ParadoxCardCategoryEngine.tsx`

---

## Phase 5: User Story 3 - Understanding the Theory (Explanation State) (Priority: P2)
**Goal**: Reveal final takeaway when requested

- [x] T010 [US3] Update `getPrimaryTransition` and `getPrimaryLabel` to advance stage to "explanation" and label to "Continue" in `src/exercises/ParadoxCard/config.ts`
- [x] T011 [US3] Implement conditional rendering to reveal the explanation section ("Why this happens") when stage is "explanation" in `src/components/exercise/ParadoxCardCategoryEngine.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns
**Purpose**: Accessibility and animation edge cases

- [x] T012 Add reduced motion checks to snap gauge animation instantaneously if enabled in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
- [x] T013 Update accessibility labels for screen readers to announce state changes in `src/components/exercise/ParadoxCardCategoryEngine.tsx`
