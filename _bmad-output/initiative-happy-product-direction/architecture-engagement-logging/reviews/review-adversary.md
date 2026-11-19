# Adversarial review — Architecture Spine: Happy Engagement & Logging

Reviewed: `../architecture-engagement-logging.md` (AD-12..AD-24) against `../../ux-engagement-logging/EXPERIENCE.md` and the code at repo root. Date: 2026-11-15. Read-only; no code was run.

**Verdict:** the spine fixes names and owners well, but it does not fix identity, time, or count membership. Two builders can obey every AD and still ship duplicate rows, a ring that disagrees with the garden, and a Home state (M3) that can never be reached.

**Counts:** critical 4 · high 8 · medium 7 · low 3 (22 holes).

Answers to the six directed checks:

| # | Question | Answer | Hole |
|---|---|---|---|
| 1 | Does an upsert without `id` create a new row each time? | Yes. `useExerciseMutation` sets `row.id` only when an id is passed, and nothing in `ThoughtCatcherContainer` keeps the returned id | H-01 |
| 2 | What does `saveThoughtCatcherReflection` write, and is Home's recall card consistent under AD-16? | It appends an id-less `ReflectionData` with no `trap` and `fair: ''` for a catch. Under AD-14 one sitting appends twice; under AD-16 Home's count and its card come from different stores | H-05, H-06 |
| 3 | Do other readers of `status` / `completed_steps` break on a rung-2 row? | No reader breaks on `status`. `completed_steps` is read only by the generic flow. Three insight readers misread a rung-2 row's missing `postIntensity` / `balancedThought` | H-14 |
| 4 | Do guests have a user id? | Yes when anonymous sign-in is enabled (`signInAnonymously`). When it is disabled the session is null and every write throws and is swallowed | H-07 |
| 5 | Do `moods` rows have a usable local date? | Only a UTC instant in a nullable `selected_date`; no local-day column. Several rows per day are allowed, so "today's band" is undefined | H-03, H-09 |
| 6 | Does `CognitiveDistortionKey` exist? | Yes, `src/screens/ThoughtReframingScreen/types.ts:25`, re-exported by `src/types/exerciseFlow.ts:12-27`. Its values differ from `TrapType`, which `ReflectionData.trap` uses | H-10 |

---

## Critical

### H-01 — The row id for the rung upgrade has no owner (critical)

- **Units:** A "trap step + rung-2 write" · B "step-up row + rung-3 save".
- **Divergence:** AD-14 says rung 3 "upserts the same `id`" but never says where the id comes from or where it lives between the two writes. A calls `save(payload)` and drops the result, as today. B calls `save(payload, id)` and has no id, so it inserts a second completed row. If A keeps the id in React state, an app kill after the first acknowledgement loses it and the resumed draft inserts again. If the user taps the step-up and saves before the first upsert returns, B has no id either. Re-answering the trap after Back writes a third row.
- **Evidence:** `src/hooks/useExerciseMutation.ts:50-53` (id added only if passed), `:60-64` (plain `upsert`, conflict on primary key only); `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx:88` (`await save(buildEntryPayload(draft))`, result ignored); `src/domains/thoughtCatcher/domain/types.ts:5-15` (draft has no `entryId`); `database.types.ts:441` (`id?: string` on insert).
- **Proposed rule (tighten AD-14):** The Thought Catcher runtime generates the entry UUID on the client when the sitting starts, stores it in the draft before the first write, and passes it on every write for that sitting. A write without that id is forbidden in `src/domains/thoughtCatcher`.

### H-02 — AD-14 makes Home modifier M3 unreachable, against Flow 1 (critical)

