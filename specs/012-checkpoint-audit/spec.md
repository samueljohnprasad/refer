# Feature Specification: Sleep Science Checkpoint UI/UX & Learning Flow Audit

**Feature Branch**: `012-checkpoint-audit`

**Created**: 2026-09-02

**Status**: Ready for Planning

**Input**: User audit specification: "checkpoint-audit-plan.md" (incorporating 27 learning flow, cognitive load, interaction, and design consistency requirements)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick, Low-Anxiety Checkpoint Intro (Priority: P1)

As a learner finishing a learning unit, I want a concise, warm checkpoint intro that sets expectations without feeling like a stressful school exam, so that I can transition smoothly into testing my retrieval.

**Why this priority**: Repetitive test warnings and heavy disclaimers cause unnecessary cognitive friction. A lightweight, warm intro promotes psychological safety and momentum.

**Independent Test**: Can be tested by navigating to the checkpoint intro screen and verifying that copy is brief, reassuring, and cleanly centered with one prominent "Start review" action.

**Acceptance Scenarios**:
1. **Given** the learner enters a Checkpoint exercise, **When** the intro screen loads, **Then** the title displays "Sleep science checkpoint", the headline says "Let’s see what stuck.", and the subtitle clearly states "4 quick questions about the sleep system. A miss just gives you something to revisit." without redundant duplicate disclaimers.
2. **Given** the checkpoint intro screen, **When** viewed, **Then** a compact metadata tag indicates "4 QUESTIONS · ~1 MIN" and only one primary action ("START REVIEW") is shown.

---

### User Story 2 - Testing Mental Models with Plausible Distractors (Priority: P1)

As a learner reviewing concepts, I want questions that test my actual understanding of the physiological mechanism rather than linguistic recognition or common sense, so that I get real retrieval practice.

**Why this priority**: If distractors sound obviously absurd or unscientific, the learner does not engage their mental model of sleep pressure, timing, or arousal.

**Independent Test**: Can be verified across all checkpoint questions by confirming each distractor represents a believable real-world misconception (e.g., "My body probably needs a later bedtime now" vs "The nap reduced some of the sleep pressure built up during the day").

**Acceptance Scenarios**:
1. **Given** a checkpoint question on sleep pressure, **When** presented, **Then** the question options provide believable interpretations that require differentiating between sleep pressure and schedule shifts.
2. **Given** any question screen, **When** the options are presented, **Then** no disabled placeholder CTA button is displayed at the bottom; tapping an option acts as the primary commitment.

---

### User Story 3 - Rapid Correct-Answer Reinforcement (Priority: P1)

As a learner who correctly retrieves the mental model, I want fast, concise confirmation and immediate causal reinforcement without heavy success modals, so that review momentum is maintained.

**Why this priority**: Fast loops for correct answers keep retrieval practice engaging and respect the learner's time.

**Independent Test**: Select a correct answer and verify the transition is swift: the selected option becomes green, a clean causal chain appears in a soft neutral card, and the CTA immediately displays "NEXT QUESTION".

**Acceptance Scenarios**:
1. **Given** a question, **When** the user taps the correct option, **Then** the option displays a subtle green confirmation indicator.
2. **Given** a correct selection, **When** feedback displays, **Then** the causal mechanism chain (e.g., `Late nap ↓ some sleep pressure released ↓ less sleepy at bedtime`) is rendered inside a soft neutral/sage panel.
3. **Given** correct feedback is displayed, **When** the user taps "NEXT QUESTION", **Then** the screen advances to the next question immediately.

---

### User Story 4 - Constructive Causal Repair on Mistakes (Priority: P1)

As a learner who selects an incorrect interpretation, I want the feedback to explain the causal mechanism in a neutral learning container rather than a punishing red/pink error card, and immediately let me move forward without fake repetition.

**Why this priority**: Punitive red containers and fake "Try Again" loops increase frustration and break trust. Explaining the mechanism in a calm container allows genuine learning.

**Independent Test**: Select a wrong answer and verify:
1. Red styling is strictly isolated to the chosen option badge (`× YOUR ANSWER`).
2. The explanation card is neutral/cream or soft green with the header "WHAT HAPPENED?".
3. The causal breakdown is shown.
4. The primary action is directly "NEXT QUESTION" (no disabled "Try again" button).

**Acceptance Scenarios**:
1. **Given** an incorrect option is tapped, **When** the screen updates, **Then** only the selected incorrect item receives a red border and `× YOUR ANSWER` tag; the explanation card does NOT use a pink or red background.
2. **Given** incorrect feedback, **When** rendered, **Then** the explanation card uses a neutral cream surface with the header "WHAT HAPPENED?" and shows the step-by-step causal chain.
3. **Given** incorrect feedback, **When** the user looks at available actions, **Then** only one primary action ("NEXT QUESTION") is present, and no disabled "Try again" button is shown.

