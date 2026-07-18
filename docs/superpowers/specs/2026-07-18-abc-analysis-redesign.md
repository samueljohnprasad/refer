# ABC Analysis Redesign

Date: 2026-07-18
Scope: `src/exercises/abcAnalysis/*` and shared exercise components reused by this flow
Status: Design approved, not yet implemented

## Goal

Redesign ABC Analysis so it lives inside the same shared CBT product system as Thought Reframing, Thought Catcher, and Gratitude Reframe. The result should feel calm, premium, structurally consistent, and easier to move through one step at a time.

This is not a one-screen polish. It is a flow-level alignment effort:

- move ABC off older screen-specific patterns
- reuse the shared CBT intro, input, slider, and recap systems
- reduce therapy jargon in the visible UI
- keep the ABC structure in the exercise logic without making the user decode it

## Product Intent

ABC Analysis helps the user see the chain between an event, the thought attached to it, and what followed emotionally and behaviorally.

The flow should feel like guided cognitive unpacking, not like a worksheet template. The interface should:

- ask for one thing at a time
- keep the user’s words as the main object
- use plain language first
- keep suggestions and AI visually secondary
- preserve the completed journey in a form that still makes sense later

## Chosen Direction

Use full shared CBT alignment.

That means:

- shared intro component
- shared single-answer text composer pattern
- shared before/after slider treatment
- split the overloaded consequence step into two screens
- shared recap/timeline summary structure
- remove older blue helper boxes, heavy cards, and ABC-specific visual one-offs

## Why This Direction

This is the strongest option for both UX and maintenance.

- It reduces cognitive load because each screen has one job.
- It aligns ABC with the newer CBT system already taking shape in the repo.
- It lets the user read the flow in plain language instead of therapy vocabulary.
- It removes duplicated step UI and old styling drift.
- It makes future CBT exercises easier to standardize on the same component set.

## Final Flow

1. Intro
2. Intensity before
3. What happened?
4. Automatic thought
5. How did you feel?
6. What did you do next?
7. More balanced thought
8. What might change now?
9. Intensity after
10. Summary

Underlying ABC mapping:

- `A` = What happened?
- `B` = Automatic thought
- `C1` = How did you feel?
- `C2` = What did you do next?

The model stays ABC. The visible copy becomes more human and easier to move through.

## Step-by-Step Design

### 1. Intro

Use the same reusable CBT intro pattern already established for Thought Reframing.

Requirements:

- same hero structure
- same duration pill treatment
- same vertical sequence layout
- same primary CTA treatment
- no ABC-specific decorative card stack

Content direction:

- title: `ABC Analysis`
- subtitle: `See how a moment, a thought, and a reaction connect.`
- bullets should describe the sequence, not sell the benefit

Recommended sequence copy:

- Name what happened
- Catch the automatic thought
- Notice the feeling and reaction
- Try a more balanced thought
- See what might change

### 2. Intensity Before

Use the same shared slider screen style used in the newer CBT flows.

Requirements:

- reuse shared `SliderStep`
- same typography and spacing rhythm as Thought Reframing
- same 0-10 model
- same calmer presentation of the current value
- no extra card around the prompt text

Recommended copy:

- title: `How intense does it feel?`
- subtitle: `Before you unpack it, where is it right now?`
- min label: keep current neutral visual treatment
- max label: keep current neutral visual treatment

### 3. What Happened?

This is the `A` step.

Requirements:

- use the shared single-answer text composer/input shell
- same input height as the shared CBT text-entry steps
- same always-available voice affordance
- same validation rhythm as Thought Reframing
- no glow by default
- no blue helper card

Copy direction:

- title: `What happened?`
- subtitle: `Start with the moment, not what it meant.`
- guidance line: `Write what a camera could have seen or heard.`

Examples:

- keep at least two visible by default
- examples stay short, concrete, and ordinary
- examples should feel like starter scaffolding, not optional hidden help

### 4. Automatic Thought

This is the `B` step.

It should be framed like Thought Reframing’s `Automatic thought`, not with heavier therapy vocabulary like `belief`.

Requirements:

- use the same shared text-entry pattern as the previous step
- show prior context in the same quiet contextual style used in Thought Reframing where useful
- keep examples visible by default
- AI suggestions, if present, should remain secondary to the built-in examples and the user’s own words

Copy direction:

- title: `Automatic thought`
- subtitle: `Write the sentence your mind added.`
- guidance line: `Do not make it fair yet. Just catch it.`

### 5. How Did You Feel?

This is the first half of `C`.

Split it into its own screen instead of pairing it with behavior on the same page.

Requirements:

- use the calmer shared CBT choice selection pattern
- do not reintroduce old heavy answer cards
- support selecting 1 to 3 emotions
- keep the UI visually consistent with the newer feeling-selection pattern

Preferred direction:

- allow a short set of emotion choices first
- include an optional typed fallback only if the existing shared emotion-selection pattern already supports it cleanly
- do not create a new ABC-only emotion input surface

Visible copy:

