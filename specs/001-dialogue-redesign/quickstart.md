# Quickstart Validation Guide: Dialogue Exercise Redesign

**Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md) | **Data model**: [data-model.md](./data-model.md)

---

## Prerequisites

- Repo cloned, dependencies installed (`npm install`)
- iOS simulator booted (iPhone 15 Pro recommended)
- Dev build running: `npm run ios`

---

## Scenario 1 — Passive dialogue advances beat by beat

**Setup**: Open the dev test screen → "Review exercises" → `fixture-dialogue`. Turn on VoiceOver.

**Steps**:
1. Confirm only beat 1 is visible (no Earlier row). VoiceOver announces `<speaker>. <message>`.
2. Tap "Next message" → beat 2 appears. VoiceOver announces beat 2 text.
3. Tap "Next message" → beat 3 appears; beat 1 collapses to "Earlier" row. VoiceOver announces beat 3 text.
4. Tap "Continue" → exercise reaches `phase: complete`; insight text appears.

**Expected**: Each step shows exactly one active beat plus at most one prior full bubble.
Footer label matches "Next message" / "Continue" correctly. VoiceOver live region works.

---

## Scenario 2 — Decision beat hides footer until option selected

**Setup**: Same fixture, reach a decision beat.

**Steps**:
1. Confirm the footer primary action is hidden. Confirm "Skip for now" is still visible.
2. Tap one option → ALL options disappear, inline feedback appears for ONLY the chosen option.
3. Confirm footer "Next message" / "Continue" is now visible and active.
4. Tap to advance → next beat appears.

**Expected**: Footer is absent until selection, present immediately after. Unchosen options vanish completely.

---

## Scenario 3 — Resume from interrupted session

**Steps**:
1. Advance to beat 3 of 4, then hard-kill the app.
2. Reopen and navigate back to the exercise.

**Expected**: Exercise opens at beat 3 exactly. Earlier row shows beats 1–2 summary as `"Earlier · <summary 1> · <summary 2>"`.
No beats replay from the beginning. VoiceOver announces the restored active beat.

---

## Scenario 4 — Content validation rejects malformed content

**Steps** (inspect via TypeScript / standalone validator):
1. Pass a content object with 1 beat → expect validation error "at least 2 beats".
2. Pass a beat missing `historySummary` → expect validation error.
3. Pass a decision beat with 1 option → expect "at least 2 options".
4. Pass a beat without `id` → expect "non-empty string" error.

**Expected**: Each case returns a non-empty `MicrolearningContentIssue[]`. The engine component returns `null` safely, and the node router's `NodeExerciseDataError` boundary renders the error state (no partial UI rendered).

---

## Scenario 5 — Saved response privacy check

**Steps**:
1. Advance through the fixture and select a decision option.
2. Inspect the Redux store (or saved draft) for the `currentResponse` object.

**Expected**: Response contains only `format`, `phase`, `beatIndex`, `selectedOptionIds`, and `isCorrect`. Zero text strings from beat messages, option labels, or feedback copy.

---

## TypeScript & File Size check

```bash
npx tsc --noEmit --pretty false 2>&1 | grep -E "dialogueContent|dialogueState|dialogueResponse|DialogueCategoryEngine"
wc -l src/components/exercise/DialogueCategoryEngine.tsx src/components/exercise/dialogueContent.ts src/components/exercise/dialogueState.ts
```

**Expected**: No TS errors. Each file ≤ 300 lines (Constitution Principle VII).
