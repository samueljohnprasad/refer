# Implementation Tasks: Microlearning Final Tasks

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No shared setup tasks required for this feature, as it extends an existing microlearning foundation.)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No blocking foundational tasks required. The three user stories are completely independent and can be implemented in any order.)*

---

## Phase 3: User Story 1 - Recall Warmup Exercise (Priority: P1) 🎯 MVP

**Goal**: Implement the distracting-free flashcard-style warmup exercise that tests recall.

**Independent Test**: Load the Recall Warmup fixture in the test screen and manually verify UI interactions, state advances, and accessibility constraints (answer string completely absent before reveal).

### Implementation for User Story 1

- [x] T001 [P] [US1] Define `RecallCard`, `RecallWarmupContent`, and `RecallWarmupResponse` types in `src/domains/journey/learning/v1LearningEngineTypes.ts`.
- [x] T002 [US1] Implement the `recallWarmupState.ts` reducer logic for tracking the current card index and phase in `src/components/exercise/microlearning/recallWarmupState.ts`.
- [x] T003 [US1] Implement the `RecallWarmupCategoryEngine.tsx` component in `src/components/exercise/microlearning/RecallWarmupCategoryEngine.tsx` using calm design (Sage/white/ink, Geist/Cormorant).
- [x] T004 [US1] Register `RecallWarmupCategoryEngine` and `recall_warmup` type strings in the central microlearning registry / validators.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently via developer fixtures.

---

## Phase 4: User Story 2 - Private Microlearning Telemetry (Priority: P1)

**Goal**: Establish a strictly bounded telemetry pipeline that enforces private data hygiene (stripping therapeutic text) while logging microlearning lifecycle events.

**Independent Test**: Complete a microlearning exercise with Metro logs open and verify that the `[microlearning:analytics]` logger outputs structurally private payloads (IDs and enums only).

### Implementation for User Story 2

- [x] T005 [P] [US2] Define `MicrolearningTelemetryEvent` and `MicrolearningEventName` types in `src/components/exercise/microlearning/microlearningAnalytics.ts`.
- [x] T006 [US2] Implement the `trackMicrolearningEvent` dispatcher wrapping the `logger.info("microlearning:analytics")` bus in `src/components/exercise/microlearning/microlearningAnalytics.ts`.
- [x] T007 [US2] Integrate `trackMicrolearningEvent` across the microlearning engine root wrapper, ensuring `useRef` guards prevent `stage_view` duplication during hydration.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Authoring Audit and Regression Verification (Priority: P2)

**Goal**: Prevent engineers and authors from shipping legacy content shapes by enforcing a strict schema validation across all 11 categories via a standalone audit script.

**Independent Test**: Run `npx ts-node scripts/auditMicrolearningContent.ts` and verify it reports 0 errors across all parsed seed data.

### Implementation for User Story 3

- [x] T008 [P] [US3] Create `scripts/auditMicrolearningContent.ts` to parse all seed data and pass each object to `validateLearningItem`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Run quickstart.md validation steps for the Audit, Telemetry, and Recall Warmup end-to-end.
- [x] T010 [P] Resolve any deferred review minors and ensure iOS 26+ specific tests (Dynamic Type, VoiceOver) were documented.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A
- **Foundational (Phase 2)**: N/A
- **User Stories (Phase 3+)**: US1, US2, and US3 are totally independent and can be started immediately and concurrently.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.
- **User Story 2 (P1)**: Independent.
- **User Story 3 (P2)**: Independent.

### Within Each User Story

- Models before services (e.g., Types before Reducer state).
- Services before UI components (Reducer state before UI engine).
- Core implementation before integration (Telemetry definition before wiring).
- Story complete before moving to next priority.

### Parallel Opportunities

- T001, T005, and T008 can all be started immediately in parallel, as they belong to different user stories and do not conflict.

---

## Parallel Example: User Story 1 & 2 & 3

```bash
# Launch type definitions for US1:
Task: "Define RecallCard... types in v1LearningEngineTypes.ts"

# Launch analytics module for US2:
Task: "Define MicrolearningTelemetryEvent... in microlearningAnalytics.ts"

# Launch audit script for US3:
Task: "Create scripts/auditMicrolearningContent.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (Recall Warmup UI).
2. **STOP and VALIDATE**: Test User Story 1 independently in the fixture screen.

### Incremental Delivery

1. Add User Story 1 → Test independently
2. Add User Story 2 → Check telemetry logs
3. Add User Story 3 → Run global audit script
4. Each story adds value without breaking previous stories.


## Phase 6: Convergence

- [x] T011 Dispatch `exercise_start`, `exercise_complete`, `feedback_shown`, and `hint_shown` microlearning events in `NodeEngineRouter.tsx` per FR-005 (partial)
- [x] T012 Explicitly disable custom entering/exiting animations in `RecallWarmupCategoryEngine.tsx` when `useReducedMotion()` is true per FR-011 (partial)
