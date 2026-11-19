---
title: 'Thought, then trap, saved as a catch'
type: 'feature'
ticket: '3'
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

**Problem:** The Thought Catcher wizard asks for a situation, a checkpoint and an is-it-true step before a thought is ever saved, never records which thinking trap the person picked, and its Home cache only appends.

**Approach:** Reshape the wizard to intro (first-time only), thought, trap. Answering the trap step writes the completed rung-2 row (same id, replace on re-answer) and one replace-by-id cache record. Add `TrapChoice`, its label table, the `TrapType` mapping and the optional `trap` field.

## Boundaries & Constraints

**Always:** AD-12: the domain wizard stays the only runtime. AD-13/14: a catch is a completed row with `balancedThought`, `isTrue`, `postIntensity` absent, `situation` saved as `''`; same entry id on every write. AD-15: `trap?: TrapChoice` is additive, `schema_version` unchanged; `TrapChoice = CognitiveDistortionKey | 'not_sure' | 'none'`; the type and one label table live in `src/domains/exercises/domain/trap.ts`; one named function maps `TrapType` to `TrapChoice`; nothing else switches on `TrapType`. AD-22: cache key `happy.reflections` unchanged, records gain `id`, written through one `data/` function called once per write; intro-seen flag is a device-local `@happy/<name>_v1` key through a `data/` adapter. Trap chips: the person's three most-picked traps (completed `thought_catcher` rows, escapes excluded), then "More" (expands the rest in place), then "Not sure" and "None of these, it's just hard" on their own row; single select; either escape completes the step; one definition sentence under the chips for a selected trap. With fewer than three picks, or no readable rows (guest, offline), the first three of the label table order fill the row. Up to three recent thoughts from the cache show as chips above the idea chips. Copy comes from the `thoughtCatcher.*` keys story 2 added via `t()`; no new keys. Pure rules (ranking, mapping) have no React, I/O or clock.

**Never:** No step-up row, stems, recall, draft or outbox (stories 4, 6). No saved-card variants (story 5). No change to the generic exercise flow, `useExerciseFlow`, Thought Reframing, `selectedDistortions` in insights, or home `ReflectionsSection` layout beyond routing its trap label through the mapping. No tests. No new dependency. No commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Answer with a trap | Thought entered, trap chip tapped | One completed row, `trap` = that key, `situation` `''`; one cache record with the entry id | Failed save swallowed as today |
| Not sure / None | Escape chip tapped | Same row shape, `trap` `'not_sure'` or `'none'`; step completes | None |
| Back, re-answer | Trap step answered, Back, other chip | Same row id updated, cache record replaced, no second record | None |
| First-time intro | No intro-seen flag | Intro shows once; flag set; never again | Storage read failure shows no intro |
| Few or no picks | Fewer than 3 prior traps, guest, offline | Row filled from label table order | None |
| Older cache entry | Record without `id` or with old `TrapType` | Home card still shows a trap label | Unmapped value shows no label |

</frozen-after-approval>

## Code Map

- `src/domains/thoughtCatcher/domain/steps.ts:6-52` -- step order `intro, situation, thought, rate1, checkpoint, is_true, balanced, rate2, summary`; `STAGE_NAMES`, `stageProgress`, `nextLabel` hard-code the dropped steps. New order `intro, thought, trap`; leave `balanced, rate2, summary` compiling but unreachable.
- `src/domains/thoughtCatcher/domain/types.ts:5-15` -- `ThoughtCatcherDraft`, `freshDraft` (`situation: ''`); add `trap`.
- `src/domains/thoughtCatcher/data/buildEntryPayload.ts` -- `CAUGHT_STEPS`/`CHECKED_STEPS`, always `status: 'completed'`; add `trap`, saved step list ends at trap.
- `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx` -- `entryId`/`startedAt` exist (story 1); `finish` is the only write at summary; rewrite `onBack`, `onClose` alert (no longer true after the trap write), keep `onGoDeeper`; `saveThoughtCatcherReflection` call moves to the trap write.
- `src/domains/thoughtCatcher/ui/presentation/ThoughtCatcherView.tsx:21-30,167-178` -- hardcoded English, intro always rendered; add trap step view, recent chips, definition line; use `t()`.
- `src/domains/thoughtCatcher/data/saveReflection.ts:9-23` -- maps to cache record, `trap` undefined today; add `id`, trap.
- `src/domains/home/data/reflectionsStorage.ts:21-29` -- `appendReflection` push-only; make replace-by-id; add `getRecentThoughts(n)`; keep `getMostRecent`, `WEEKLY_GOAL`.
- `src/domains/onboarding/domain/types.ts:36-48` -- `ReflectionData`: add optional `id`; `enums.ts:10-18` `TrapType` stays, only the mapping function reads it.
- `src/domains/home/ui/presentation/views/ReflectionsSection.tsx:9-36` -- local `TRAP_LABELS` over `TrapType`; route through the mapping and label table.
- `src/types/exerciseFlow.ts:320-328` -- `ThoughtCatcherResponse`; add `trap?: TrapChoice` (type-only import).
- `src/domains/exercises/domain/practice.ts` -- sibling for new `trap.ts` (`TrapChoice`, `TRAP_LABEL_KEYS`, `fromTrapType`, `rankTraps`).
- `src/screens/ThoughtReframingScreen/types.ts:25-36` -- `CognitiveDistortionKey` (10 keys); import type only.
- `src/domains/exercises/ui/containers/usePracticeCounts.ts` -- pattern for a query hook (never selects more than needed); copy for `useTrapPicks` selecting `response` of completed `thought_catcher` rows.
- `src/locales/en/exercises.json` `thoughtCatcher.*` -- keys for questions, chips, `trapName.*`, `trapDefinition.*` exist; next/intro labels are not keyed (view hardcodes), reuse existing strings or leave hardcoded.

