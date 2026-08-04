# Sleep Reset Unit 1 V1 Implementation Report

Date: 2026-07-30
Scope: Unit 1 only, `u1_1_sleep_mechanics`
Status: Implemented in mock data only

## Why This Change Exists

The earlier production audit rejected the old Sleep Reset learning experience because it looked like a course, but did not prove learning well enough.

Main problems from the earlier report:

- Too many passive or recognition-only exercises.
- Teaching cards became reading, not practice.
- Several answers were too obvious.
- Some copy overclaimed, such as treating clock time as proof of a sleep stage.
- Reflection felt like homework for tired users.
- Completion could look like mastery even when the learner skipped or needed heavy support.
- A later curriculum decision found that stage-first Unit 1 was still not the best first value for anxious or tired users.
- Unit 1 now leads with sleep pressure, body clock, and arousal instead of N1/N2/N3/REM labels.

For mental-health psychoeducation, the fix is not more content. The fix is smaller, calmer, more useful practice.

## What Was Implemented

Unit 1 now uses a short shared V1 loop:

`Answer -> Check -> teaching feedback -> retry/support or continue`

Active Unit 1 now has:

- 4 lessons
- 20 total exercises
- 5 exercises per lesson
- Stable concepts:
  - `sleep_pressure`
  - `body_clock`
  - `arousal`
  - `self_blame_reframe`
  - `tiny_reset_cue`
- Only V1 release exercise types:
  - `guided_recall`
  - `close_discrimination`
  - `scenario_why`

Legacy Unit 1 exercise types are filtered out at runtime:

- `learn_cards`
- `matching`
- `ordering`
- `fill_in_the_blank`
- `slider_rating`
- `rating_check`
- `multiple_choice`
- `true_false`
- `guided_response`
- `free_text`
- old `scenario`

## Files Changed

- `src/data/mock/sleep-reset-unit1-v1.ts`
  - New config-driven Unit 1 V1 exercises.

- `src/data/mock/sleep-reset-flat.ts`
  - Imports the new Unit 1 V1 exercise set.
  - Filters old Unit 1 exercise objects out of the exported mock course.
  - Updates Unit 1 lesson estimates to bite-size lengths.

- `src/components/exercise/DiscriminationCategoryEngine.tsx`
  - Adds `acceptAnyOption` for low-pressure reflection/action choice screens.

## Learner Experience

Each screen now gives the learner one small task.

The learner sees:

1. Progress, such as `2 of 5`.
2. One short prompt.
3. One tap or short reconstruction action.
4. Disabled `Check` until they answer.
5. A short teaching response after checking.
6. A calm next step: `Continue`, `Try again`, `Make easier`, or `Skip for now`.

This is closer to Duolingo's microlearning rhythm, but adapted for mental health. It avoids lives, timers, streak pressure, and shame.

## Lesson Map

Lesson 1: Three Sleep Levers

- Teaches the three useful first levers: sleep pressure, body clock, and arousal.
- Corrects the idea that sleep is a willpower test.
- Adds a safe scenario: a hard night can come from shifting body levers, not personal failure.
- Ends with a personal worry choice, not a written journal task.

Lesson 2: Sleep Pressure

- Teaches sleep pressure as sleepiness that builds during awake time.
- Builds the pressure loop: awake time, pressure builds, sleep, pressure releases.
- Uses a nap scenario to show pressure can change without blame.
- Corrects the idea that forcing sleep is the safest response.

Lesson 3: Body Clock Cues

- Teaches wake time and light as body-clock cues.
- Builds the cue chain: morning cue, body clock, sleep timing.
- Uses a weekend wake-time scenario without blaming the user.
- Corrects guarantees and rigid sleep rules.

Lesson 4: Arousal Reset

- Teaches arousal as body activation, not failure.
- Builds the effort-arousal loop: try harder, body alerts, sleep feels harder.
- Uses a clock-checking scenario to show why forcing sleep can backfire.
- Teaches a tiny reset: pause, soften effort, choose one small cue.
- Ends with one low-pressure next step.

## Safety Decisions

The new flow avoids:

- `You are broken`
- `This is 100% normal`
- `Clock time proves REM`
- `Wake time fixes everything`
- `You must perfectly control your sleep`
- `Sleep is a willpower score`
- `One cue guarantees sleep tonight`

The new flow uses bounded language:

- `often`
- `can`
- `suggest`
- `one night does not prove`
- `if it affects your day, consider support`
- `may`
- `over time`

## Telemetry Meaning

Completion is not treated as mastery.

The runtime now captures and passes mock evidence for:

- `independent_complete`
- `supported_complete`
- `skipped`
- concept
- category
- support used
- attempt count
- misconception code when present
- retry variant id when present
- time to first answer
- time to resolution

Node completion now receives those responses in the mock path and stores them in an in-memory mock learning evidence store. Useful mastery evidence should still come from repeated independent or lightly supported answers across time, not from finishing the lesson once.

## Verification

Observed checks:

- Runtime import with Bun found exactly 20 active Unit 1 exercises.
- Unit 1 active types were only `close_discrimination`, `guided_recall`, and `scenario_why`.
- Each of the 4 Unit 1 lessons had exactly 5 active exercises.
- Mock completion receives response evidence instead of discarding it.
- `git diff --check` passed.
- Touched component/helper files stayed under the 300-line repo rule.

TypeScript note:

- `npm run tsc` does not exist in this repo.
- `node_modules/.bin/tsc --noEmit` still fails because of existing unrelated repo errors.
- No TypeScript output mentioned the touched files.

## Remaining V1 Gaps

- No Supabase persistence yet by request.
- No delayed spaced-review scheduling wired into course completion yet.
- No production analytics event sink yet; current evidence store is mock-only and in-memory.
- No simulator visual QA was run for this documentation update.
