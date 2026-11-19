---
title: 'Saved card variants and the hard-entry rule'
type: 'feature'
ticket: '5'
created: '2026-11-16'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
lenses_ran: ['quick']
review_loop_iteration: 0
review: 'quick'
review_source: 'pinned'
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The wizard's summary step is the same for every save, rates a catch as if it were a check, and meets a hard day with the same cheerful verdict.

**Approach:** The summary step becomes a saved card in one of three variants, chosen by a pure hard-entry rule: standard (rung 3), catch-only (rung 2) and hard entry. Each has its Happi expression and haptic.

## Boundaries & Constraints

**Always:** AD-18: `moodBand(score)` 4-5 good, 3 okay, 2 low, 1 not okay; `bandForDay(moods, localDay)` is the band of the latest row that local day with `input_method = 'emotion_logger'`, a mood's day being the device-local date of its `selected_date`; no such row, no band. AD-19: `isHardEntry({ trap, intensity, post, bandToday })` is true when the band is low or not okay, or `trap === 'none'`, or `post` is set and `post >= intensity`; computed at the summary, never stored. The payload omits `postIntensity` when the after-rating was not set (`draft.post === null`). Variants follow `key-saved-card-cases.html`: standard shows "Saved to your journal", the move headline, the thought with Before, the fairer thought with Now, the trap name, practices completed with "N of 3 this week", Go to Home; catch-only shows "You caught the thought." and the thought, no belief change; hard shows "That sounds hard.", the thought, an outline "Breathe for a minute" above Go to Home, and the help pill below. No bubble, no shadow, no celebration on any variant. Happi: Pride for standard and catch-only, Gentle for hard. Haptics: standard Success notification, catch-only Light impact, hard Soft impact. Counts come from `usePracticeCounts`; nothing is shown until it has data. The onboarding `SavedReflectionCard` is not touched; the wizard gets its own card. Existing coping-card save and the quiet go-deeper link stay on standard and catch-only and are absent on hard. Crisis and "Get help" handling stays intact.

**Never:** No outbox or unsynced state (story 6). No reminder row. No Home resolver, recall or events. No change to rung derivation, the trap step, step-up, rotation or the generic flow. No tests, dependency or commit; the ticket's "rule table tests" clause is dropped by the standing no-tests rule.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rung 3 | Checked, post below intensity, ok band | Standard card | None |
| Rung 2 | Stopped at step-up | Catch-only, one row, no belief change | None |
| None of these | Trap `none` | Hard card | None |
| Bad day | Latest check-in today is low or not okay | Hard card, even at rung 3 | Mood read fails: no band |
| After not lower | `post >= intensity` | Hard card | None |
| Unrated after | `post` null on a checked save | Payload has no `postIntensity`; rule ignores post | None |
| Counts loading | `usePracticeCounts` no data | Card without the practices row | None |

</frozen-after-approval>

## Code Map

- `src/domains/exercises/domain/mood.ts` (new) -- `moodBand`, `bandForDay`, `isHardEntry`; reuse `localDay` from `practice.ts`.
- `src/domains/exercises/data/moodBand.repo.ts` (new) -- `readBandToday(userId, now)`: reads `moods` (`mood_score,input_method,selected_date`, a window around today) then `bandForDay`; throws on error.
- `src/domains/thoughtCatcher/data/buildEntryPayload.ts:21-26` -- `postIntensity: draft.post ?? draft.intensity` becomes set only when `draft.post !== null`.
- `ThoughtCatcherContainer.tsx:157-164` -- `saveFair` stops coercing `post`; on `summary` read the band, compute `hard`, set Happi pose and haptic; add `usePracticeCounts`; breathe route `buildExerciseRoute('mindful_breathing_1min')`.
- `ThoughtCatcherView.tsx:158-225` -- `summary()` renders the new `SavedEntryCard`; footer for `summary` varies by variant (hard adds the outline and help pill).
- `ui/presentation/components/SavedEntryCard.tsx` (new) -- JSX only, three variants, inline 3-segment ring SVG.
- `src/locales/en/exercises.json` `thoughtCatcher.saved` -- add `move`, `another`, `before`, `now`, `practices`, `ofThree`; existing `title`, `caught`, `hard`, `thoughtRow`, `breathe`, `home` reused.
- Do not change: `SavedReflectionCard.tsx`, `useEmotionLogger.tsx`, `saveReflection.ts`.

## Tasks & Acceptance

**Execution:**
- [ ] `mood.ts`, `moodBand.repo.ts` -- rules and the one moods read
- [ ] `buildEntryPayload.ts`, `ThoughtCatcherContainer.tsx` -- omit unset `postIntensity`; band read, hard flag, pose, haptic, counts
- [ ] `SavedEntryCard.tsx`, `ThoughtCatcherView.tsx`, `exercises.json` -- card variants and copy

**Acceptance Criteria:**
- Given a rung-3 save with an after-rating below the before and no low check-in today, when the summary shows, then the standard card is shown.
- Given a rung-2 save, when the summary shows, then the catch-only card shows one row of the thought and no belief change.
- Given a save with "None of these" or a low or not-okay check-in today, when the summary shows, then "That sounds hard." shows with "Breathe for a minute" and the help pill.
- Given a checked save where the after-rating was never touched, when the row is read, then it has no `postIntensity`.
- Given onboarding's keepsake step, when it renders, then it is unchanged.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'domains/(exercises|thoughtCatcher)|ThoughtCatcher'` -- expected: no output for touched files

**Manual checks (no device available):** the three cases above.

## Review Triage Log

Pass 1 (quick lens): 0 high, 2 medium patched, 4 questions answered. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Band not reset on leaving summary, stale variant and double haptic on re-entry, stale read could overwrite | medium | patch | Band effect resets on every step change and drops results from a cleaned-up visit. |
| No timeout on the moods read, summary could stay blank | medium | patch | `readBandToday` races a 4 s timer that resolves to no band. |
| Coping-card save absent on catch-only | question | rejected | Catch-only has no fairer thought to save; the plan line is read as "where one exists". |
| Title and practices row on every variant | question | rejected | The mockup shows both on all three. |
| "Go to Home" runs `router.back()` | question | open | Same action as the old "Done"; the exercise is opened from Home or Lessons. Confirm whether a Home route is wanted. |
| `SavedReflectionCard.tsx` differs from baseline | question | rejected | Changes come from the earlier uncommitted onboarding work; this story did not edit it. |
