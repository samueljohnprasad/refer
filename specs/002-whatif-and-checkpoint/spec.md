# Feature Specification: whatif-and-checkpoint

**Feature Branch**: `[002-whatif-and-checkpoint]`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "task 10 and 11 /Users/samuelprasad/Desktop/happy/journals/docs/superpowers/plans/2026-08-12-journey-microlearning-exercises.md"

## Clarifications

### Session 2026-08-24

- Q: For the Course Checkpoint ordering adapter, how should a user's incorrect sequence be handled during their retry? → A: Highlight which specific items are in the wrong position
- Q: How should the Course Checkpoint determine if a concept is marked as "Solid" versus "Review soon"? → A: Strict: 100% of items for a concept must be answered correctly on the first try to be "Solid"
- Q: How should the "recall" adapter in the Course Checkpoint capture the user's answer? → A: Self-graded flashcard (User reveals answer, then taps "Got it" or "Need practice")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - What-If Machine: User-Paced Consequence Flow (Priority: P1)

A learner opens a What-If Machine exercise. They select from a limited set of initial predictions. Instead of waiting for automatic reveal timers, they control the flow by tapping "Run it" or "Next consequence" to step through 2–4 structured causal consequences one at a time. Finally, they see a neutral comparison of their prediction against the final outcome.

**Why this priority**: Eliminates stressful or buggy time-based educational reveals in favor of user-paced progression, satisfying Constitution Principle II (One Active Decision).

**Independent Test**: Load the What-If fixture. Make a prediction, tap "Run it", then advance manually through each consequence until the final comparison appears. Wait 30 seconds at any point to verify no automatic advancement occurs.

**Acceptance Scenarios**:

1. **Given** the What-If machine is on the prediction stage, **When** the user selects a prediction, **Then** the "Run it" button becomes active.
2. **Given** the simulation has started, **When** the user taps "Next consequence", **Then** the next causal step is revealed, collapsing previous steps compactly.
3. **Given** the simulation is running, **When** no action is taken, **Then** the screen remains completely idle (no automatic reveals).

---

### User Story 2 - Course Checkpoint: Strict Item Adapters (Priority: P1)

A learner encounters a Course Checkpoint containing 3 to 5 items. The checkpoint opens in "intro" mode, transitions to "item" mode presenting exactly one item at a time (using specific adapters for single choice, ordering, matching, or recall), and concludes in "summary" mode.

**Why this priority**: Enforces type safety (removing `any[]`) and structures the assessment strictly one-item-at-a-time, complying with the Constitution.

**Independent Test**: Load the Checkpoint fixture. Complete a single-choice item, an ordering item, a matching item, and a recall item sequentially, confirming only one appears at a time.

**Acceptance Scenarios**:

1. **Given** an active checkpoint item, **When** the user provides an incorrect answer, **Then** they receive one retry attempt before worked support is provided.
2. **Given** the user completes all items, **When** the summary mode appears, **Then** their performance is aggregated by concept ID into "Solid" and "Review soon" categories.

---

### Edge Cases

- What happens when the user suspends the app halfway through a sequence of consequences in the What-If Machine? The state must restore exactly to the current consequence without auto-advancing.
- How does the system handle malformed checkpoint content lacking required adapter data? Content validation must reject it at the `NodeExerciseDataError` boundary.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The What-If Machine MUST support 2 to 3 initial predictions and 2 to 4 structured causal steps.
- **FR-002**: The What-If Machine MUST NOT use any timers or automatic reveals for causal steps; advancement MUST require a user tap ("Run it" or "Next consequence").
- **FR-003**: The What-If Machine MUST display a neutral final comparison comparing the user's chosen prediction against the actual outcome.
- **FR-004**: Course Checkpoint MUST use a strict discriminated union of 3 to 5 items, completely removing `any[]` structures.
- **FR-005**: Course Checkpoint MUST have three distinct modes: intro, item, and summary.
- **FR-006**: Course Checkpoint MUST present exactly one item at a time, using focused adapters for single choice, ordering, matching, and recall (implemented as a self-graded flashcard where the user reveals the answer and taps "Got it" or "Need practice").
- **FR-007**: Course Checkpoint MUST allow exactly one retry on an incorrect answer before providing worked support. For the ordering adapter, the retry state MUST highlight which specific items are in the wrong position to scaffold the user.
- **FR-008**: Course Checkpoint summary MUST aggregate outcomes by concept ID into "Solid" (100% of items for that concept answered correctly on the first try) and "Review soon" (any item required a retry) buckets.
- **FR-009**: The UI MUST adhere to the premium, calm design requirements (Sage/white/ink palette, Geist/Cormorant fonts) and accessibility guidelines.
- **FR-010**: All private state (e.g. predictions chosen, correctness) MUST store only stable IDs and primitive flags, never therapeutic text.
- **FR-011**: Course Checkpoint matching adapter MUST use a tap-to-pair mechanic (select an item in list A, then select its match in list B) to ensure high accessibility and stable cross-platform behavior.

### Key Entities

- **WhatIfContent**: Contains `predictions` (2-3 items) and `consequences` (2-4 items), plus `finalComparison`.
- **CheckpointContent**: Contains `intro`, a union array of `CheckpointItem` (3-5 items), and `summary`.
- **CheckpointItem**: Discriminated union of `type: "single_choice" | "ordering" | "matching" | "recall"`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of time-based reveals are removed from the What-If Machine.
- **SC-002**: 100% of `any[]` typing is removed from the Course Checkpoint data structures.
- **SC-003**: A user can pause and resume a What-If Machine or Course Checkpoint exactly where they left off 100% of the time, with no state corruption.
- **SC-004**: Users complete the checkpoint with 0 layout shift issues, as only one item renders at a time.

## Assumptions

- Ordering adapter implies presenting a list of items that the user can move up or down (e.g., via up/down arrows or drag-and-drop handles if native gesture is simple).
- "Worked support" means showing the correct answer with an explanation after the second failed attempt, allowing the user to proceed without being blocked permanently.
- The neutral final comparison in What-If just visually places the initial prediction text next to the final consequence text without passing judgment.
