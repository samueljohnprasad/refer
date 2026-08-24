# Implementation Tasks: Dialogue Exercise Redesign

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create `dialogueStyles.ts` with NativeWind style constants in src/components/exercise/dialogueStyles.ts
- [x] T002 [P] Add Dialogue dev fixture to review group in src/screens/CourseExercisesTestScreen/fixtures/review.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create content types and basic validator in src/components/exercise/dialogueContent.ts
- [x] T004 [P] Create response types and `hasSameDialogueResponse` in src/components/exercise/dialogueResponse.ts
- [x] T005 Wire dialogue content validator into src/components/exercise/microlearning/microlearningContentValidation.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 – Advancing Through a Passive Dialogue (Priority: P1) 🎯 MVP

**Goal**: A learner opens a Dialogue, sees the first beat, and can advance through passive beats one by one until the end, tracking state safely.

**Independent Test**: Load the fixture. Tap "Next message" repeatedly until the insight appears and "Continue" is shown. Observe correct message advancement and final state.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `createDialogueResponse` and passive state transitions in src/components/exercise/dialogueState.ts
- [x] T007 [P] [US1] Update `getProgressLabel` and `getNextProgressState` for Dialogue in src/domains/journey/learning/courseExercisePrimaryTransition.ts
- [x] T008 [US1] Replace existing file with new beat-indexed engine rendering passive beats in src/components/exercise/DialogueCategoryEngine.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 – Making a Decision Within a Dialogue (Priority: P2)

**Goal**: Learner reaches a decision beat, choices are shown, footer is hidden (but Skip remains). Selecting a choice hides unchosen options, shows inline feedback, and unhides the footer.

**Independent Test**: Load the fixture, reach a decision beat. Confirm "Next message" is hidden but "Skip for now" is visible. Tap an option. Confirm other options vanish, feedback shows, and "Next message" reappears.

### Implementation for User Story 2

- [x] T009 [P] [US2] Add decision selection mutation to src/components/exercise/dialogueState.ts
- [x] T010 [US2] Implement decision beat UI, feedback rendering, and footer visibility rules in src/components/exercise/DialogueCategoryEngine.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 – Earlier History Compression (Priority: P3)

**Goal**: When the learner is on beat 3 or later, beats older than the immediately preceding one collapse into a single labelled "Earlier" summary row. Add VoiceOver live-region announcements for all beat transitions.

**Independent Test**: Advance to beat 4. Confirm beats 1 and 2 are replaced by an "Earlier" row joining their summaries. Enable VoiceOver and confirm it reads each new beat.

### Implementation for User Story 3

- [x] T011 [US3] Implement `visibleBeats` logic and Earlier summary row in src/components/exercise/DialogueCategoryEngine.tsx
- [x] T012 [US3] Add VoiceOver live-region announcements for beat transitions in src/components/exercise/DialogueCategoryEngine.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Update engine to return `null` if content validation fails in src/components/exercise/DialogueCategoryEngine.tsx
- [x] T014 Ensure out-of-bounds `beatIndex` recovery in `createDialogueResponse` in src/components/exercise/dialogueState.ts
- [x] T015 Run quickstart.md validation manually to ensure all scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential priority order (US1 → US2 → US3) works best as they build on the same engine file
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P2)**: Builds upon US1's engine.
- **User Story 3 (P3)**: Builds upon US2's engine UI.

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel.
- Foundational tasks T003 and T004 can run in parallel.
- State helpers (T006, T007) can run in parallel with each other before touching the engine (T008).

---

## Parallel Example: User Story 1

```bash
# Launch foundational state models for US1 together:
Task: "Create createDialogueResponse and passive state transitions in src/components/exercise/dialogueState.ts"
Task: "Update getProgressLabel and getNextProgressState for Dialogue in src/domains/journey/learning/courseExercisePrimaryTransition.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via dev fixture.
5. Deploy/demo if ready (supports entirely passive dialogues).

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