- **Units:** A "Thought Catcher save and draft" · B "`resolveHomeAsk` modifiers".
- **Divergence:** AD-14 writes a completed rung-2 row at the trap step, so every paused rung-3 draft coexists with "a thought was saved today". EXPERIENCE applies the first matching modifier, and M2 (saved today) precedes M3 (paused). B, following the table, never returns "Continue · about 1 min"; Flow 1's failure path requires it. AD-14 also clears the draft "when its local day ends", so M3 cannot fire the next day either. A builder who reads Flow 1 instead puts M3 first, and now M2's "Catch another one" disappears whenever a draft exists.
- **Evidence:** spine AD-14 and AD-17; `EXPERIENCE.md:134-143` (modifier order, "Low with a thought saved today is M2"), `:246` ("Leaving at step 6 keeps the catch; next open shows Continue").
- **Proposed rule (new, under AD-17):** State the resolver's input precisely: `pausedDraft` wins over `savedToday` when the draft's entry id equals today's newest saved entry; otherwise M2 applies. Record this as a deliberate amendment to the EXPERIENCE order.

### H-03 — "Local day" has four candidate columns and no chosen one (critical)

- **Units:** A "Home ring + lifetime count" · B "week leaf + garden" · C "recall eligibility".
- **Divergence:** `exercise_entries` carries `created_at` (server UTC), `completed_at` (device clock, reset on every completed upsert), `selected_date` (local `YYYY-MM-DD` at save) and `updated_at`. The Conventions row says only "device timezone". A buckets by `completed_at`, B by `created_at`, C by `selected_date`. A catch at Sunday 23:58 upgraded at Monday 00:01 lands in different weeks for A and B. The Deferred note "counts dedupe by row id" does not answer which week a row belongs to. Travel across timezones re-buckets every past entry for a builder who converts instants and leaves them fixed for one who uses `selected_date`.
- **Evidence:** `useExerciseMutation.ts:56-58` (`completed_at = now` on each completed upsert); `buildEntryPayload.ts:9-10,33` (local `ymd`); `useWeekPracticeDays.ts:18-23,29` (`created_at`); `useExerciseStats.ts:95` (`completed_at >= weekStart`); `useExerciseStats.ts:28-36` (streak slices UTC date strings).
- **Proposed rule (new AD):** An entry's local day is `selected_date`, written once at the first write and never changed by an upgrade or edit. Every count, leaf, "saved today" and Low-day rule buckets on it; `completed_at` and `created_at` are never used for day or week membership.

### H-04 — "Practice count" membership is undefined for the other 13 exercise types (critical)

- **Units:** A "Home weekly ring" · B "Practice garden and stats".
- **Divergence:** AD-16 says counts derive from every completed `exercise_entries` row. AD-13 defines `entryRung` for three cases only. EXPERIENCE says rungs 2–4 fill the ring and grow the garden. A filters `entryRung(e) >= 2`, so a completed `box_breathing` row is not practice. B follows AD-16 literally and counts it. "Wind down · 1 min" (M1) and Mara's "Breathe for a minute" on a Low day then move B's numbers but not A's, and Mara's Low day gains a practice she was promised it would not.
- **Evidence:** spine AD-13 and AD-16; `EXPERIENCE.md:108` (rule 1), `:92` (garden "rungs 2–4 only"), `:252` (Flow 2: "counts as showing up"); `src/types/exerciseFlow.ts:485-499` (15 exercise types); `useCBTHistory.ts:78-83` (current lifetime count, all types).
- **Proposed rule (tighten AD-13 and AD-16):** `entryRung` is total: it returns 1–4 or `null`, and the spine states whether a completed non-ladder exercise is practice. One exported predicate `countsAsPractice(entry)` is the only filter any count, ring, garden or tone-card trigger uses.

---

## High

### H-05 — Two saves per sitting append two local reflections (high)

