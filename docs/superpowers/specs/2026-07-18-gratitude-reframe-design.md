# Gratitude Reframe Redesign

Date: 2026-07-18
Scope: `src/exercises/gratitudeReframe/*` and shared exercise components used by this flow
Status: Design approved, not yet implemented

## Goal

Redesign Gratitude Reframe so it sits inside the same CBT system as Thought Reframing and Thought Catcher instead of feeling like a separate journaling flow. The result should feel structurally consistent, premium, and low-friction, with reuse of existing shared components wherever possible.

## Product Intent

Gratitude Reframe is not a decorative gratitude journal. It is a structured CBT-style perspective shift. The user should move through the same calm, deliberate exercise shell used elsewhere in the app:

- one clear step at a time
- restrained surfaces
- user words first
- optional support second
- structured completion record at the end

The flow should feel like a sibling of Thought Reframing, not a special-case branch.

## Chosen Direction

Use full CBT alignment.

That means:

- reuse the same exercise intro pattern
- reuse shared choice, text-composer, slider, and summary patterns
- remove older gratitude-specific decorative UI
- keep the copy warm, but the structure disciplined

The writing step will use a list of separate gratitude items, not one long reflection textarea.

## Why This Direction

This is the strongest option for consistency and maintenance.

- It lowers cognitive load because users do not need to relearn a new UI language.
- It fits the repo’s current direction: shared CBT components with fewer one-off screens.
- It gives Gratitude Reframe a more serious, trustworthy tone.
- It reduces duplicate UI logic and future drift across exercise flows.

## Target Flow

Final flow:

1. Intro
2. Current mood
3. Mood intensity
4. Pick a gratitude direction
5. Add gratitude items
6. Re-rate mood
7. Structured summary

## Step-by-Step Design

### 1. Intro

Use the shared CBT intro pattern already established for other exercises.

Requirements:

- same visual structure as Thought Reframing intro
- same headerless intro treatment
- same bullet-list rhythm
- same CTA treatment

Content direction:

- title: `Gratitude Reframe`
- tone: calm and practical, not inspirational
- bullets should describe process, not benefits

Example structure:

- Notice your starting mood
- Choose one gratitude direction
- Name a few real things that matter
- See whether the feeling shifts

## 2. Current Mood

Replace the default choice-card treatment with the calmer shared CBT choice style.

Requirements:

- use shared `ChoiceStep`
- use the cleaner reusable layout variant instead of heavier generic cards
- no decorative AI or journaling styling
- direct labels with clear tap targets

Mood options should stay compact and operational. The screen should ask for the user’s present state, not force emotional storytelling.

## 3. Mood Intensity

Add a mood intensity step before prompt selection so the flow has a measurable starting point.

Requirements:

- use shared `SliderStep`
- use the same value presentation language as the newer CBT flows
- use 0-10, not 0-100
- use a neutral context treatment if supporting text is shown

Recommended labels:

- min: `Low`
- mid: `Noticeable`
- max: `Strong`

This makes the final shift legible in the summary without using awkward percentage framing.

## 4. Gratitude Direction

Keep this as a guided choice step, but make it feel like a reflection direction rather than a themed prompt card.

Requirements:

- use shared `ChoiceStep`
- same reusable selection row pattern as other CBT steps
- label and description hierarchy should match the rest of the exercise system

Direction options should be concrete and broad enough to help the user start:

- Someone who helped me
- Something steady in my life
- A small moment that helped today
- Something I am learning or rebuilding

AI suggestions, if preserved, should remain hidden or secondary in the same way the newer CBT work handles support. The primary interaction should remain the built-in options.

## 5. Gratitude Items

This is the core writing step.

Use the shared list composer pattern, not a one-off gratitude input.

Requirements:

- use shared `ExerciseTextComposer` in list mode via `MultiTextInputStep` or a refined reusable variant
- same composer height and spacing rules as the rest of CBT
- same voice affordance behavior as current CBT text inputs where appropriate
- no glow by default
- existing entries displayed in the same structured item list style used elsewhere

Behavior:

- minimum 1 item
- target 3 items
- cap at 5 items
- entries should be short, separate, and scannable

Copy direction:

- subtitle should encourage real specifics, not generic positivity
- examples should stay concrete and plain

Good examples:

- My friend checked on me today.
- I had a quiet ten minutes to breathe.
- I finished one hard thing I was avoiding.

