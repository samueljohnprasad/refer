# Tasks: Continue Your Journey Card

**Branch**: `017-continue-journey-card` | **Date**: 2026-09-08 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define component interfaces and scaffold component structure

- [X] T001 Create component directory and define TypeScript interfaces in src/components/ContinueJourneyCard/types.ts
- [X] T002 [P] Implement loading skeleton placeholder in src/components/ContinueJourneyCard/ContinueJourneyCardSkeleton.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state hook and Home screen integration scaffolding

**⚠️ CRITICAL**: Must complete before user story refinements

- [X] T003 Implement foundational view model hook with Redux selectors in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T004 Create base presentational container and interactive card wrapper in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T005 Integrate ContinueJourneyCard into src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx beneath WeeklyStreakWidget

**Checkpoint**: Foundation ready — base card renders on Home screen beneath streak widget

---

## Phase 3: User Story 1 - Active Course Next Activity Resume (State A) (Priority: P1) 🎯 MVP

**Goal**: User sees active course name, artwork, next activity title, duration, and can resume learning in one tap without navigating the journey map.

**Independent Test**: Have an enrolled user with an active course view Home, verify course and next activity title are displayed, and tap anywhere on the card to launch `/tabs/screens/journey-flow`.

### Implementation for User Story 1

- [X] T006 [US1] Implement State A data derivation in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T007 [US1] Implement State A visual rendering in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T008 [US1] Verify State A end-to-end against quickstart.md Scenario 1 and run npx tsc --noEmit

**Checkpoint**: User Story 1 functional and independently testable as MVP

---

## Phase 4: User Story 2 - No Active Course Journey Discovery (State B) (Priority: P2)

**Goal**: User without an active course sees a friendly invitation to explore journeys and can tap to navigate to the journey catalog.

**Independent Test**: With an unenrolled account, verify card displays "Find your next step" and tapping navigates to `/tabs/(tabs)/journeys`.

### Implementation for User Story 2

- [X] T009 [US2] Implement State B resolution and navigation in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T010 [US2] Implement State B visual rendering in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T011 [US2] Verify State B end-to-end against quickstart.md Scenario 2

**Checkpoint**: User Stories 1 and 2 functional independently

---

## Phase 5: User Story 3 - Completed Journey Revisit & Skill Review (State C) (Priority: P3)

**Goal**: User who completed all required activities sees completion-aware content and can tap to review skills.

**Independent Test**: With a course where all required nodes are completed, verify card displays "Journey complete" and tapping navigates to `/tabs/(tabs)/journeys`.

### Implementation for User Story 3

- [X] T012 [US3] Implement State C completion detection in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T013 [US3] Implement State C visual rendering in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T014 [US3] Verify State C end-to-end against quickstart.md Scenario 3

**Checkpoint**: User Stories 1, 2, and 3 functional independently

---

## Phase 6: User Story 4 - Resilient Loading & Graceful Fallback (States D & E) (Priority: P4)

**Goal**: Loading displays a matching skeleton without flashing empty state; network errors display a quiet fallback to open journeys.

**Independent Test**: Simulate slow network to verify skeleton dimensions; simulate network error to verify quiet fallback to `/tabs/(tabs)/journeys`.

### Implementation for User Story 4

- [X] T015 [US4] Implement State D loading and State E error resolution guards in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T016 [US4] Implement State D skeleton rendering and State E fallback UI in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T017 [US4] Verify States D & E against quickstart.md Scenario 4

**Checkpoint**: Loading and error resilience verified

---

## Phase 7: User Story 5 - Automatic Progress Sync on Screen Return (Priority: P5)

**Goal**: Completing an activity updates the Home card automatically within 500ms upon screen return without manual refresh.

**Independent Test**: Launch a lesson from Home card, complete it, navigate back to Home, and confirm the next activity has updated automatically.

### Implementation for User Story 5

- [X] T018 [US5] Verify reactive Redux store invalidation and automatic card update in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T019 [US5] Verify screen return synchronization meets <500ms requirement against quickstart.md Scenario 5

**Checkpoint**: Real-time progress synchronization verified

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Analytics, accessibility, strict type conformance, and line limit compliance

- [X] T020 [P] Implement PostHog analytics tracking (home_journey_card_viewed, home_journey_card_tapped) in src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
- [X] T021 [P] Ensure accessible 48pt tap targets, Dynamic Type wrapping, and VoiceOver accessibility labels in src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
- [X] T022 Enforce Ponytail mode line limits (<300 lines/file) and run strict TypeScript compilation check npx tsc --noEmit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 — Deliverable MVP
- **User Story 2 (Phase 4)**: Depends on Phase 2
- **User Story 3 (Phase 5)**: Depends on Phase 2
- **User Story 4 (Phase 6)**: Depends on Phase 2
- **User Story 5 (Phase 7)**: Depends on Phase 3 (US1)
- **Polish (Phase 8)**: Depends on User Stories completion

### Parallel Opportunities

- T001 and T002 can be implemented in parallel.
- T020 (analytics) and T021 (accessibility) can be implemented in parallel during Polish.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Complete Phase 3: User Story 1 (T006–T008)
4. **STOP and VALIDATE**: Verify active course resume on Home screen
5. Proceed to subsequent stories incrementally