- **Units:** A "trap step write" · B "Home 'mine' card".
- **Divergence:** AD-16 keeps `happy.reflections` as a recall and offline cache but names no key for it. `appendReflection` is append-only and `ReflectionData` has no entry id. A, mirroring today's `finish`, appends at the rung-2 write and again at the rung-3 write. B's card then shows either the catch or the fair version depending on which landed last, and any builder who still reads `getReflectionCount` sees two.
- **Evidence:** `src/domains/home/data/reflectionsStorage.ts:21-29` (push, no id); `src/domains/thoughtCatcher/data/saveReflection.ts:9-23`; `src/domains/onboarding/domain/types.ts:36-49` (no id field); `ThoughtCatcherContainer.tsx:88-89`.
- **Proposed rule (new, under AD-16):** The local cache is keyed by entry id and written by replace, by one function in `src/domains/home/data`, called once per acknowledged or queued write.

### H-06 — Onboarding's first reflection is not an `exercise_entries` row (high)

- **Units:** A "counts hook (AD-16)" · B "Home first-visit state".
- **Divergence:** `completeOnboarding` writes the micro-win only to AsyncStorage. After AD-16, A's lifetime count is 0 on first Home while B's bubble says "You caught your first one!" and the card shows that reflection. Tone-card eligibility ("third saved rung 2–4 entry") and Day-7 milestones are off by one depending on who counts it.
- **Evidence:** `src/domains/onboarding/data/onboardingRepository.ts:11-28` (no `exercise_entries` write); `useHomeScene.ts:36-38`; `HomeContainer.tsx:49-52,155-156`.
- **Proposed rule (new):** State whether the onboarding reflection counts. If it does, onboarding completion writes one completed `thought_catcher` row through the AD-12 runtime's data function; if not, Home's first-visit copy must not imply a count.

### H-07 — Offline and guest saves have no assigned mechanism (high)

- **Units:** A "saved card" · B "Home ring".
- **Divergence:** EXPERIENCE says offline saves locally and shows the card "as normal"; Flow 1's climax has the ring move. Inherited AD-8 says unsynced work never counts. AD-16 counts Supabase rows only. A shows the card with a ring tick from local state; B's ring does not move. Nobody is assigned the unsynced queue, its replay, or what "queued" means: today a failed save is swallowed and the user is routed back as if it worked. With anonymous sign-in disabled the user is null, every save throws, and the user never has a count.
- **Evidence:** `ThoughtCatcherContainer.tsx:87-88` (catch swallows, comment "guest or offline"); `useExerciseMutation.ts:33-35` (throws without user); `src/context/AuthContext.tsx:211-224` (anonymous sign-in, null session if disabled); `EXPERIENCE.md:151-152,246`; spine Conventions "Errors".
- **Proposed rule (new AD):** One outbox in `src/domains/exercises/data` holds unsynced entry payloads keyed by entry id and replays them through `useExerciseMutation`. The saved card reads an explicit `synced | queued` flag; the hard-entry and catch-only cards never animate the ring when `queued`.

### H-08 — Editing an old entry moves it into this week (high)

- **Units:** A "why sheet → Edit" · B "weekly ring".
- **Divergence:** Edit "opens that entry". AD-12 makes the domain runtime the only editor, so A upserts the old id with `status: 'completed'`. The mutation resets `completed_at` to now. B, bucketing by `completed_at` (as `useExerciseStats` does today), counts a three-week-old entry as this week's practice and the ring advances. The spine's Deferred note accepts the reset only for a same-sitting upgrade.
- **Evidence:** `useExerciseMutation.ts:56-58`; `useExerciseStats.ts:95`; `EXPERIENCE.md:88`.
- **Proposed rule (tighten AD-14):** `completed_at` is set only on the first completed write of a row; the mutation omits it when an id is passed. Combined with H-03 this removes the edit-inflates-ring path.

### H-09 — "Today's band" is undefined when several moods exist (high)

