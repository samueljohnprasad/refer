# Sleep Reset Unit 1 Redesigned Learner Flow

Date: 2026-07-30
Scope: Unit 1 only, `u1_1_sleep_mechanics`
Decision: Replace long recognition-heavy runs with a short shared Duolingo-style loop.

## Unit Objective

After Unit 1, the learner can explain that sleep changes across the night, use that idea without diagnosing one awakening, identify timing and light as body-clock cues, and choose one small sleep observation or experiment.

The unit should not make the learner memorize exact sleep-stage percentages, diagnose REM from clock time, or believe their sleep is "broken."

## UX Standard

Each screen teaches one bite.

User sees:

1. Tiny progress at top, for example `2 of 5`.
2. One short prompt.
3. One action: tap, arrange, or choose a short reason.
4. Disabled `Check` until the user has done the action.
5. Immediate feedback after check.
6. One calm next step: `Continue`, `Try again`, `Make easier`, or `Skip for now`.

Do not show stacked questions on one screen. If an exercise has two parts, show part one first, then part two after the user answers. The user should never need to read a tall quiz card while tired.

## Shared Feedback Loop

Correct:

- Show a small green teaching card.
- Copy: `Nice. [One-sentence reason.]`
- CTA: `Continue`.

First miss:

- Show a calm correction, not a punishment.
- Copy: `Not quite yet. [One-sentence correction.]`
- CTA: `Try again`.
- Reveal `Show clue`.

Second miss or `Make easier`:

- Reduce options or prefill part of the answer.
- Copy: `Try this smaller version.`
- CTA: `Check`.

Max attempts:

- Show worked answer.
- Copy: `Here is the pattern. You can continue and we will practice it again later.`
- CTA: `Continue`.
- Telemetry marks this as `supported_complete`, not mastery.

Skip:

- Always available as quiet text.
- Copy: `Skip for now`.
- Telemetry marks `skipped`.
- Skip never counts as mastery.

## Lesson Sequence

### Lesson 1: Sleep Has Stages

Goal: Build the basic map: N1, N2, N3, REM.

Exercise flow:

1. Close discrimination
   Prompt: `Sleep is best described as:`
   Correct: `A changing pattern of stages.`
   Why used: starts with a simple prediction and corrects the "sleep is one state" misconception.

2. Guided recall
   Prompt: `Build the map.`
   Chips: `N1`, `transition`, `N2`, `light sleep`, `N3`, `deep sleep`, `REM`, `vivid dreams`
   Why used: user reconstructs the model instead of rereading it.

3. Scenario
   Prompt: `Maya wakes after a vivid dream and says, "I know I was in REM because it was 4am." What is the safer thought?`
   Correct: `A vivid dream can suggest REM, but clock time alone cannot prove the stage.`
   Why used: teaches mental-health-safe interpretation.

4. Optional reflection
   Prompt: `Which sleep moment worries you most?`
   Choices: `falling asleep`, `waking at night`, `waking early`, `not sure`
   Why used: creates relevance without asking for a journal entry.

5. Recap
   Prompt: `Pick the strongest sleep map.`
   Correct: `N1 transition, N2 light, N3 deep, REM dream-rich.`
   Why used: ends with easy retrieval.

### Lesson 2: Sleep Cycles Repeat

Goal: Understand that cycles repeat and the mix changes later in sleep.

Exercise flow:

1. Retrieval warmup
   Prompt: `Which stage is more linked with vivid dreams?`
   Correct: `REM`
   Why used: spaced retrieval from lesson 1.

2. Guided reconstruction
   Prompt: `Put the pattern in order.`
   Chips: `light sleep`, `deep sleep`, `REM`, `repeat`
   Why used: teaches cycle shape without trivia.

3. Close discrimination
   Prompt: `Which idea is more useful?`
   Correct: `Early sleep often has more deep sleep. Later sleep often has more REM.`
   Why used: replaces exact minutes and percentages with the durable pattern.

