# Feature Specification: Staged Interaction for "Try Harder to Sleep"

**Feature Branch**: `008-try-harder-staged-interaction`

**Created**: 2026-08-31

**Status**: Draft

**Input**: User description: Refactor "Try harder to sleep" into a staged interaction

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial Observation (Ready State) (Priority: P1)

As a learner, I want to see a clear hypothesis and visual starting point before taking action, so I can predict what will happen without cognitive overload.

**Why this priority**: Sets the foundational state of the exercise and reduces cognitive load by hiding future consequences and explanations.

**Independent Test**: Can be tested by rendering the exercise and verifying that only the "ready" state content is visible, including the "Try harder" CTA, while all other content is hidden.

**Acceptance Scenarios**:

1. **Given** the learner lands on the "Try harder to sleep" exercise, **When** the screen renders, **Then** only the expectation ("More effort → sleep faster"), alertness gauge (near calm), and "Try harder" button are visible.
2. **Given** the learner is in the ready state, **When** they look at the CTA area, **Then** no disabled "Continue" button is shown.

---

### User Story 2 - Experiencing the Consequence (Result State) (Priority: P1)

As a learner, I want to interact with the exercise and immediately see the consequence of my action (alertness increasing) before reading a complex explanation.

**Why this priority**: Essential to the pedagogical goal. The learner must experience the counter-intuitive result before reading the theory.

**Independent Test**: Can be tested by tapping "Try harder" and verifying the marker moves and the CTA changes to "See why", without revealing the full explanation.

**Acceptance Scenarios**:

1. **Given** the learner is in the ready state, **When** they tap "Try harder", **Then** the alertness gauge marker animates toward "wired" and the CTA changes to "See why".
2. **Given** the learner just tapped "Try harder", **When** the result is shown, **Then** the text updates to "What happened: More effort → more alertness", and the detailed explanation remains hidden.
3. **Given** the learner has reduced motion enabled, **When** they tap "Try harder", **Then** the alertness gauge immediately updates to "wired" without animation.

---

### User Story 3 - Understanding the Theory (Explanation State) (Priority: P2)

As a learner, I want to read the explanation only after I have experienced the result, so I can connect the theory to my direct observation.

**Why this priority**: Completes the learning loop.

**Independent Test**: Can be tested by tapping "See why" and verifying the explanation is revealed and the CTA becomes "Continue".

**Acceptance Scenarios**:

1. **Given** the learner is in the result state, **When** they tap "See why", **Then** the explanation ("Why this happens") is revealed and the CTA changes to "Continue".
2. **Given** the learner is reading the explanation, **When** they look at the screen, **Then** there is only one primary CTA ("Continue").

### Edge Cases

- What happens if the user leaves the app during the "Result" state and returns?
- How does the system handle rapid sequential taps on the "Try harder" or "See why" buttons?
- What happens if reduced motion is enabled? (Must skip animation and snap to state).
- How is the state reset if the user navigates away and comes back? (Does it preserve state or reset to "ready"?)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The exercise MUST maintain an explicit internal state machine consisting of "ready", "result", and "explanation" stages.
- **FR-002**: The system MUST render only the "ready" stage content (Expectation, Alertness initial state, "Try harder" CTA) when in the "ready" state.
- **FR-003**: Tapping "Try harder" MUST transition the state to "result", animate the alertness gauge toward "wired", and change the primary CTA to "See why".
- **FR-004**: Tapping "See why" MUST transition the state to "explanation", reveal the final takeaway, and change the primary CTA to "Continue".
- **FR-005**: The system MUST ensure only one primary Call-To-Action (CTA) is visible at any given time.
- **FR-006**: The system MUST NOT show disabled placeholder CTAs (e.g., a greyed-out "Continue" button) during the "ready" or "result" states.
- **FR-007**: The alertness gauge MUST be visually distinct from the global course progress bar.
- **FR-008**: The system MUST announce state changes to screen readers (e.g., "Body alertness increased toward wired").
- **FR-009**: The transition animation MUST be suppressed and replaced with instantaneous state changes if the user's OS has reduced motion enabled.

### Key Entities

- **Exercise State**: Explicitly tracks the current stage of the interaction ("ready", "result", "explanation").
- **Alertness Gauge**: Visual representation of the learner's "Body alertness", moving from "calm" to "wired".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The exercise screen presents a maximum of one primary CTA at any given time.
- **SC-002**: All large side-by-side comparison cards present in the previous iteration are completely removed from the DOM.
- **SC-003**: The user completes the exercise by sequentially clicking "Try harder", "See why", and "Continue".
- **SC-004**: Screen readers correctly announce the state change when the user taps "Try harder".

## Assumptions

- Assumes the existing configuration-driven exercise system can handle progressive state disclosure without resorting to hardcoded exercise-name checks.
- Assumes the user will not need to rewind from "explanation" back to "ready" unless the exercise is completely reset via course navigation.
- Assumes the existing design tokens (semantic colors, typography) are sufficient and no new one-off styles need to be created.
