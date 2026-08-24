# Feature Specification: Dialogue Exercise Redesign

**Feature Branch**: `001-dialogue-redesign`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Task 9 – Dialogue exercise redesign"

## Clarifications

### Session 2026-08-24

- Q: When a learner selects an option on a decision beat, does feedback for only their chosen option appear, or does the exercise also reveal what the other options would have said? → A: Only the chosen option's feedback appears; other options vanish.
- Q: When the learner taps "Next message" and a new beat appears, what should VoiceOver announce — the speaker name and full message text, or just the speaker name? → A: Announce speaker name + full message text for each new beat.
- Q: What should the "Earlier" summary row display — a single static label like "Earlier", or the `historySummary` text from each collapsed beat joined together? → A: "Earlier" label + each collapsed beat's `historySummary` joined with " · ".
- Q: If a Dialogue exercise's content fails validation at runtime, what should the screen show — a generic error state, or should the node router have already blocked it from rendering? → A: Engine returns `null`; existing node-router error boundary handles display.
- Q: When a learner is on a decision beat but hasn't yet chosen an option, the primary footer button ("Next message") is hidden. Should the "Skip for now" button also be hidden, or remain visible? → A: "Skip for now" remains visible, even while the primary button is hidden.

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Advancing Through a Passive Dialogue (Priority: P1)

A learner opens a Dialogue exercise. They see a title and instruction, then one speaker's
message. They tap "Next message" to reveal the next beat one at a time. Each new beat appears
while older beats collapse to a single compact "Earlier" summary. When all beats are shown, a
final insight appears and the Continue button becomes active.

**Why this priority**: This is the primary learning path. Every Dialogue exercise must support
it before any decision flow is relevant.

**Independent Test**: Can be fully tested by opening a Dialogue fixture with four passive beats,
tapping "Next message" three times, and confirming the insight appears with Continue active.

**Acceptance Scenarios**:

1. **Given** a Dialogue with 3 passive beats and the learner on beat 1, **When** they tap
   "Next message", **Then** beat 2 appears, older beats collapse to an "Earlier" summary, and
   the footer still shows "Next message".
2. **Given** the learner has revealed all beats, **When** the last beat is shown, **Then** the
   final insight appears and the footer label changes to "Continue".
3. **Given** a saved response with `beatIndex: 2`, **When** the exercise reopens, **Then** it
   restores to beat 2 with the correct Earlier summary, without replaying earlier beats.

---

### User Story 2 – Making a Decision Within a Dialogue (Priority: P2)

A learner reaches a decision beat. They are shown the prompt and two or three response options.
They tap one option. The options disappear and inline feedback explaining the likely effect of
that choice appears in its place. The footer changes to "Next message" (or "Continue" if last
beat). Tapping it advances to the next beat.

**Why this priority**: Decision beats are the core active-learning moment. Without them,
Dialogue is purely passive reading.

**Independent Test**: Can be fully tested with a two-beat fixture where beat 2 is a decision
beat; tap one option, confirm feedback shows and choices disappear, tap Next message.

**Acceptance Scenarios**:

1. **Given** a decision beat is active, **When** the learner taps any option, **Then** the
   option list is replaced by inline feedback and the footer becomes ready to advance.
2. **Given** a decision beat where the learner chose a non-ideal option, **When** feedback
   appears, **Then** the feedback is explanatory and non-shaming, and the footer still advances
   normally (no retry required).
3. **Given** the learner has submitted a decision choice, **When** the exercise is saved and
   reopened, **Then** the decision outcome is restored (not replayed from scratch).

---

### User Story 3 – Earlier History Compression (Priority: P3)

When a learner is on beat 3 or later, beats older than the immediately preceding one collapse
into a single labelled "Earlier" summary row rather than remaining as full message bubbles. This
keeps the workspace uncluttered regardless of how many beats the content has.

**Why this priority**: Supports constitution Principle II (one active region at a time) and
keeps the screen readable on all device sizes.

**Independent Test**: Open a 4-beat fixture and advance to beat 4; confirm beats 1–2 appear
as a single "Earlier" summary and only beat 3 (prior) and beat 4 (active) are shown in full.

**Acceptance Scenarios**:

1. **Given** a learner is on beat 4 of 4, **When** the workspace renders, **Then** beats 1–2
   are collapsed into one "Earlier" row, beat 3 is shown as a standard message bubble, and
   beat 4 is the active beat.
2. **Given** the learner is on beat 1 or 2, **When** the workspace renders, **Then** no
   "Earlier" summary row is shown.

---

### Edge Cases

- What happens if content has fewer than 2 beats? The validator must reject it; the engine must
  not render an empty or single-beat Dialogue.
- What happens if a decision beat has only one option? The validator must reject it; at least
  two options are required.