- **Units:** A "`isHardEntry` / saved card" · B "`resolveHomeAsk` M4" · C "recall exclusion".
- **Divergence:** The check-in inserts a new `moods` row on every tap with no cooldown. Journal saves and bulk import also insert `moods` rows. A uses the latest row, B uses the lowest (what the chip restore does today), C uses "any low row that local day". A Good-then-Low day gives a Standard card for A and no ask bubble for B. C's rule also needs the user's entire mood history joined by local day, and no unit is assigned to fetch it. A mood logged at 21:00 retroactively excludes a 09:00 fair thought for C but not for a builder who reads "did not come from a Low session".
- **Evidence:** `hooks/data/useEmotionLogger.tsx:101-108` (insert per tap), `:211` (cooldown disabled); `src/domains/home/ui/presentation/views/MoodCheckInView.tsx:27-30` (first match in ascending order, so the lowest); `hooks/post/useSaveJournal.ts:114-118`; `database.types.ts:850-851` (`mood_score`, `selected_date` nullable); `EXPERIENCE.md:87`.
- **Proposed rule (tighten AD-18, AD-20):** `bandForDay(moods, localDay)` in `src/domains/exercises/domain` is the single definition: the latest `emotion_logger` row of that local day. Recall exclusion uses the band at the time of the save, stored nowhere, so AD-20 must instead say which historical mood query supplies it and who owns that repo function.

### H-10 — `trap` has two enums under one name (high)

- **Units:** A "trap chips + `buildEntryPayload`" · B "Home card + most-picked order".
- **Divergence:** AD-15 says `trap` is "the same name `ReflectionData` already uses". The name matches; the values do not. `ReflectionData.trap` is `TrapType` (7 values, `'should'`). `CognitiveDistortionKey` has 10 values with `'should_statements'`, plus the two escapes. B's `TRAP_LABELS: Record<TrapType, string>` has no label for `personalizing`, `filtering`, `emotional_reasoning`, `should_statements`, `not_sure` or `none`. "Three most-picked traps" is also unsourced: `thought_catcher.trap` only, or also `thought_reframing.selectedDistortions` and onboarding's local `trap`.
- **Evidence:** `src/screens/ThoughtReframingScreen/types.ts:25-35`; `src/domains/onboarding/domain/enums.ts:10-18`; `src/domains/home/ui/presentation/views/ReflectionsSection.tsx:7-15`; `saveReflection.ts:3` ("trap stays undefined").
- **Proposed rule (tighten AD-15):** One exported `TrapChoice` type and one label table live in `src/domains/exercises/domain`; `TrapType` maps into it by a named function. Most-picked order is computed from completed `thought_catcher` rows' `trap` only, excluding the two escapes.

### H-11 — The counts hook has no query key and Home never refetches (high)

- **Units:** A "`usePracticeCounts`" · B "Home container".
- **Divergence:** The Invalidation row names `["week_practice_days"]` only. `usePracticeCounts` and `useWeekShowedUp` have no named key, and `useExerciseMutation`'s list does not include one. A picks `["practice_counts", user?.id]`; nothing invalidates it. If A reuses `["exercise_stats"]`, it inherits a 5-minute `staleTime` and `.eq("status","completed")`, which drops the legacy statuses AD-16 says to include. Home today loads counts once on mount with `useState`; returning from the flow with `router.back()` does not remount it, so M2 and the ring stay stale. The mood-log invalidation must be added to a legacy hook outside any domain, and no unit owns that edit.
- **Evidence:** `useExerciseMutation.ts:72-83`; `HomeContainer.tsx:48-64` (mount-only effect; no `useFocusEffect` in `src/domains/home`); `useExerciseStats.ts:75,109`; `useEmotionLogger.tsx:166-188` (no `week_practice_days`).
- **Proposed rule (tighten Conventions):** Name the keys: `["practice_counts", userId]` and `["week_showed_up", userId]`. `useExerciseMutation` and `useEmotionLogger` invalidate both; Home reads them through the hooks, never through local state.

### H-12 — The week leaf's window and filter contradict the current hook (high)