---

### User Story 5 - Dedicated Question Progress Tracking & Visual Polish (Priority: P2)

As a learner inside a multi-question checkpoint, I want the progress indicator to reflect question progress (`Question 1 of 4`) instead of global lesson index (`2 of 2`), and the UI to match the app's premium visual design.

**Why this priority**: Ambiguous progress indicators create confusion. Cohesive cards, generous spacing, and unified typography elevate the experience.

**Independent Test**: Verify that the top progress bar and trailing label update from `Question 1 of 4` (25%) through `Question 4 of 4` (100%), and that all cards adhere to the cream/sage color palette and rounded card language.

**Acceptance Scenarios**:
1. **Given** the learner is on Question 1, **When** viewing the header/progress area, **Then** the progress bar reflects 25% and the label displays "QUESTION 1 OF 4".
2. **Given** the question context/scenario, **When** rendered, **Then** it uses a soft cream container with an eyebrow tag ("SCENARIO") and clean typography.
3. **Given** the learner is inside the 4-question checkpoint, **When** navigating, **Then** no per-question "Skip for now" link is displayed (top `X` close remains available).

---

## Edge Cases

- **Fast Multi-Tapping**: When a user taps an answer option, interaction must immediately lock to prevent double-submitting while feedback appears.
- **Backgrounding / Session Restoration**: If the app is closed during question feedback or summary, reopening restores the exact question index and result set.
- **Final Question Completion**: On question 4, the primary action label becomes "SEE RESULTS" / "FINISH REVIEW", seamlessly navigating to the Checkpoint Summary screen.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Checkpoint Intro MUST display a concise title ("Sleep science checkpoint"), reassuring headline ("Let’s see what stuck."), body ("4 quick questions about the sleep system. A miss just gives you something to revisit."), tag ("4 QUESTIONS · ~1 MIN"), and a single "START REVIEW" primary CTA.
- **FR-002**: The Checkpoint engine MUST NOT show a disabled placeholder button (e.g. "Choose an answer") on the question screen prior to option selection.
- **FR-003**: Checkpoint question options MUST test physiological causal models with plausible distractors.
- **FR-004**: Selecting an option MUST commit the answer and transition immediately to feedback.
- **FR-005**: For correct selections, the system MUST show a subtle green indicator, a causal chain explanation in a soft neutral card, and a "NEXT QUESTION" CTA.
- **FR-006**: For incorrect selections, the system MUST isolate error styling (red border and `× YOUR ANSWER` tag) to the selected option only, render the causal explanation inside a neutral cream card with the header "WHAT HAPPENED?", and provide a "NEXT QUESTION" CTA.
- **FR-007**: The system MUST NOT display "NOT QUITE" as the hero title of feedback cards or show a disabled/active "Try again" button in the checkpoint flow.
- **FR-008**: Progress indicators during the checkpoint MUST display question-level progression (`Question N of Total`, with proportional progress bar).
- **FR-009**: The system MUST hide the per-question "Skip for now" link once the checkpoint review has started.
- **FR-010**: The Checkpoint Summary screen MUST group reviewed concepts into "FEELS SOLID" and "WORTH A TWO-MINUTE REVISIT" without punitive scoring language.

### Key Entities

- **CheckpointItem**: Represents an individual retrieval question containing `concept`, `context` (scenario), `prompt`, `clue`, `worked`, and `options` (`label`, `feedback`, `isCorrect`).
- **CheckpointResponseState**: Tracks `phase` (`intro` | `question` | `feedback` | `summary`), `itemIndex` (0 to N), `selectedOptionIndex`, `results` (boolean array of outcomes), and `isCorrect`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of feedback panels on incorrect answers use neutral learning surfaces with zero full-width pink/red error containers.
- **SC-002**: 100% of question states present exactly ONE active primary action (or option selection target) per screen state.
- **SC-003**: 0% of checkpoint questions display a "Try again" dead-end button after showing the answer.
- **SC-004**: Question-level progress tracking correctly displays 25%, 50%, 75%, 100% across the 4 questions.
- **SC-005**: Checkpoint intro word count is reduced by >40% to remove duplicate test warnings.

---

## Assumptions

- Checkpoint items are delivered dynamically via `exercise.content.items`.
- The existing `CourseExerciseCategoryConfig` presentation hooks (`hideFooter`, `hideSkip`) can be utilized by the router and screen containers to govern footer visibility cleanly.
- The color system uses tokens from `@/lib/tokens.ts` and `SEMANTIC_COLORS`.
