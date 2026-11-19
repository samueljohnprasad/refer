# Review A — Rubric walk: architecture-engagement-logging

Reviewed 2026-11-15. Spine: `../architecture-engagement-logging.md` (AD-12..AD-24). Read-only review; no spine or code file was changed.

**Overall verdict:** adequate skeleton, not yet a safe build substrate. The data-shape decisions (AD-13, AD-15, AD-18, AD-19, AD-20) are strong and match the code. The gaps are in the paths the UX depends on most: offline save, which timestamp places an entry in a day or week, what counts as "practice", and the input contract of `resolveHomeAsk`.

**Counts:** Critical 2 · Major 12 · Minor 10

---

## Rubric verdicts

| # | Checklist item | Verdict |
|---|---|---|
| 1 | Fixes the real divergence points for the level below, misses none | thin |
| 2 | Every AD's Rule is enforceable and prevents its stated divergence | adequate |
| 3 | Nothing under Deferred lets two units diverge | thin |
| 4 | Ratifies rather than contradicts the brownfield codebase | adequate |
| 5 | Covers the behaviours in EXPERIENCE.md | thin |
| 6 | No new AD weakens or contradicts an inherited parent AD | adequate |
| 7 | Every dimension the altitude owns is decided, deferred or open | thin |
| 8 | Mermaid diagrams valid and informative | adequate |

---

## Critical findings

### C1 — The offline / failed-save path is undecided and contradicts itself

- EXPERIENCE State Patterns: "Offline · Any rung · Save locally, show the saved card as normal, sync later." Flow 1 failure: "offline at step 7 saves locally and shows the same card."
- Spine Conventions/Errors: "A failed save keeps the draft and shows the unsynced line; it never shows the saved card as synced."
- AD-14: the draft "is cleared … when its local day ends". An unsynced entry held in the draft is therefore deleted at midnight. This is data loss of the user's writing.
- AD-16 plus inherited AD-8: an unsynced entry never counts, so the ring in Flow 1 step 8 ("moves to 2 of 3") cannot move offline. The UX and the spine disagree and the spine does not surface it.
- No replay owner is named. `UnsyncedOperationV1` (initiative AD-8) has no implementation in the repo. Today `finish()` swallows the save error and navigates back (`ThoughtCatcherContainer.tsx:85-91`).
- **Fix:** add one AD: where an unacknowledged completed entry is held (a separate outbox key, not the rung-3 draft), who replays it and when, that it is never cleared by the day rollover, which saved-card line it shows, and that it does not move the ring until acknowledged. Then amend EXPERIENCE's Offline row or record the conflict.

### C2 — AD-16 does not say which timestamp puts an entry in a day or a week

- Existing readers use three different columns: `created_at` (`useWeekPracticeDays.ts:21-23`), `completed_at` (`useExerciseStats.ts:75-101`), and local `selected_date` (`buildEntryPayload.ts`). `happy.reflections` uses `at`.
- `useExerciseMutation.ts:56-58` resets `completed_at` on every completed upsert. The spine's Deferred line accepts this for the same-sitting rung upgrade only.
- The Why sheet's **Edit** (EXPERIENCE Component Patterns) re-saves an old entry. With `completed_at` as the week key, a 3-week-old entry becomes "this week's practice" and may fill today's leaf.
- Two builders (ring vs week leaf vs garden) will pick different columns and Home and Practice will disagree, which is the exact divergence AD-16 claims to prevent.
- **Fix:** state in AD-16 that day and week membership come from `selected_date` (written once, local day, never changed on upsert), or from `created_at`; and that an edit must not move an entry between days.

---

## Major findings

### M1 — "Practice" in AD-16 includes every exercise type; the UX says rungs 2–4 only
AD-16 counts "`exercise_entries` rows whose status is completed". Breathing, grounding and the rest are completed `exercise_entries` rows too. EXPERIENCE: "Rungs 2–4 count as practice: they fill the weekly ring and grow the garden" and Flow 2 (Low day, "Breathe for a minute") "counts as showing up". M1's "Wind down · 1 min" also opens breathing. As written, breathing fills the ring. **Fix:** state whether the ring and garden count all completed exercise types or only `entryRung(entry) >= 2`, and what `entryRung` returns for other types.