- **Units:** A "week leaf (My Log)" · B "Home weekly ring".
- **Divergence:** The ring "refills Monday". The existing leaf hook is a rolling last-7-days window on `created_at` with no status filter, so an `in_progress` fear-ladder row fills a leaf, which AD-16 forbids. AD-16 does not say whether the leaf strip is Monday–Sunday or rolling, and `entryCount` from the same hook feeds other screens. A rewrites the hook to Monday-based; B's Practice mood chart (`useMoodWeek`) still expects day offsets 0–6.
- **Evidence:** `useWeekPracticeDays.ts:18-32`; `src/hooks/insights/useMoodWeek.ts:15-23`; `reflectionsStorage.ts:35-42` (Monday start); `EXPERIENCE.md:91,156`.
- **Proposed rule (tighten AD-16):** State the leaf window (Monday–Sunday local, same as the ring) and that `useWeekShowedUp` replaces `useWeekPracticeDays`, with the status filter and the `moods` union, as one ticket.

---

## Medium

### H-13 — `postIntensity` defaults to `intensity`, so a skipped rating is a hard entry (medium)

- **Units:** A "`buildEntryPayload`" · B "`isHardEntry`".
- **Divergence:** For a checked entry the payload writes `postIntensity: draft.post ?? draft.intensity`. B's rule "`postIntensity >= intensity` when both exist" is then true for anyone who did not move the second slider, and they get "That sounds hard." A builder computing from the draft (`post === null`) gets Standard.
- **Evidence:** `buildEntryPayload.ts:18`; `ThoughtCatcherContainer.tsx:39`.
- **Proposed rule (tighten AD-19):** `isHardEntry` takes the draft's raw `post` (nullable); the payload omits `postIntensity` when the after-rating was not set.

### H-14 — Insight readers misread a rung-2 row (medium)

- **Units:** A "rung-2 write" · B "Practice insights".
- **Divergence:** No reader breaks on `status`. Three readers treat a row with no fair thought as a full one: belief decay records post = pre ("no change") for every catch; the recommendation rule counts catches as "only does catchers"; the timeline labels an empty expanded text "Balanced Reframe". Catches become the most common row, so these skew.
- **Evidence:** `src/hooks/insights/useBeliefDecay.ts:82-92`; `src/hooks/insights/useExerciseRecommendation.ts:94-98`; `src/screens/ExercisesScreen/hooks/useExerciseTimeline.ts:92-98`; `src/screens/ExercisesScreen/config/ratingExtractors.ts:28-32`.
- **Proposed rule (new, under AD-13):** Readers that compare before and after skip entries where `entryRung(e) < 3`; list the three files as in scope.

### H-15 — Step ids for the trap step are unspecified (medium)

- **Units:** A "trap step payload" · B "read-only history render (generic config)".
- **Divergence:** AD-12 exists to stop two step-id sets, yet no AD names the rung-2 row's `current_step`, `completed_steps` or `step_index`. A adds `'trap'`; the read-only generic config has no such step and resolves `current_step` to nothing. Another builder keeps `catcher_summary` and the row claims a summary step that was never shown.
- **Evidence:** `buildEntryPayload.ts:6-7,28-30`; `src/exercises/thoughtCatcher/config.ts:198,288`; `src/hooks/useExerciseFlow.ts:68-69`.
- **Proposed rule (tighten AD-14):** Fix the two step lists in the spine, e.g. rung 2 ends at `catcher_summary` and `trap` is not a step id.

### H-16 — Entry points still route to the generic flow (medium)

- **Units:** A "Lessons / resume routing" · B "assistant and starter path".
- **Divergence:** AD-12 says every entry point routes to `/tabs/screens/thought-catcher`, but `buildExerciseRoute('thought_catcher')` returns the generic route and at least two other callers hardcode it. A patches Lessons; the assistant keeps writing through the generic flow, which can write `in_progress` rows AD-14 forbids.
- **Evidence:** `src/screens/ExercisesScreen/exerciseScreenUtils.ts:56-66`; `src/components/happy-assistant/constants.ts:24-25`; `src/domains/journey/model/starterPath.ts:80-85`; `src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts:92`.
- **Proposed rule (tighten AD-12):** `buildExerciseRoute` is the single redirect point for `thought_catcher` writes; `readOnly` or `entryId` keeps the generic route. Hardcoded route strings for this type are removed.

