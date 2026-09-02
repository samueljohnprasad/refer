# Feature Specification: Interactive Reframe Correct/Wrong States

**Feature Branch**: `[###-feature-name]`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Replacing Choice with Meaningful Consequence (Priority: P1)

As a learner interacting with the Interactive Reframe exercise, I want the correct/wrong states to provide meaningful, interactive consequences instead of generic feedback, so that I actually learn the underlying mental model rather than just clicking the most "polite" sounding answer.

**Why this priority**: The current checkpoint question allows learners to pass by picking the "compassionate" option without understanding the CBT sleep model. Fixing this is critical to the educational value of the exercise.

**Independent Test**: Can be fully tested by selecting the "wrong" answer and verifying that the consequence chain ("TRY HARDER -> more checking -> more pressure") appears and guides the user to try the other reading, without a punishing visual state or dead ends.

**Acceptance Scenarios**:

1. **Given** the initial state of the Interactive Reframe exercise, **When** the user taps "Should I try harder tonight?", **Then** the UI reveals the downward spiral consequence ("TRY HARDER -> more checking -> more pressure") directly inside the hero box.
2. **Given** the wrong consequence is fully revealed, **When** the cascade finishes, **Then** a "TRY ANOTHER READING" button appears.
3. **Given** the initial state of the Interactive Reframe exercise, **When** the user taps "What might have shifted?", **Then** the UI reveals the correct consequence chain ("WHAT CHANGED? -> timing / pressure / arousal -> something to investigate") directly inside the hero box.
4. **Given** the correct consequence is fully revealed, **When** the cascade finishes, **Then** the sentence crossfades to "Something may have shifted", the "Remember" takeaway appears, and the Continue footer is enabled.

---

### User Story 2 - Removing Punitive Error States (Priority: P2)

As a learner making a mistake, I want my wrong choice to feel like an exploration of a misconception rather than a failure, so that I don't feel blamed or discouraged.

**Why this priority**: Minimizing hostile error states is essential for maintaining the calm, trustworthy therapeutic brand (Constitution Principle VI).

**Independent Test**: Can be tested by selecting the wrong answer and verifying that red styling is restricted only to the selected wrong answer itself ("× YOUR ANSWER"), while the explanatory/reveal area remains neutral.

**Acceptance Scenarios**:

1. **Given** the user selects the wrong answer, **When** the feedback state renders, **Then** the error styling (red border/background) is applied ONLY to the selected answer button, not to the entire feedback card or explanation area.
2. **Given** the user selects the wrong answer, **When** the consequence cascade is revealed, **Then** the text "NOT QUITE" does not appear.
3. **Given** the user selects the wrong answer, **When** the consequence is fully revealed, **Then** the UI offers a clear next action ("TRY ANOTHER READING") instead of leaving the user in a dead state with a disabled "Try Again" button.

### Edge Cases

- What happens if the user taps an option rapidly multiple times? (Should debounce or disable interaction during the cascade animation).
- What happens if the user suspends the app in the middle of a cascade animation and restores it? (Should restore to the fully-revealed state of that phase per Constitution Principle III).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Interactive Reframe exercise MUST prompt the user with two options: "What might have shifted in my sleep system" (correct) and "Whether I need to try harder tonight" (incorrect).
- **FR-002**: When the incorrect option is selected, the system MUST reveal a consequence cascade ("TRY HARDER -> more checking -> more pressure") inside the evolving hero box.
- **FR-003**: The system MUST NOT use the string "NOT QUITE" or apply global red error styling to the explanation area when an incorrect answer is selected. Red styling MUST be isolated to the selected incorrect option.
- **FR-004**: When the incorrect consequence cascade finishes, the system MUST display a "TRY ANOTHER READING" button.
- **FR-005**: When the correct option is selected, the system MUST reveal a consequence cascade ("WHAT CHANGED? -> timing / pressure / arousal -> something to investigate") inside the evolving hero box.
- **FR-006**: When the correct consequence cascade finishes, the system MUST crossfade the hero sentence from "My body is broken." to "Something may have shifted."
- **FR-007**: When the correct consequence cascade finishes, the system MUST display the "Remember" takeaway message.
- **FR-008**: The system MUST keep the global Continue footer completely hidden until the correct consequence cascade and takeaway have fully revealed (Constitution Principle IV).
- **FR-009**: The system MUST allow the user to transition from the wrong state back to the initial state (or directly to the correct state) via the "TRY ANOTHER READING" button.

### Key Entities

- **InteractiveReframeState**: Represents the state of the exercise (`initial`, `incorrect_revealing`, `incorrect_revealed`, `correct_revealing`, `correct_revealed`, `completed`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of wrong answers result in an explorable consequence chain rather than a generic "Not quite" feedback card.
- **SC-002**: The Continue button is 100% hidden (not just disabled) until the learning loop is successfully completed.
- **SC-003**: Error styling (red color) is strictly limited to the boundary of the selected incorrect option, reducing the visual footprint of a "mistake" by >80%.

## Assumptions

- Users have already been introduced to the basic concepts of sleep pressure, timing, and arousal earlier in the course.
- The existing interactive reframe UI will be extended to support these new branching states (correct vs wrong).
- Smooth layout transitions and fade-in animations currently used in the engine will be applied to the new consequence cascades.