### M2 — The Day-0 reflection is not in `exercise_entries`, so AD-16 zeroes the count after onboarding
`onboardingRepository.ts:16` only calls `appendReflection` (AsyncStorage). Home's lifetime count and ring read that store today (`HomeContainer.tsx:49`). Under AD-16 a user who just finished onboarding sees 0, while Happi says "You caught your first one!" (`useHomeScene.ts:37`). Existing users whose Supabase save threw (the `catch` at `ThoughtCatcherContainer.tsx:88`) also lose counts. **Fix:** decide: onboarding's personal reflection writes a completed `thought_catcher` row; or a one-time backfill; or the drop is accepted and stated.

### M3 — AD-14 "upserts the same id" has no idempotency rule
The id only exists after the first response returns (`save()` returns the row). A lost acknowledgement followed by a retry inserts a second row, which is the double count AD-14 prevents. Inherited AD-3 requires "an idempotency key for retryable completion". **Fix:** the runtime generates the row UUID on the client when the flow starts and passes it on every save (`exercise_entries.id` is an optional insert field). This also makes "same row" checkable in a test.

### M4 — AD-17 has no input contract, and does not say what it replaces
- `inputs` is not typed. Sources for "thought saved today" (Supabase row vs `happy.reflections`), "today's chip" (moods query, async), "paused" (draft), "D1 or later" and "lapsed" are not named. Each builder will gather differently.
- Existing code already computes a bubble and a night flag elsewhere: `useHomeScene.ts:22-39` (night = 19:00–05:59, hardcoded `say` lines) and the mood-answer bubble via `bubbleOverride` (`HomeContainer.tsx:43-46`, lines in `MoodCheckInView.tsx:9-15`, including a bubble on Bad, which breaks Silence rule 3). The spine does not say these are removed, so "at most one bubble" is not enforceable.
- Binds lists "tone card eligibility" but the return shape `{ bubble, button, modifier }` has no card member.
- Session-scoped inputs have no owner: three bubbles per session (Silence 7), help sheet opened this session (Silence 4), step-up declined (Silence 9).
- **Fix:** define `HomeAskInputs` field by field with its source; add `toneCard: boolean`; state that `useHomeScene`'s `say` and the mood `say` lines are retired into the resolver; name one in-memory session store.

### M5 — "Today's band" is undefined when a day has several mood rows
`useEmotionLogger` inserts a new `moods` row per tap (`hooks/data/useEmotionLogger.tsx:99-108`); journal saves also write `mood_score` (`hooks/post/useSaveJournal.ts:114`, default 3). AD-18, AD-19 (`moodBandToday`), AD-20 (exclude Low-day entries) and M4 all need one band per local day. **Fix:** one rule in AD-18: e.g. the latest `emotion_logger` row of the local day; or the lowest; and whether journal-sourced rows count for the band and for the week leaf.

### M6 — AD-15's trap vocabulary does not match the cache it says it mirrors
`ReflectionData.trap` is `TrapType` (7 values, including `'should'`; `onboarding/domain/enums.ts:10-18`). `CognitiveDistortionKey` has 10 values, including `'should_statements'` (`ThoughtReframingScreen/types.ts:25-35`). The spine says the field uses "the same name `ReflectionData` already uses", which is true of the name only. The chip list ("the first three in the standard list"), the trap-label table and the `happy.reflections` mapping will be built against different enums. **Fix:** name the one enum, the ordered standard list, and the mapping to `TrapType` for the cache (or drop `trap` from the cache write).

### M7 — Inherited AD-9 is restated more strictly than the code it builds on, with no exception list
"No domain imports another domain's UI or persistence." Today: `thoughtCatcher` imports onboarding UI (`ThoughtCatcherContainer.tsx:8-11`) and home persistence (`saveReflection.ts:5`); `home` imports onboarding types and poses (`HomeContainer.tsx:12-13`); onboarding imports home persistence (`onboardingRepository.ts:5`). The Capability Map names `SavedReflectionCard` as the saved-card home; it lives in `src/domains/onboarding/ui/presentation/components/` and takes a `ReflectionData` prop, not an entry. The first diagram shows TC and Home depending only on `exercises`. **Fix:** either list these as named legacy exceptions (as initiative AD-9 requires), or decide where the shared Happi rig and saved card live.

