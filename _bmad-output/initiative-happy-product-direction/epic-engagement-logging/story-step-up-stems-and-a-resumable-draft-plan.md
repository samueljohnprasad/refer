---
title: 'Step up, stems and a resumable draft'
type: 'feature'
ticket: '4'
created: '2026-11-15'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** After the trap step the wizard ends: there is no way to write a fairer version, the fair-thought step shows fixed starters, and nothing survives closing the app mid-sentence.

**Approach:** After the trap step (not after "None of these") a step-up row is shown once with two equal options. Writing a fairer version opens the existing fair-thought and belief steps with three rotating stems and a rotating example, and saves onto the same row at rung 3. Typed input is kept in a draft adapter that holds the entry id, selected date and text.

## Boundaries & Constraints

**Always:** AD-14: the draft lives in AsyncStorage under `@happy/thought_catcher_draft_v1`, exists only from the rung-2 write onward, is cleared on rung-3 save and on "That's enough for today", never expires at day end, and holds `entryId`, `selectedDate` (local YYYY-MM-DD) and the rung-3 text; reopening the wizard with a draft restores the same id, date, step and text. Its type is exported for the Home resolver (story 10) and named distinctly from `ThoughtCatcherDraft`. AD-21: `pickStems(ordinal)` and the example pick are pure and arithmetic (no `Math.random`, no stored history); `ordinal` is the count of earlier rung-3 entries (completed `thought_catcher` rows with a non-empty `balancedThought`); 3 of 8 stems, never the same three on consecutive entries; the example is one of four, never the same on consecutive entries. The step-up row shows once per sitting, "Write a fairer version · 1 min" and "That's enough for today" at equal weight (stacked, at least 56 pt), and nothing follows a decline. Tapping a stem writes it into the field; a stem alone is not an answer (stems count in `withoutStarter`). A rung-3 save sets `checked`, writes the same id with the checked step list, `balancedThought`, `isTrue`, `postIntensity` (the after rating) and keeps `intensity` as before, then replaces the cache record by id. The go-deeper link to Thought Reframing stays a quiet text link. Copy uses the existing `thoughtCatcher.stepUp.*`, `stem.1-8`, `example.fair.1-4`, `question.fair` keys through `t()`.

**Never:** No saved-card variants, hard-entry rule, `isHardEntry` or `postIntensity` fallback change (story 5). No outbox (story 6). No Home resolver or ask logic (story 10). No change to the story-7 practice-completion ack, story-3 trap step, generic flow or Thought Reframing. No new keys, tests, dependency or commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Step up | Trap answered with a trap or Not sure | Step-up row shown once | None |
| After "None of these" | Escape chip | No step-up row; goes to summary | None |
| Stop | "That's enough for today" | One row at rung 2, no draft, summary | None |
| Write fair thought | Stem tapped, text typed, belief rated, saved | Same row at rung 3 (`balancedThought`, `postIntensity`); draft cleared; cache record replaced | Failed save swallowed as today |
| Close mid-sentence | App closed at the fair-thought step | Reopen restores id, date, step and text | Storage failure: no restore |
| Stems rotate | Ordinal n then n+1 | Different three stems on consecutive entries; example differs | None |
| Back from the fair step | Back to the step-up row | Row not shown again; draft kept | None |

</frozen-after-approval>

## Code Map

