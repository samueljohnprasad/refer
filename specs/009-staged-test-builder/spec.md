# Feature Specification: Staged Test Builder

**Feature Branch**: `009-staged-test-builder`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: UI/UX AUDIT — “SET UP THE NEXT SMALL TEST”

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choosing the Trigger (State 1) (Priority: P1)

As a learner, I want to see a single decision to make first (choosing an observation/trigger), so I am not overwhelmed by having to choose both the trigger and action simultaneously.

**Why this priority**: It establishes the new staged flow, ensuring one decision per screen state, reducing cognitive load.

**Independent Test**: Can be tested by rendering the exercise and verifying that only the "IF" choices are visible and the "Save to My Plans" CTA is completely absent.

**Acceptance Scenarios**:

1. **Given** the learner lands on the builder exercise, **When** the screen renders, **Then** the title is "Set up the next small test", the subtitle is "Choose something you've noticed.", and only the IF options are displayed.
2. **Given** the learner is in State 1, **When** they look at the footer, **Then** the "Save to My Plans" button is not visible.

---

### User Story 2 - Choosing the Action (State 2) (Priority: P1)

As a learner, I want the available actions to be contextually relevant to my chosen observation, so I can form a logical micro-experiment without creating a nonsensical plan.

**Why this priority**: This fulfills the pedagogical goal of the exercise by guiding the user to create a valid hypothesis and test.

**Independent Test**: Can be tested by selecting an IF option and verifying the UI transitions in place to show the selected IF and the corresponding relevant THEN choices.

**Acceptance Scenarios**:

1. **Given** the learner is in State 1, **When** they select an IF option, **Then** the UI transitions in place to State 2, keeping the selected IF visible (in a selected state) and revealing the relevant THEN options.
2. **Given** the learner is in State 2, **When** the screen renders, **Then** the subtitle updates to "Choose how you'll test it." and the "Save to My Plans" button is still hidden.

---

### User Story 3 - Reviewing and Saving the Plan (State 3) (Priority: P1)

As a learner, I want to see a clean preview of my assembled plan and a clear Save action after making my choices, so I feel a sense of completion and understand the consequence of saving.

**Why this priority**: It completes the builder loop, offering a reward (the assembled plan) and a clear CTA.

**Independent Test**: Can be tested by selecting a THEN option and verifying the UI transitions to the summary state with the assembled plan preview and the primary CTA.

**Acceptance Scenarios**:

1. **Given** the learner is in State 2, **When** they select a THEN option, **Then** the UI transitions to State 3, showing the assembled plan preview inside a container titled "Your small test".
2. **Given** the learner is in State 3 before saving, **When** the screen renders, **Then** privacy copy "Private to you. No reminders unless you ask." is visible near the "Save to My Plans" primary CTA.
3. **Given** the learner taps "Save to My Plans", **When** the save completes, **Then** the UI shows a confirmation ("✓ Added to My Plans") and the CTA changes to "Continue".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a generic staged builder architecture consisting of discrete stages (e.g., trigger selection -> action selection -> review summary).
- **FR-002**: The system MUST render exactly one active decision stage at a time (e.g., only IF options in State 1, only THEN options in State 2).
- **FR-003**: The system MUST restrict the available THEN options in State 2 based on the specific IF option selected in State 1 (guided choices).
- **FR-004**: The system MUST NOT display the "Save to My Plans" primary action or the plan preview during State 1 or State 2.
- **FR-005**: The system MUST display the plan preview and the "Save to My Plans" primary action only upon entering State 3.
- **FR-006**: The system MUST apply the brand "selected" visual state (sage surface and border) to selected options, and MUST NOT use "success green" since choices are subjective.
- **FR-007**: The system MUST ensure the last selectable option card is fully visible above the sticky footer by applying appropriate bottom inset padding.
- **FR-008**: The system MUST display privacy reassurance copy ("Private to you. No reminders unless you ask.") only in State 3 before the user saves the plan.
- **FR-009**: The typography for the sections MUST use "IF" and "THEN I WILL" without leading ellipses.

### Edge Cases

- What happens if the user leaves the app during State 2 and returns? (Should it preserve State 2 or reset to State 1?)
- How does the system handle rapid sequential taps on the selection cards?
- What happens if the user wants to change their IF selection while in State 2 or State 3? (Is there a back button or tap-to-edit?)

### Key Entities

- **Builder Configuration**: The structural definition defining the stages (trigger, action, review) and their dependencies.
- **Builder Content**: The domain-specific options, mapped relationships (which actions correspond to which triggers), and template strings for the preview.
- **Builder State**: The user's current progress through the stages, tracking the selected trigger ID and action ID.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The interaction is completely divided into three distinct states, with no more than one active selection group presented at any given time.
- **SC-002**: The "Save to My Plans" button is rendered exactly 0 times during the selection states (State 1 and State 2).
- **SC-003**: Selection of a trigger option filters the subsequent action options to only those logically mapped to the trigger (2-3 options, not all options).
- **SC-004**: The fully assembled preview is strictly deferred until the review state (State 3).

## Assumptions

- Assumes the existing UI components (cards, typography, colors) can be reused without redesigning the visual language, as requested.
- Assumes the underlying engine can be generalized to support the "trigger -> action -> review" flow through configuration rather than hardcoding.
- Assumes the content schema can be updated to support mapping specific action options to specific trigger options.