### M8 — AD-12 leaves three routing cases open
- `buildExerciseRoute` always returns the generic route (`exerciseScreenUtils.ts:56-66`); Lessons and discovery cards use it. AD-12 binds it but does not say whether the function special-cases `thought_catcher` or callers do.
- Legacy generic-flow `in_progress` `thought_catcher` rows exist. The domain runtime cannot resume them, AD-14 forbids writing `in_progress`, and Practice still shows them as paused (`useExerciseEntryStatus.ts:27`). No rule says how they are shown or retired.
- Why sheet **Edit** "opens that entry". AD-12 makes the domain runtime the only editor, but it has no load-by-id path and no route param is fixed.
- The trap step's id in `completed_steps` / `current_step` is not fixed (`buildEntryPayload.ts:6-7` lists today's ids). AD-12's stated divergence is "different step ids".

### M9 — AD-12 removes the only writer of `PracticeCompletionV1` for Thought Catcher
The generic flow acknowledges the projection (`useExerciseFlowActions.ts:20`, `practiceCompletion.repo.ts:55`). The domain wizard does not. Once every entry point routes to the wizard, Insights observations (`insightObservation.repo.ts:78`) stop seeing Thought Catcher practice. The Deferred line calls `useExerciseMutation` "a named legacy path", but this is a regression against initiative AD-2/AD-3, not a neutral deferral. **Fix:** move it from Deferred to the "Conflict surfaced" block, or have the wizard's save call `acknowledgePracticeCompletion`.

### M10 — Client state the UX needs is missing from AD-22's list
AD-22 binds tone, ask-shown date, recall exclusions, draft, tone-card-seen. Not covered: garden growth last seen ("animates once, on the next visit"); Show Happi (Silence 10; no such setting exists in code); install date for `pickAskLine` and `d_install` (an existing key `@happy:retention_first_launch_date` in `useRetentionTracker.ts:9` uses a different style); the source for "three most-picked traps" and "three recent thoughts" (query vs cache).

### M11 — Onboarding AD-11 conflict is not surfaced
The spine surfaces onboarding AD-8 and AD-9. Onboarding AD-11 ("existing `JournalCalendarScreen` is preserved intact … No major UI redesigns may be applied to Home without explicit user review") also conflicts: Home is already `HomeContainer`, and AD-17 changes its bubble and button again. List it beside the XP and streak conflict.

### M12 — Several owned dimensions are neither decided nor deferred
See the dimension table below: privacy of local thought text, accessibility hooks, i18n namespace, rollout gate (clinician review), delivery of the monthly ask-line swap.

---

## Minor findings

1. **AD-21** names `pickAskLine` and `pickStems` but Binds also lists examples; no function or rule for "never the same twice running". `entryOrdinal`'s source is not stated. "No repeat within 3 days by construction" can break at the monthly pool swap.
2. **AD-13 + AD-19 precedence.** A rung-2 entry with `trap === 'none'` is both catch-only and hard. EXPERIENCE implies hard wins; the spine does not say.
3. **Deferred: Distressed.** "Until it ships, a not-okay band opens the existing help sheet" is a behaviour decision sitting under Deferred. The Low follow-up row, "I'm struggling" and the lapsed variant (M4, M5) are also unbuilt and not mentioned.
4. **Deferred: where rung 4 is offered.** The code offers it today from the summary (`ThoughtCatcherContainer.tsx:164`, `onGoDeeper`). EXPERIENCE bans an offer on the saved card. Say whether the builder removes it.
5. **Open item 5** (does a check-in alone place a leaf) is closed by AD-16 without saying so.
6. **Query-key convention** says "lower_snake_case … as today"; mood keys are kebab-case (`daily-moods`, `daily-emotions`). `["week_practice_days"]` is reused for a hook the Seed renames `useWeekShowedUp`; two hooks on one key with different shapes would corrupt the cache.
7. **Paradigm** says `home` "already uses" the domain shape; `src/domains/home/domain` does not exist.
8. **AD-2 widening.** AD-16 treats legacy `summary` and `checker_completed` as completed; initiative AD-2 says `status=completed`. Reasonable, but note it as an explicit reading.
9. **Haptics.** Hard entry uses soft impact (EXPERIENCE) against the inherited "`notificationAsync(Success)` on completion milestones"; AD-19 binds "haptic" without stating the exception.
10. **Parent stack drift.** Parents list Expo 56 / SDK 52 and Reanimated v3; this spine lists Expo 58 and Reanimated 4.7.1. This spine matches `package.json`; the parents are stale.

