# Research: Dialogue Exercise Redesign

**Phase**: 0 | **Date**: 2026-08-24 | **Feature**: specs/001-dialogue-redesign/spec.md

All decisions resolved from direct codebase inspection. No external research required.

---

## Decision 1: Beat-indexed state vs. message-list scroll

**Decision**: Beat-indexed (integer `beatIndex` + `selectedOptionIds` map).

**Rationale**: Matches the established pattern in GuidedDiscoveryTrail, FadedThoughtRecord,
TeachBackChain. A single integer index plus a selection map is the minimal state that
allows deterministic restore, progress tracking, and compact storage.

**Alternatives considered**:
- Storing full message strings in saved state: rejected (violates Constitution Principle V —
  no therapeutic text in stored responses).
- Accumulator pattern (array of revealed IDs): rejected (more storage, same expressiveness,
  harder to validate correctness).

---

## Decision 2: "Earlier" compression threshold

**Decision**: Beats older than the immediately prior one (index < beatIndex - 1) collapse
to a single "Earlier" summary row. This activates when beatIndex ≥ 2.

**Rationale**: Matches design spec: "Show current turn plus at most one relevant previous
turn; older content becomes one `Earlier` summary." Consistent with CompactHistory usage
in other engines.

**Alternatives considered**:
- Always show all past beats: rejected (violates Constitution Principle II — one active
  region; screen becomes cluttered on 4-beat dialogues).
- Show last 2 beats as full, compress rest: this IS the chosen approach.

---

## Decision 3: Decision beat footer behavior

**Decision**: Footer primary action is hidden (not disabled) while a decision beat is
active and no option has been selected. Once an option is selected, footer becomes ready
for "Next message" or "Continue".

**Rationale**: Hiding choices after selection (replacing with feedback) is the spec'd pattern
used across GuidedDiscoveryTrail and FadedThoughtRecord. Footer readiness follows the
`onInteraction(response, ready: boolean)` API already established.

**Alternatives considered**:
- Disable footer (greyed out "Next message"): rejected — hiding the footer until needed
  is cleaner UX and matches existing exercise patterns.

---

## Decision 4: Transition wiring location

**Decision**: Dialogue label and transition remain in `courseExercisePrimaryTransition.ts`
(already wired via `getProgressLabel` / `getNextProgressState`). These will be replaced
with new beat-aware functions that understand passive vs. decision beats.

**Rationale**: Dialogue is already a direct switch-case in the primary transition file
(not batched). Replacing those two function calls in-place is the minimal change.

**Alternatives considered**:
- New batch transition file: rejected (adds indirection with no benefit for a single
  exercise type already handled inline).

---

## Decision 5: Content validator placement

**Decision**: A new `validateDialogueContent()` function wired into
`validateMicrolearningContent()` in `microlearningContentValidation.ts`, replacing the
currently absent validator for Dialogue.

**Rationale**: All other redesigned exercises follow this pattern. Dialogue is currently
in `MICROLEARNING_CATEGORIES` but has no validator branch in `validateMicrolearningContent`.

**Alternatives considered**: None — this is the established architecture.

---

## Decision 6: Test fixture location

**Decision**: Fixture lives in `specs/001-dialogue-redesign` (dev test fixture added to
`src/screens/CourseExercisesTestScreen/fixtures/review.ts`), the "review" group, which is
currently empty and designated for this exercise type.

**Rationale**: `review.ts` is the natural home per the existing fixture group structure
(`aggregate.ts` describes it as "Review exercises").
