# Feature Specification: Microlearning Final Tasks

**Feature Branch**: `[003-microlearning-final-tasks]`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "task 12, 13, 14, 15   /Users/samuelprasad/Desktop/happy/journals/docs/superpowers/plans/2026-08-12-journey-microlearning-exercises.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recall Warmup Exercise (Priority: P1)

Users interact with a clean, distraction-free flashcard-style warmup exercise that tests their recall of previously learned concepts. They view a question, attempt to recall the answer, tap to reveal the correct answer, and then self-grade their recall to advance.

**Why this priority**: It is the final microlearning exercise category that needs to be brought into compliance with the strict new architecture and calm design language.

**Independent Test**: Load the Recall Warmup fixture in the test screen. Verify that exactly one card is shown at a time. Verify the answer is initially hidden from both visual rendering and the accessibility tree. Tap to reveal, then tap a self-grading option ("Remembered" or "Practice again") to advance to the next card.

**Acceptance Scenarios**:

1. **Given** the user starts a Recall Warmup exercise, **When** the first card renders, **Then** only the question is visible and accessible to VoiceOver.
2. **Given** the question is visible, **When** the user taps to reveal, **Then** the answer appears and the self-grading controls ("Remembered" / "Practice again") become active.
3. **Given** the user selects a self-grading option, **When** the tap occurs, **Then** the choice is recorded and the next card immediately replaces the current one in place.

---

### User Story 2 - Private Microlearning Telemetry (Priority: P1)

The system silently tracks user progress through microlearning exercises using strictly anonymized, structured events to enable aggregate analytics without compromising therapeutic privacy. 

**Why this priority**: Telemetry is required for product iteration, but strict privacy guarantees must be mathematically enforced in the payload schema before release.

**Independent Test**: Complete any microlearning exercise while observing the network/console logs. Verify that lifecycle events (start, stage view, scored choice, etc.) are emitted, but ensure no user-entered text, feedback strings, or therapeutic copy is present in the payload.

**Acceptance Scenarios**:

1. **Given** a user interacts with an exercise stage, **When** they submit a choice, **Then** an "opaque scored choice" event is emitted containing only the concept ID, correctness boolean, attempt count, and elapsed time.
2. **Given** a user resumes an interrupted exercise, **When** the saved state hydrates, **Then** no duplicate "start" or "stage view" events are emitted for previously completed stages.

---

### User Story 3 - Authoring Audit and Regression Verification (Priority: P2)

Engineers and content authors must be prevented from shipping malformed microlearning content or inaccessible UI.

**Why this priority**: Guarantees that the entire redesign effort is robust, backward-compatibility code is purged, and the app meets its iOS 26+ accessibility bar.

**Independent Test**: Run the standalone content validator against the content authoring source files files to verify zero errors.

**Acceptance Scenarios**:

1. **Given** the codebase is preparing for release, **When** the standalone validator runs, **Then** all 11 microlearning categories pass validation for stable IDs, counts, and budgets without any legacy fallback logic.

### Edge Cases

- What happens if a user navigates away immediately after a telemetry event fires but before the batch is sent?
- How does the system handle an authoring audit failure on a single exercise out of thousands?
- What happens if the user suspends the app while the Recall answer is revealed but before self-grading?


## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement the `Recall Warmup` exercise engine rendering exactly 2-3 stable cards per exercise.
- **FR-002**: System MUST render exactly one Recall Warmup card at a time, displaying the question while keeping the answer completely removed from the screen reader interface until explicitly revealed.
- **FR-003**: System MUST require the user to self-grade their recall using exactly two options ("Remembered", "Practice again") after the answer is revealed, which then advances the state in place.
- **FR-004**: System MUST store a review signal mapped to the card's `conceptId` upon self-grading.
- **FR-005**: System MUST emit strongly-typed private microlearning events: `start`, `stage view`, `opaque scored choice`, `feedback`, `hint`, `stage complete`, `exercise complete`, and `skip`.
- **FR-006**: System MUST strictly limit telemetry payloads to primitive data (category strings, exercise/concept IDs, stage indices, correctness booleans, attempt counts, elapsed times, and accessibility flag states).
- **FR-007**: System MUST NEVER transmit generic payload text, therapeutic copy, user-typed journals, or option labels in any telemetry event.
- **FR-008**: System MUST NOT replay or duplicate lifecycle telemetry events when a user resumes a saved exercise (hydration).
- **FR-009**: System MUST trigger intentional haptic feedback (selection/success) only on meaningful state changes, adhering to the calm design constitution.
- **FR-010**: System MUST pass a strict content audit verifying that all content files seed data for all 11 categories uses only the new, strictly-typed schemas, with all legacy shapes, compatibility code, and migration paths removed.
- **FR-011**: System MUST support VoiceOver, Dynamic Type, and Reduce Motion across all 11 microlearning engines on iOS.

### Key Entities *(include if feature involves data)*

- **RecallWarmupContent**: Contains 2-3 `RecallCard` objects, each with a stable `id`, `conceptId`, `question`, and `answer`.
- **RecallWarmupResponse**: Tracks the user's progress through the cards and stores their self-graded review signals keyed by `conceptId`.
- **MicrolearningTelemetryEvent**: A strictly typed event structure guaranteed to only hold primitive IDs and metrics, stripping all human-readable copy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Standalone content validator reports 0 errors across 100% of content authoring source files for all 11 microlearning categories.
- **SC-002**: 100% of telemetry events emitted during a full microlearning pass contain 0 bytes of therapeutic or user-typed text.
- **SC-003**: Recall Warmup exercise successfully runs from start to finish via the independent dev fixture without rendering multiple cards simultaneously.
- **SC-004**: iOS Accessibility Inspector reports 0 critical violations for VoiceOver and Dynamic Type across the Recall Warmup fixture.

## Assumptions

- **Platform**: The implementation targets iOS 26+ exclusively. No Android or legacy iOS fallbacks are required.
- **UI Design**: The Recall Warmup will use the existing `DESIGN.md` sage/white/ink color palette and Geist/Cormorant typography, consistent with previous microlearning engines.
- **Telemetry System**: An underlying analytics provider or centralized logging bus already exists to receive the structured `MicrolearningTelemetryEvent` payloads.