Bad examples:

- Life is beautiful.
- Everything happens for a reason.
- I should just be more grateful.

## 6. Re-rate Mood

Reuse the shared `SliderStep` again for the ending state.

Requirements:

- same visual treatment as the opening mood-intensity step
- same 0-10 scale
- label should clearly indicate “now” or “after reflecting”

Recommended title:

- `How does your mood feel now?`

Recommended subtitle:

- `After naming what mattered, where are you now?`

## 7. Summary

Replace the current decorative gratitude summary with a structured recap that matches the newer CBT completion pattern.

Requirements:

- reuse the shared recap/timeline summary structure where possible
- no mascot + title redundancy
- no ornamental celebration styling
- no large themed card that breaks the rest of the flow

The summary should preserve the user’s record in a way that still makes sense days later.

Structure:

- title
- short completion line
- gratitude direction chosen
- gratitude items listed clearly
- mood intensity before and after
- short shift interpretation
- primary `Complete`
- secondary `Edit answers`

The summary should read like a useful record, not a congratulatory poster.

## Shared Component Strategy

Reuse first. Add reusable variants only where the current shared component is not sufficient.

### Reuse directly

- `IntroStep`
- `ChoiceStep`
- `SliderStep`
- `ExerciseTextComposer`
- shared exercise shell / header / footer

### Likely shared improvements

1. `ChoiceStep`
   - Gratitude flow should use the calmer reusable row layout instead of the default heavier card style.
   - If the existing `cbt_reflection` variant already fits, reuse it.
   - If gratitude needs slightly different secondary text treatment, extend the shared variant rather than forking a gratitude-only layout.

2. `MultiTextInputStep`
   - It currently still reads older and more generic than the newer CBT steps.
   - It should be brought closer to the newer composition model:
     - optional suggestions below or behind disclosure, not leading the screen
     - count and validation in the same tonal system
     - same composer sizing and spacing as the rest of CBT
   - If this requires refactoring, it should remain reusable for other list-entry CBT flows.

3. Summary
   - Prefer adapting the shared recap/timeline pattern so Gratitude Reframe does not keep a special summary architecture unless its data model truly demands it.

## Data Model Changes

Current flow stores mood intensities as 0-100. The redesigned flow should move to 0-10 for alignment with the rest of CBT.

Implications:

- add migration logic in gratitude config
- normalize legacy saved values
- update summary calculations and copy accordingly

This matters because visual and conceptual consistency is part of the redesign, not just color and spacing.

## Copy Principles

Use direct, plain English. Avoid self-help slogans and over-coaching.

Preferred tone:

- concrete
- grounded
- calm
- simple

Avoid:

- gratitude as moral pressure
- upbeat filler
- decorative AI language
- “sparkle” framing

## Visual Rules

Gratitude Reframe should inherit the same rules already being enforced in the newer CBT redesign work:

- white header background
- restrained neutral/sage surfaces
- consistent input height and spacing
- Cormorant only for true titles and reflective moments
- Geist for instructions, labels, options, and metadata
- no ghost cards
- no decorative tinted quote cards unless they communicate real structure

## Non-Goals

This redesign does not introduce:

- a new gratitude-only design system
- a long-form journaling mode
- decorative celebration screens
- visible AI-first UI
- unique screen-specific components unless they can be justified as reusable

## Implementation Shape

Expected work areas:

- `src/exercises/gratitudeReframe/config.ts`
- `src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx`
- `src/components/exercise/steps/MultiTextInputStep.tsx`
- possibly `src/components/exercise/steps/ChoiceStep.tsx`
- possibly shared recap/summary components if Gratitude is migrated onto them

## Risks

1. Shared component drift
   - If Gratitude gets patched through screen-specific overrides, it will immediately diverge again.

2. Mood-scale mismatch
   - Leaving 0-100 in Gratitude while the rest of CBT uses 0-10 will keep the flow feeling inconsistent.

3. Summary over-decoration
   - If the current summary architecture is merely restyled instead of restructured, the flow will still feel different from the CBT family.

## Recommendation

Implement Gratitude Reframe as a full sibling to Thought Reframing and Thought Catcher:

- shared intro
- shared choice rows
- shared slider language
- shared list composer language
- shared structured summary principles

Any component work should improve the shared CBT system, not create a new Gratitude-only branch.