---

## Item 2 — Per-AD enforceability

| AD | Enforceable | Prevents its divergence | Note |
|---|---|---|---|
| AD-12 | Partly | Partly | Lint-checkable for writes; routing, legacy rows and edit path open (M8) |
| AD-13 | Yes | Yes | Pure function, table test. Says nothing for other exercise types (M1) |
| AD-14 | Partly | Partly | Needs client-generated id (M3); draft clear rule conflicts with offline (C1) |
| AD-15 | Yes | Partly | Enum mismatch with the cache (M6) |
| AD-16 | Partly | No, as written | No timestamp rule (C2); practice scope (M1); Day-0 gap (M2) |
| AD-17 | Partly | Partly | No input type; existing bubble sources not retired (M4) |
| AD-18 | Yes | Partly | Multi-row day undefined (M5) |
| AD-19 | Yes | Yes | Precedence with catch-only missing (minor 2) |
| AD-20 | Yes | Yes | Depends on M5 for "Low day". Guests without a Supabase user get no recall; acceptable but unstated |
| AD-21 | Yes | Mostly | Examples and ordinal source (minor 1) |
| AD-22 | Yes | Yes | List incomplete (M10) |
| AD-23 | Partly | Partly | Namespace not fixed; fallback order in non-English locales (see Review B) |
| AD-24 | Yes | Yes | A type-level property union makes the free-text ban compile-checked |

---

## Item 4 — Brownfield spot-check

| AD | Named thing | Exists | Behaves as the spine says |
|---|---|---|---|
| AD-12 | `src/domains/thoughtCatcher`, `src/exercises/thoughtCatcher/config.ts`, `buildExerciseRoute`, `/tabs/screens/thought-catcher` | Yes | Both runtimes write `thought_catcher` today, as claimed |
| AD-13 | `buildEntryPayload` writes catch-only as `completed` without fair fields | Yes (`buildEntryPayload.ts:17-27`) | Yes |
| AD-14 | "the AsyncStorage draft" | **No** | Draft is `useState` only; leaving discards it (`ThoughtCatcherContainer.tsx:24,114`) |
| AD-15 | `ThoughtCatcherResponse`, `CognitiveDistortionKey`, `ReflectionData.trap` | Yes | `ReflectionData.trap` is `TrapType`, not `CognitiveDistortionKey` |
| AD-16 | `happy.reflections`, legacy statuses, `in_progress` | Yes | Yes; Home counts from the local store today |
| AD-17 | `src/domains/home/domain`, `HomeContainer` | Domain dir **no**; container yes | — |
| AD-18 | `useEmotionLogger`, `moods.mood_score` 1–5 | Yes (`hooks/data/`) | Yes; five chips in `MoodCheckInView.tsx:9-15` |
| AD-20 | `coping_cards` | Yes | Wizard writes it; nothing reads it for recall |
| AD-22 | `@happy/` prefix | Yes | No existing key uses `@happy/<name>_v1`; new pattern |
| AD-24 | PostHog | Yes | Call sites use `usePostHog()`; a singleton exists at `src/config/posthog.ts:24` |
| Deferred | `crisisActive` hardwired false | Yes (`HomeContainer.tsx:96`) | Yes |
| Deferred | `daily.service.ts` has no status filter | Yes | Yes |
| Deferred | `completed_at` reset | Yes (`useExerciseMutation.ts:56-58`) | Yes |

---

## Item 5 — EXPERIENCE coverage

### Component Patterns