### H-17 — One sitting emits two "saved" events (medium)

- **Units:** A "rung-2 event" · B "rung-3 event and dashboards".
- **Divergence:** The primary measure is completed entries per rung. With AD-14 a rung-3 sitting produces a rung-2 save and then a rung-3 save. A emits at each durable write; B emits at the saved card. Rung-2 counts differ by the whole rung-3 population.
- **Evidence:** spine AD-14, AD-24; `EXPERIENCE.md:279`.
- **Proposed rule (tighten AD-24):** One `entry_saved` event per sitting, emitted when the saved card is shown, carrying the final rung and the entry id. The intermediate write emits nothing.

### H-18 — Abandoning before the trap step is ungoverned (medium)

- **Units:** A "draft adapter" · B "close handling".
- **Divergence:** AD-14 says the draft holds "unfinished rung-3 input". EXPERIENCE says leaving midway keeps the highest finished rung and "the rest is resumable". Today closing shows a discard alert. A persists the draft from the first keystroke; B keeps the alert and discards. Whether a pre-trap draft triggers M3 is then different per builder.
- **Evidence:** `ThoughtCatcherContainer.tsx:112-118`; `EXPERIENCE.md:109`.
- **Proposed rule (tighten AD-14):** State that a draft exists only after the rung-2 write; before it, leaving discards.

### H-19 — Session and day state for silence rules has no owner (medium)

- **Units:** A "ask bubble" · B "mood reply bubble / return greeting".
- **Divergence:** "3 per session", "1 per screen", "declined the step up" and "help sheet open for the rest of the session" need shared session state. AD-21 stores only the ask-shown date. `HomeContainer` already sets a bubble from the mood tap through local state, outside any resolver. A counts bubbles in the resolver's inputs; B keeps `bubbleOverride`. Two bubbles can show.
- **Evidence:** `HomeContainer.tsx:40-46,154`; `MoodCheckInView.tsx:34-38`; `EXPERIENCE.md:79,186-198`.
- **Proposed rule (tighten AD-17):** Every Home bubble, including the mood reply, is returned by `resolveHomeAsk`; session counters are an explicit input owned by one container hook.

---

## Low

### H-20 — "With `balancedThought`" means present or non-empty (low)

- **Units:** A "`entryRung`" · B "recall eligibility".
- **Divergence:** AD-13 says "with `balancedThought`"; AD-20 says "non-empty". Legacy generic-flow rows can carry an empty string. A treats `''` as rung 3; B excludes it.
- **Evidence:** spine AD-13, AD-20; `src/exercises/thoughtCatcher/config.ts:19` (initial response with optional fields).
- **Proposed rule:** `entryRung` uses trimmed non-empty.

### H-21 — Recent-thought chips and "saved today" have no stated source (low)

- **Units:** A "thought field chips" · B "M2 saved-today".
- **Divergence:** Both can read `happy.reflections` (works offline, includes onboarding) or Supabase rows (authoritative). AD-16 covers counts only.
- **Evidence:** `EXPERIENCE.md:82,137`; `reflectionsStorage.ts:51-54`.
- **Proposed rule:** Name the source for each: both read the id-keyed local cache from H-05.

### H-22 — Rotation inputs are not defined (low)

- **Units:** A "`pickStems`" · B "`pickAskLine`".
- **Divergence:** `entryOrdinal` could be lifetime completed count, rung-3 count, or local cache length; it changes when a queued row syncs. `installDate` has no stored source. The monthly pool swap is not a function of the arguments AD-21 lists.
- **Evidence:** spine AD-21; `EXPERIENCE.md:204-209`.
- **Proposed rule:** `entryOrdinal` is the count of completed rung-3 `thought_catcher` rows before this sitting; `installDate` comes from one named pref key.