- What if saved `beatIndex` exceeds the number of beats (corrupted save)? The engine must clamp
  to `beats.length - 1` safely.
- What if a passive beat immediately follows a decision beat? It must render as a normal passive
  beat — no choice UI shown.
- What if the exercise is locked (read-only)? No taps should alter state; the footer is disabled.
- What if the content reader returns `null` at runtime (invalid content reaches the engine)?
  The engine MUST return `null`; the node router's existing `NodeExerciseDataError` boundary
  renders the error state. The engine MUST NOT attempt to render a partial or degraded UI.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The exercise MUST present beats in authored order, one active beat visible at a
  time.
- **FR-002**: The exercise MUST support two beat types: passive (message-only) and decision
  (message plus 2–3 options).
- **FR-003**: A Dialogue MUST contain 2–4 beats total, with at most 2 decision beats.
- **FR-004**: Each beat MUST carry a stable unique ID used in saved responses and transitions.
- **FR-005**: Passive beats MUST show "Next message" as the footer label; the last beat MUST
  show "Continue".
- **FR-006**: Decision beats MUST hide the footer's primary action until the learner selects
  an option. The "Skip for now" button MUST remain visible during this state.
- **FR-007**: After an option is selected on a decision beat, ALL options MUST disappear and
  ONLY the feedback for the chosen option MUST appear in their place. Unchosen options and
  their feedback strings MUST NOT be shown.
- **FR-008**: Beats older than the immediately prior one MUST collapse into a single "Earlier"
  summary row when the learner is on beat 3 or later. The row MUST display the label "Earlier"
  followed by each collapsed beat's `historySummary` value joined with " · " (e.g.,
  "Earlier · Kai notices the email · Sam decides to reply").
- **FR-009**: The exercise MUST restore to the exact saved beat without replaying prior beats.
- **FR-010**: Corrupted or out-of-range saved `beatIndex` MUST be clamped to a valid in-progress
  state (never `complete`) before rendering.
- **FR-011**: A final insight string MUST appear after the last beat is revealed; it MUST NOT
  appear before then.
- **FR-012**: The strict content validator MUST reject any Dialogue with fewer than 2 beats,
  more than 4 beats, more than 2 decision beats, missing or empty beat IDs, missing
  `historySummary` on any beat, or decision options outside the 2–3 range.
- **FR-013**: Saved responses MUST store only beat index, decision choice IDs, phase, and
  format — no message text, option labels, or therapeutic copy.
- **FR-014**: The exercise MUST include a dev test fixture in the review group covering at
  least one passive beat and one decision beat.
- **FR-015**: On every beat transition (including restore), the exercise MUST announce
  `"<speaker>. <message>"` via an accessibility live region so VoiceOver users receive the
  same information as sighted users.

### Key Entities

- **Beat**: A single unit of the dialogue. Has a stable ID, speaker name, message text, side
  (left/right), and beat type (passive or decision).
- **Decision Beat**: A beat that additionally contains 2–3 options, each with a stable ID,
  label, and feedback string.
- **Dialogue Response**: Saved state containing `format`, `phase` (`active` or `complete`),
  `beatIndex`, and `selectedOptionIds` (map of beat ID → chosen option ID).
- **Earlier Summary**: A collapsed display of all beats prior to the immediately preceding one.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner with no prior save can advance through all beats of a 4-beat Dialogue
  in under 90 seconds without confusion about what to do next.
- **SC-002**: 100% of Dialogue exercises restore to the correct beat when reopened after an
  interrupted session, verified across all fixture cases.
- **SC-003**: The workspace never shows more than two full message bubbles simultaneously (the
  active beat and the immediately prior one); all older content is in the Earlier summary.
- **SC-004**: Decision feedback is delivered in under one interaction — no extra taps required
  after selecting an option before feedback is visible.
- **SC-005**: The strict validator rejects 100% of malformed Dialogue content objects (wrong
  beat counts, missing IDs, out-of-range option counts) before they reach the exercise renderer.
- **SC-006**: Saved responses contain zero therapeutic text strings; all data is ID- and
  state-only, verifiable by inspection of any persisted response object.

## Assumptions

- A Dialogue exercise teaches one concept through a short scripted exchange between two named
  characters; it is not a live chat or generative interaction.
- Content authors control speaker names, side (left/right), and beat order at authoring time;
  the runtime does not reorder beats.
- The "Earlier" label and summary row are a fixed UI pattern; individual collapsed beats are
  not individually tappable or expandable.
- The engine replaces the existing `DialogueCategoryEngine` entirely; no backward compatibility
  with the flat `messages[]` shape is provided.
- Fixture lives in the `review` fixture group (currently empty), as it is a review-oriented
  exercise type.
- Haptic feedback (selection) fires when the learner taps a decision option.