4. Scenario why
   Prompt: `You wake near morning after a vivid dream. Best explanation?`
   Step 1 correct: `Later sleep often has more REM.`
   Step 2 correct: `REM is linked with vivid dreams.`
   Why used: applies the pattern and asks for the reason.

5. Misconception correction
   Prompt: `Brief waking between cycles means sleep is broken.`
   Correct: `Not always. Brief waking can happen, but frequent distress or daytime problems deserve support.`
   Why used: reduces self-blame without overclaiming.

### Lesson 3: Your Body Clock Uses Cues

Goal: Understand that wake timing and light help the body clock.

Exercise flow:

1. Review
   Prompt: `Later sleep often has more:`
   Correct: `REM`
   Why used: keeps the sleep-cycle idea alive.

2. Close discrimination
   Prompt: `What helps your body clock most?`
   Correct: `A repeatable wake cue and morning light.`
   Why used: avoids the over-simple "wake time fixes everything" rule.

3. Scenario
   Prompt: `Sam wakes at 7am weekdays and 10am weekends, then feels groggy Monday. What changed?`
   Correct: `The clock got mixed signals from the wake pattern.`
   Why used: makes the concept practical.

4. Make it realistic
   Prompt: `Which is the gentlest first experiment?`
   Correct: `Move weekend wake time a little closer, or get morning light.`
   Why used: supports low-energy users with flexible action.

5. Optional plan
   Prompt: `Pick one cue you could try for 3 days.`
   Choices: `morning light`, `smaller weekend shift`, `same wake alarm`, `skip`
   Why used: behavior change without pressure.

### Lesson 4: Use The Model Calmly

Goal: Apply the full model to real sleep worries without diagnosis or shame.

Exercise flow:

1. Guided recall
   Prompt: `Build the night pattern.`
   Chips: `early`, `more deep sleep`, `later`, `more REM`
   Why used: cumulative retrieval.

2. Changed scenario
   Prompt: `You went to bed late and woke from a dream. What is the safest explanation?`
   Correct: `Dream memory gives a clue, but one night does not prove a problem.`
   Why used: transfer to a new context.

3. Causal explanation
   Prompt: `Why can waking near morning feel more active?`
   Correct: `Later sleep often has more REM, and REM is linked with vivid dreams.`
   Why used: checks understanding, not answer spotting.

4. Safety discrimination
   Prompt: `Which statement should the app say?`
   Correct: `This pattern can be common. If sleep problems are frequent or affecting your day, consider support.`
   Why used: builds trust and avoids medicalizing normal stress.

5. Small action
   Prompt: `Choose one low-pressure next step.`
   Choices: `notice wake time for 3 days`, `get morning light once`, `write one worry down`, `skip`
   Why used: turns knowledge into one practical outcome.

## UI Pattern Notes

- Keep prompts under 2 lines when possible.
- Keep choices short, ideally 3 to 7 words.
- Use one vertical card group only when choices are text-heavy.
- Use 2-column pills for true/false or very short choices.
- Use the panda/guide illustration sparingly as a teaching companion, not a reward machine.
- Use green for correct, soft rose for correction, and no full-screen red failure state.
- Use Cormorant only for lesson titles or completion moments. Use Geist for prompts, choices, and feedback.

## Telemetry Needed

Capture per exercise:

- `exercise_id`
- `concept`
- `category`
- `attempt_count`
- `support_used`: none, clue, easier, worked_answer
- `resolution`: independent_complete, supported_complete, skipped
- `selected_option_id`, not selected text
- `misconception_code`, if present
- `time_to_first_answer_ms`
- `time_to_resolution_ms`
- `retry_variant_id`, when used

Mastery should come only from independent or lightly supported correct answers across more than one moment. Completion alone is not mastery.

## Release Cut

V1 should ship only these common exercise categories:

- `guided_recall`
- `close_discrimination`
- `scenario_why`
- `optional_reflection`

Remove or migrate legacy `learn_cards`, `matching`, `ordering`, `fill_in_the_blank`, `slider_rating`, and generic takeaway checks from Unit 1. If a teaching card is needed, turn it into a prediction or reconstruction first.