- `src/domains/thoughtCatcher/domain/steps.ts:8-21,33-36` -- `STEP_ORDER` `intro, thought, trap, summary`; `balanced`/`rate2` exist in the type, `WRITING_RULES` and the view but are unreachable; add a `stepUp` step and put `balanced, rate2` back in the order for the step-up path; `STAGES`/`STAGE_NAMES` have two stages, extend for the third; container `progressText` hardcodes "of 2".
- `src/domains/thoughtCatcher/domain/types.ts` -- `ThoughtCatcherDraft` (in-memory); `checked` is never set yet.
- `src/domains/thoughtCatcher/domain/text.ts:16,23` -- `withoutStarter`/`prependStarter` key off `STARTERS` (`scoring.ts:16`, 4 hardcoded strings); the 8 stem strings must count as starters.
- `src/domains/thoughtCatcher/ui/presentation/views/ThoughtCatcherView.tsx` -- reuse `writing('balanced')` with `QuickReplies` (`:76-95`), `rate('post')` with `BelievabilityScale`, summary checked branch, `deeper` link (hardcoded English, `:158-163`); examples array `BALANCED` (`:24`) is three hardcoded strings; add the step-up row view.
- `src/domains/thoughtCatcher/data/introSeen.ts` -- the AsyncStorage adapter pattern to copy for `data/pausedEntry.ts`.
- `src/domains/thoughtCatcher/data/buildEntryPayload.ts:6-23` -- `CAUGHT_STEPS`/`CHECKED_STEPS`; `draft.checked` adds `postIntensity`, `isTrue`, `balancedThought`; do not touch the fallback.
- `src/domains/thoughtCatcher/data/saveReflection.ts:8-23` -- hardcodes `fair: ''`, `after: null`; carry `draft.balanced` and the after rating on a rung-3 save.
- `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx` -- `entryId` is `useState(randomUUID)` (`:35`), `startedAt` a ref (`:36`); `onTrap` does the rung-2 write and ack (`:109-123`); needs restore from the draft, step-up navigation, rung-3 save, draft write on input and clear on save/stop.
- `src/domains/exercises/domain/` -- add `rotation.ts` (`pickStems`, `pickExample`) beside `practice.ts`.
- `src/domains/exercises/ui/containers/useTrapPicks.ts` -- already reads completed `thought_catcher` responses; also expose `fairCount` (rows with non-empty `balancedThought`) as the ordinal.
- `src/hooks/useExerciseMutation.ts:51-64` -- upsert by id; `onSuccess` already invalidates what this story needs.
- `src/domains/home/data/reflectionsStorage.ts:22-33` -- `upsertReflection` replaces by id; reuse.
- `src/locales/en/exercises.json` `thoughtCatcher.stepUp.{body,body_plain,write,stop,stop_plain}`, `stem.1-8`, `example.fair.1-4`, `question.fair`; no go-deeper key (stays hardcoded).

## Tasks & Acceptance

**Execution:**
- [ ] `src/domains/exercises/domain/rotation.ts` -- pure `pickStems(ordinal)` (three of eight, consecutive ordinals never give the same three) and `pickExample(ordinal)` (four, never repeats consecutively)
- [ ] `src/domains/thoughtCatcher/data/pausedEntry.ts` -- read/write/clear with exported `PausedEntry { entryId, selectedDate, text }`, try/catch like `introSeen.ts`
- [ ] `useTrapPicks.ts` -- expose `fairCount`
- [ ] `domain/steps.ts`, `domain/text.ts`, `types.ts` -- `stepUp` step, rung-3 path, stage count, stems count as starters
- [ ] `ThoughtCatcherView.tsx` -- step-up row (two stacked equal options), stems from rotation via `t()`, example from rotation, quiet go-deeper link kept
- [ ] `saveReflection.ts`, `ThoughtCatcherContainer.tsx` -- restore from draft, write draft while typing, step-up flow, rung-3 save (same id, `checked`), clear draft on save and on stop

**Acceptance Criteria:**
- Given a caught thought, when the person steps up, closes the app mid-sentence and reopens the wizard, then the id, date, step and text are restored.
- Given a fair thought saved, when checked in the database, then one row at rung 3 exists with `balancedThought` and `postIntensity`, and no draft remains.
- Given "That's enough for today", when chosen, then one row at rung 2 exists and no draft remains.
- Given "None of these", when answered, then no step-up row shows.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

Draft is first written when "Write a fairer version" is chosen (not at the rung-2 write); restore needs a signed-in user. `data/caughtEntry.ts` (not in the plan) reads the rung-2 response back so a restored sitting can upgrade the same row.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 5 medium patched, 2 low rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Failed read-back (offline) deletes the draft | medium | patch | `readCaughtResponse` now throws on error and returns null only for a missing row; the container clears the draft only when the row is confirmed missing. |
| Draft cleared when the rung-3 save failed | medium | patch | `saveFair` clears the draft only after `save` resolves. |
| Draft survives a late switch to "None of these" | medium | patch | `onTrap` clears the draft when the trap is `none`. |
| Progress text off by one on thought and trap steps | medium | patch | New pure `stageIndexOf(step)` drives the label. |
| Back from the fair step re-shows the step-up row | medium | patch | `prevStep('balanced')` returns `trap`; the plan row says the row is not shown again. |
| Stems can change if `fairCount` loads after a restored render | low | rejected | Only the restore path can render the fair step before the query resolves; the shift is cosmetic and fixing it adds a loading gate. |
| `isTrue` saved as `null` | low | rejected | The wizard has no is-true step; the response type allows `null` and the old save shape did the same. |

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'domains/(exercises|thoughtCatcher|home)|exerciseFlow'` -- expected: no output for touched files

**Manual checks (no device available):**
- Catch, step up, close mid-sentence, reopen: input restored; save leaves one rung-3 row; stop leaves one rung-2 row with no draft.