## Tasks & Acceptance

**Execution:**
- [ ] `src/domains/exercises/domain/trap.ts` -- `TrapChoice`, label-key table, `fromTrapType(TrapType)`, `rankTraps(rows)` returning keys by pick count, ties by table order -- one home for the rules
- [ ] `src/types/exerciseFlow.ts` -- add `trap?: TrapChoice` to `ThoughtCatcherResponse`
- [ ] `src/domains/thoughtCatcher/domain/{steps,types}.ts` -- new step order, progress and labels, `trap` on draft
- [ ] `src/domains/thoughtCatcher/data/buildEntryPayload.ts` -- carry `trap`, `situation` `''`, caught step list
- [ ] `src/domains/home/data/reflectionsStorage.ts`, `onboarding/domain/types.ts`, `thoughtCatcher/data/saveReflection.ts` -- replace-by-id with `id` and trap; `getRecentThoughts`
- [ ] `src/domains/thoughtCatcher/data/` -- intro-seen adapter on `@happy/thought_catcher_intro_v1`
- [ ] `src/domains/exercises/ui/containers/useTrapPicks.ts` -- query hook, key `["trap_picks", userId]`, disabled with no user, returns ordered picks; invalidate it in `useExerciseMutation` `onSuccess`
- [ ] `ThoughtCatcherContainer.tsx` + `ThoughtCatcherView.tsx` -- trap step, chips, More, escapes, definition line, recent chips, write on trap answer, Back re-answer upserts, `t()` copy
- [ ] `ReflectionsSection.tsx` -- trap label through `fromTrapType` and the table

**Acceptance Criteria:**
- Given a thought and any trap, Not sure or None answer, when saved, then one completed row exists carrying that `trap`, `situation` `''` and no `balancedThought`, and one cache record exists with the entry id.
- Given the trap step answered, when the person goes Back and answers differently, then the same row and the same cache record change.
- Given an older cache entry, when Home renders, then its trap label still shows.
- Given a first-time person, when the wizard opens, then the intro shows once and not on later sittings.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

Interim: after the trap write the flow lands on the existing summary step; story 4 adds the step-up and story 5 the saved-card variants.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 3 medium patched, 3 low rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Editing the thought after a trap answer leaves row stale; Continue works without a chip | medium | patch | `onWrite` now clears `trap` when the thought changes, so Continue stays disabled until a chip is tapped and the next tap rewrites the row. |
| Chips reorder after first save (refetch includes own row) | medium | patch | Chip split is frozen once a trap is picked (`split` ref in the container). |
| Scripted example thoughts show as recent thoughts | medium | patch | `getRecentThoughts` now keeps `source === 'personal'` only. |
| Saved step list is the caught list and intensity 5 is stored | low | rejected | AD-14 names the existing caught step list and says `trap` is not a step id; `intensity` is required by `ThoughtCatcherResponse`, so omitting it needs a schema type change outside this story. |
| Overlapping trap taps can split row and cache | low | rejected | Rare; last write wins in practice; serialising adds a queue for a double-tap. |
| `onboarding/domain/traps.ts` `TRAP_LABELS` still switches on `TrapType` | low | rejected | Pre-existing; only onboarding-created reflections reach `SavedReflectionCard`, and those carry `TrapType`. Home's card goes through `fromTrapType`. |

## Design Notes

`rankTraps` counts `response.trap` across rows, drops `'not_sure'` and `'none'`, sorts by count desc then label-table order. The chip row shows ranked picks padded from the table to three.

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'domains/(exercises|thoughtCatcher|home|onboarding)|exerciseFlow|useExerciseMutation'` -- expected: no output for touched files

**Manual checks (no device available):**
- Finish the wizard with a trap, Not sure and None: one row each, trap stored; Back and re-answer edits the same row; Home card labels an older entry.