- title: `How did you feel?`
- subtitle: `Name the emotion that followed the thought.`

### 6. What Did You Do Next?

This is the second half of `C`.

Requirements:

- use the same shared single-answer text composer/input shell
- same input height and voice affordance as other text screens
- same visible example treatment
- examples should focus on reactions and behavior, not feelings

Copy direction:

- title: `What did you do next?`
- subtitle: `Name the reaction that followed.`
- guidance line: `What did you do, avoid, say, or repeat?`

### 7. More Balanced Thought

This replaces the more clinical `alternative belief` framing in the user-facing UI.

Requirements:

- reuse the same shared text-entry system
- show the original automatic thought in a quiet reference block above the input
- keep suggested reframes visually secondary
- no special ABC-only rationale card style
- if suggested reframes include rationale, the rationale should be quieter than the suggestion itself

Copy direction:

- title: `More balanced thought`
- subtitle: `Write a fairer version that still feels believable.`

### 8. What Might Change Now?

This replaces the more clinical `new consequence` framing in the user-facing UI.

Requirements:

- use the same shared text-entry system
- keep the screen future-oriented but grounded
- do not over-promise emotional transformation

Copy direction:

- title: `What might change now?`
- subtitle: `If you held that thought, what might feel or go differently?`

### 9. Intensity After

Use the same shared slider screen pattern as the first intensity step.

Requirements:

- same 0-10 scale
- same value presentation
- same CTA/footer rhythm
- no added completion styling on this screen

Recommended copy:

- title: `How intense does it feel now?`
- subtitle: `After looking at the chain, where is it now?`

### 10. Summary

Replace the current custom ABC summary with the shared recap/timeline structure.

The summary should feel like a readable record, not a decorative completion poster.

Requirements:

- reuse shared timeline/recap components where possible
- avoid mascot/title redundancy
- keep the screen visually in the same family as the newer CBT summaries
- preserve the full chain because this flow is about sequence, not just outcome

Final structure:

- title
- short completion line
- what happened
- automatic thought
- how you felt
- what you did next
- more balanced thought
- what might change now
- intensity before and after
- primary `Complete`
- secondary `Edit answers`

The ordering matters. The user should be able to reopen the entry later and reconstruct the whole journey quickly.

## Shared Component Strategy

Reuse first. Extend shared components only where the current system is not enough.

### Reuse directly

- shared CBT intro component family
- shared header/footer exercise shell
- shared text composer / single-answer input shell
- shared slider screen
- shared recap / timeline summary structure

### Shared changes likely needed

1. `abcAnalysis` config structure
   - split consequence into two screens
   - rename visible labels without breaking stored field semantics

2. Choice screen support
   - if `How did you feel?` needs chip-style or calmer selection treatment, do it in a reusable shared component or shared variant
   - do not create an ABC-only answer card style

3. Text-entry step wrappers
   - ABC should use the same height, spacing, footer relationship, voice affordance, and example treatment as the newer CBT screens
   - if current shared wrappers are still inconsistent, fix the wrapper, not just ABC

4. Summary composition
   - ABC should move onto the same summary architecture used by the newer flows
   - if the timeline component needs a reusable “chain recap” variant, add it once and keep it generic

## Data Model and Field Mapping

Keep the saved response shape unless a change is necessary for consistency.

Current fields:

- `activatingEvent`
- `belief`
- `consequenceEmotion`
- `consequenceBehavior`
- `alternativeBelief`
- `newConsequence`
- `preEmotionalIntensity`
- `postEmotionalIntensity`

Visible labels should change without forcing a storage rename:

- `belief` stays in storage, shown as `Automatic thought`
- `alternativeBelief` stays in storage, shown as `More balanced thought`
- `newConsequence` stays in storage, shown as `What might change now?`

This keeps migration risk lower while still fixing the user-facing language.

## AI and Example Treatment

AI should remain visually hidden until requested or clearly secondary.

Rules:

- do not lead with AI labels or sparkle-like presentation
- do not make AI suggestions the first thing the user sees
- keep at least two visible starter examples by default on relevant text-entry steps
- if AI suggestions are available, they should appear in the same subdued support area used by the newer CBT direction

The user should feel guided by the exercise, not by an assistant persona.

## Visual Rules

Carry forward the established CBT surface rules:

- white header background
- same progress bar treatment
- same content width and spacing rhythm
- same text hierarchy
- no oversized ghost cards
- no blue helper boxes
- no unrelated celebration UI inside working steps
- inputs remain the primary object on input screens

## Out of Scope

Not part of this pass:

- new test coverage
- broad refactors outside ABC and the shared components directly needed for ABC alignment
- copy changes in unrelated CBT flows unless they are required by a reused shared component
- simulator/device-only visual polish passes before code changes land

## Verification Expectations

This pass should be verified with narrow code checks only unless later visual QA is explicitly requested.

Minimum expected verification after implementation:

- focused exercise-flow checks for changed files
- `git diff --check`
- no claim of full repo TypeScript cleanliness unless changed files are clear in the error output
