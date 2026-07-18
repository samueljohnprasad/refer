# Thought Catcher Shared CBT Migration Design

## Goal

Migrate `Thought Catcher` onto the same shared CBT component system used by the upgraded Thought Reframing flow, so the exercise feels like part of one product instead of a separate UI path.

## Scope

This pass covers `Thought Catcher` only. Shared components may be extended where needed, but only `Thought Catcher` is migrated in this change.

## Problems

- The flow still uses older content styling and summary patterns.
- The exercise intro is now shared, but the body screens still drift from Thought Reframing.
- Situation, automatic thought, and balanced thought do the same job as Thought Reframing but do not use the same full voice-enabled writing experience.
- Intensity and reality-check screens use older shared styles and read differently from the upgraded CBT flow.
- There are two recap screens in the flow and they currently feel like separate products.

## Decision

Keep the current step-config architecture and migrate `Thought Catcher` onto shared CBT building blocks:

- shared white exercise shell
- shared voice-enabled text composer path
- shared reflection slider presentation
- shared calm choice row treatment
- shared thought-record recap structure

## UX Direction

- White screen background and white header surface for the full flow
- Cormorant titles and Geist body text, matching the current CBT hierarchy
- Inputs remain the primary object on writing screens
- Voice stays present but secondary
- Recaps should read like a journal record, not a random card stack

## Component Work

### 1. Text input path

Extend `TextInputStep` so it can use the same voice-enabled `ExerciseTextComposer` behavior already proven in Thought Reframing:

- voice recording and transcription
- configurable min height
- requirement and status text
- reference quote block

### 2. Slider path

Use the shared `SliderStep` with Thought Reframing-style copy and bounds:

- `0` to `10`
- `Not true`, `Partly`, `Completely`
- contextual automatic-thought quote where useful

### 3. Choice path

Use the shared `ChoiceStep` for Reality Check with calmer CBT copy and the same row spacing and radio treatment as other exercises.

### 4. Recap path

Create one reusable thought-record recap component that can render both:

- the mid-flow checkpoint summary
- the final recap with belief shift, reality check, and balanced thought

This component should reuse the existing reflection timeline primitives where possible.

## Cleanup

- Remove the standalone `ThoughtCatcherSummary` implementation if it becomes a thin wrapper or dead file.
- Remove the old `createSummaryStep` checkpoint usage from Thought Catcher in favor of the shared recap component.

## Verification

- Search for remaining Thought Catcher-specific stale summary usage
- Run `git diff --check`
- Run a focused TypeScript check on changed files if possible
- If repo-wide `tsc` still fails elsewhere, report those failures as pre-existing unless changed files appear in the error list
