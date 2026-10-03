# Tasks: App Store Rating & Review Booster

**Feature**: App Store Rating & Review Booster  
**Branch**: `025-rating-review-booster`  
**Spec**: [specs/025-rating-review-booster/spec.md](specs/025-rating-review-booster/spec.md) | **Plan**: [specs/025-rating-review-booster/plan.md](specs/025-rating-review-booster/plan.md)  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish contract types and StoreKit utility helpers for the review subsystem.

- [X] T001 [P] Define `ReviewMilestone` and contract types in `src/types/reviewPrompt.types.ts`
- [X] T002 [P] Implement `openAppStoreReview()` and StoreKit helpers in `src/utils/appStoreReview.ts`

---

## Phase 2: Foundational (Milestone & Cooldown Engine)

**Purpose**: Core rate limiting and milestone tracking infrastructure that MUST complete before user story triggers can be hooked.

**⚠️ CRITICAL**: Blocks all User Stories.

- [X] T003 Refactor `src/hooks/useReviewPrompt.ts` to implement 90-day timestamp cooldown check (`@happy/review_last_prompted_at`) and completed milestone tracking (`@happy/review_milestones_completed`) with non-blocking error handling

**Checkpoint**: Foundational review prompt engine ready — user story triggers can now be wired.

---

## Phase 3: User Story 1 - Day-1 First Breakthrough Completion Prompt (Priority: P1) 🎯 MVP

**Goal**: Deliver native 1-tap rating sheet 2.0 seconds after a user completes their first CBT exercise or saves their first journal entry.

**Independent Test**: Complete a fresh exercise in `ExerciseFlowScreen` or save a fresh journal entry in `JournalEntryScreen` and verify that StoreKit rating prompt displays 2.0 seconds post-celebration/toast.

### Implementation for User Story 1

- [X] T004 [US1] Integrate 2.0-second post-celebration rating trigger for `first_exercise_completed` in `src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx`
- [X] T005 [US1] Integrate 2.0-second post-save rating trigger for `first_journal_saved` in `src/screens/JournalEntryScreen/hooks/useJournalOperationsHandler.ts`

**Checkpoint**: Day-1 first breakthrough review prompts are fully functional and independently testable.

---

## Phase 4: User Story 2 - Habit & Milestone Review Trigger with 90-Day Cooldown (Priority: P2)

**Goal**: Sustain review velocity for retained users by prompting on streaks (Day 3, 7, 15) and course unit completion without violating Apple's annual quota.

**Independent Test**: Verify milestone events in `StreakDisplay.tsx` and unit completion in course journey pass through the 90-day cooldown logic in `useReviewPrompt`.

### Implementation for User Story 2

- [X] T006 [US2] Update `src/components/Streak/StreakDisplay.tsx` to pass milestone events into the refreshed `useReviewPrompt` engine
- [X] T007 [US2] Connect `course_unit_completed` milestone trigger in course reward completion handler in `src/domains/journey/rewards/useJourneyRewardsController.ts`

**Checkpoint**: User Stories 1 and 2 operate independently with 90-day cooldown preventing spam.

---

## Phase 5: User Story 3 - Persistent Voluntary "Rate Happy" in Settings (Priority: P3)

**Goal**: Provide an unrestricted, user-initiated pathway in Settings to open the App Store review composer.

**Independent Test**: Navigate to Settings, tap "Rate Happy on the App Store", and verify `openAppStoreReview()` opens the App Store composer URL.

### Implementation for User Story 3

- [X] T008 [US3] Add "Rate Happy on the App Store" row calling `openAppStoreReview()` in `src/screens/SettingsScreen/SettingsScreen.tsx`

**Checkpoint**: All three user stories are complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Static verification, line-count audits, and knowledge graph synchronization.

- [X] T009 [P] Verify strict TypeScript compilation with `npx tsc --noEmit`
- [X] T010 [P] Verify 300-line constraint across touched files (`useReviewPrompt.ts`, `appStoreReview.ts`, `SettingsScreen.tsx`)
- [X] T011 Run `graphify update .` to synchronize knowledge graph

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can execute immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all User Stories.
- **User Story 1 (Phase 3 - MVP)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion.
- **User Story 3 (Phase 5)**: Depends on Phase 1 (`appStoreReview.ts`).
- **Polish (Phase 6)**: Runs after all implementation tasks complete.

### Parallel Opportunities

- `T001` and `T002` can execute in parallel during Setup.
- `T004` and `T005` can execute in parallel within User Story 1.
- `T008` (User Story 3) can execute in parallel with User Story 1 and 2 once Phase 1 is done.
- `T009` and `T010` can run in parallel during Polish.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (`T001`, `T002`).
2. Complete Foundational engine (`T003`).
3. Complete User Story 1 (`T004`, `T005`).
4. **Validate MVP**: Test fresh exercise completion and first journal entry save.
5. Ship or demo Day-1 prompt immediately to address the 2-review bottleneck.