| Row | Governed by | Gap |
|---|---|---|
| Ask bubble | AD-17, AD-21, AD-22 (ask-shown date) | Session cap owner (M4) |
| Home button | AD-17, AD-23 | — |
| Check-in chips | AD-18; Deferred (chip labels, Distressed) | Low follow-up row not mentioned |
| Thought field (recent-thought chips) | **No home** | Source of recent thoughts |
| Trap chips | AD-15 | **No home** for "three most-picked" source and standard order |
| Trap definition | AD-23 | — |
| Step-up row | AD-14 | "Not shown after None" is implied by AD-19 only |
| Stems | AD-21 | Ordinal source |
| Recall chip | AD-20, AD-22 | Depends on M5 |
| Why sheet | AD-20 (Forget) | **No home** for Edit path (M8) |
| Belief scale | Conventions (0–10) | Open item 6 has no Deferred line |
| Saved card | AD-13, AD-19 | Component home crosses domains (M7) |
| Week leaf | AD-16 | Timestamp (C2) |
| Garden | AD-16 | Scope (M1); "animates once" marker (M10) |
| Tone card | AD-17, AD-22, AD-23 | Not in resolver return shape (M4) |

### Effort-ladder rules

| Rule | Governed by |
|---|---|
| 1 Rung 1 shows up, 2–4 practice | AD-16 (scope gap M1) |
| 2 Leaving keeps highest finished rung; rest resumable | AD-14 |
| 3 Step up once; no rung-4 offer on saved card | AD-14; Deferred (minor 4) |
| 4 Low day → hard-entry card | AD-18, AD-19 |
| 5 Not okay / struggling → no ladder | Deferred (Distressed) |
| 6 Example differs from what was written | **No home** (copy rule; AD-21 covers rotation only) |

### Saved-card variants

| Variant | Governed by | Gap |
|---|---|---|
| Standard | AD-13 | — |
| Catch-only | AD-13 | Precedence vs hard |
| Hard entry | AD-19 | Breathing/help pill are UI; fine |
| Milestone (day 7, 15) | **No home** | Base spine owns it; which count and day source after AD-16 is unstated |

### Home modifiers

| # | Governed by | Gap |
|---|---|---|
| M1 night | AD-17 | Existing `useHomeScene` night is 19:00–05:59 |
| M2 saved today | AD-17 | Source of "saved today" |
| M3 paused | AD-17, AD-14 | — |
| M4 Low | AD-17, AD-18 | Low follow-up row unbuilt, not deferred |
| M5 lapsed / post-return | AD-17 | Lapsed variant unbuilt, not deferred; gap source unnamed |
| M6 default | AD-17, AD-21 | Install-day source (M10) |

### State Patterns with no home
Offline and save-fails rows (C1); "Practice data fails to load" (no rule on error vs baseline); "Show Happi off" (M10); "Keyboard open" (exists in code, UI-level, acceptable).

### Silence rules

| # | Rule | Governed by |
|---|---|---|
| 1 | Thought saved today | AD-17 |
| 2 | Any entry is saved | AD-19 (card receives variant; no bubble) |
| 3 | Chip Low / Not okay / struggling | AD-17, AD-18 |
| 4 | Help or crisis sheet open, rest of session | **No home** |
| 5 | Keyboard open | UI-level; no AD needed |
| 6 | 22:00–04:59 | AD-17 |
| 7 | Three bubbles this session | **No home** |
| 8 | On My Log, Practice, chart, paywall, Account, permission | **No home** (structural; state it once) |
| 9 | Declined step up | AD-14 |
| 10 | Show Happi off | **No home** |
| 11 | Only generic praise available | Copy rule; AD-23 |

### Rotation table

| Row | Governed by |
|---|---|
| Stems per entry | AD-21 |
| Example per entry | AD-21 binds it, no rule |
| Ask line daily from day 6 | AD-21 |
| Monthly swap of four lines | **No home**: needs an app release or remote copy; neither decided |

### Open Items

| # | Item | Home in spine |
|---|---|---|
| 1 | Catch-only completion | AD-13 (closed) |
| 2 | Clinician review | **None** (release gate) |
| 3 | Copy tables | AD-23 gives structure; content open, not listed |
| 4 | Rig parameters | None (design; acceptable) |
| 5 | Check-in leaf | AD-16 (closed silently) |
| 6 | BeliefScale steps vs slider | Conventions only; not deferred |
| 7 | XP metadata | Conflict block; `config.ts:39` still carries `xp: 10` |
| 8 | Where rung 4 is offered | Deferred |
| 9 | Placeholder mock copy | None (acceptable) |
| 10 | Stale base mock | None (acceptable) |

---

## Item 6 — Parent AD consistency

### Initiative spine

| Parent AD | Consistent | Note |
|---|---|---|
| AD-1 identity | Consistent, silent | When anonymous sign-in is disabled there is no user and no row; counts stay 0. Not addressed |
| AD-2 canonical model | Mostly | Keeps `exercise_entries` completed as the source; widens to legacy statuses; `PracticeCompletionV1` regressed (M9) |
| AD-3 one write path | Weakened | Uses the legacy path; no idempotency key (M3) |
| AD-4 StarterPath | Not addressed | Home's button is now the ask, not `next_action`; say so |
| AD-5 evidence ladder | Consistent | No pattern claims added |
| AD-6 deterministic insights | Consistent | — |
| AD-7 privacy | Consistent | AD-20, AD-24. Local plaintext storage not covered (dimension gap) |
| AD-8 saved vs unsynced | Restated correctly, not implemented | C1 |
| AD-9 dependency direction | Restated more strictly than code | M7 |

### Onboarding spine

| Parent AD | Consistent | Note |
|---|---|---|
| AD-7 seven-step sequence | Not touched | — |
| AD-8 XP on micro-win | Conflict surfaced | Correctly left to that altitude |
| AD-9 streak capsule | Conflict surfaced | Same |
| AD-10 soft paywall | Not touched | — |
| AD-11 Home preservation | **Conflict not surfaced** | M11 |
| Conventions (haptics, buttons, NativeWind) | Inherited | Hard-entry haptic exception unstated |

The XP/streak conflict is handled the right way: named, not overridden, no XP or streak added here.

---

## Item 7 — Dimensions

| Dimension | State | Note |
|---|---|---|
| Data | Decided | AD-13, 15, 16, 18 |
| State mutation | Decided, with gaps | AD-14; idempotency (M3) |
| Caching / invalidation | Decided | Conventions row; key reuse risk (minor 6) |
| Offline | **Undecided** | C1 |
| Privacy | Partly | Analytics covered. Thought text in plaintext AsyncStorage (draft, `happy.reflections`), and clearing on sign-out or account deletion, not decided |
| Analytics | Decided | AD-24 |
| i18n | Partly | AD-23; namespace and non-English fallback open |
| Accessibility hooks | **Absent** | EXPERIENCE has eight floor rules; the spine has none, e.g. where the VoiceOver label for the button and "read once" state live |
| Testing | Thin | One Jest test per domain rule. No test exists in the repo today; resolver + container integration untested; `npm test` is `jest --watchAll` |
| Rollout | Deferred (flags) | Clinician review gate (Open item 2) absent |
| Operations | Deferred to parent | Fine: no migration, function or secret |

---

## Item 8 — Mermaid diagrams

Both parse on reading (not rendered; no mermaid CLI available here). Node ids are unique, edge labels are well formed, shapes `[]`, `[()]`, `{}` are valid, no reserved word is used as an id.

**Diagram 1 (layers).** Semantic problems, not syntax:
- `P --> C` reads as "presentation imports containers". In the repo containers import views. Label the edges or reverse them.
- `D -.->|types only| R` reads as "domain imports data". The intended direction is data importing domain types.
- `Ex -.->|never imports| Home` draws an edge to say there is none.

A reader cannot learn from it: where copy tables and i18n sit; that `useEmotionLogger` lives outside `src/domains`; the onboarding dependency for the Happi rig and saved card; where `loggingEvents` and PostHog sit; that `happy.reflections` is a cache fed on save.

**Diagram 2 (save flow).** A reader cannot learn from it: the rung-1 write to `moods`; rung 4; that a catch-only entry can also be a hard entry (hard appears only after rung 3); the "None" path skipping the step up; the failed or offline save; the `happy.reflections` cache write; draft clearing; the recall read; cache invalidation.
