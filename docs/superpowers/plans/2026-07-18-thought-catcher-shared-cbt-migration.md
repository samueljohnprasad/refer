# Thought Catcher Shared CBT Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Thought Catcher onto shared CBT writing, slider, choice, and recap components while deleting stale Thought Catcher-only UI paths.

**Architecture:** Extend shared exercise-step components where the interaction already matches Thought Reframing, then replace Thought Catcher's old summary/checkpoint components with one shared thought-record recap component built on the reflection timeline primitives.

**Tech Stack:** React Native, Expo Router, TypeScript, NativeWind classes, existing app tokens and exercise step architecture

## Global Constraints

- Touch shared components only where the interaction is genuinely the same
- Keep changes scoped to Thought Catcher migration plus the shared primitives it needs
- Preserve current exercise flow architecture and config-driven step declarations
- Delete stale Thought Catcher-only recap code if it is no longer needed

---

### Task 1: Record the migration contract

**Files:**
- Create: `docs/superpowers/specs/2026-07-18-thought-catcher-shared-cbt-migration-design.md`
- Create: `docs/superpowers/plans/2026-07-18-thought-catcher-shared-cbt-migration.md`
- Modify: `.temp/plan-mode/active/refactoring-contract.md`

**Interfaces:**
- Consumes: current Thought Catcher flow and shared CBT components
- Produces: explicit in-scope files and reusable migration contract

- [ ] Write the design doc
- [ ] Write the implementation plan
- [ ] Update the refactoring contract with targets, consumers, and expected after-state

### Task 2: Upgrade shared writing step behavior

**Files:**
- Modify: `src/components/exercise/steps/TextInputStep.tsx`
- Modify: `src/components/exercise/ExerciseTextComposer.tsx` only if needed for prop support

**Interfaces:**
- Consumes: `TextInputStep` config props from Thought Catcher
- Produces: shared voice-enabled CBT writing behavior for situation, automatic thought, and balanced thought

- [ ] Add voice recording and transcription support to `TextInputStep`
- [ ] Add any missing prop hooks for min height, status text, or requirement text without duplicating the composer
- [ ] Keep read-only mode and current submit behavior intact

### Task 3: Add shared recap component and migrate Thought Catcher summaries

**Files:**
- Create: `src/components/exercise/ThoughtRecordSummary.tsx`
- Modify: `src/exercises/thoughtCatcher/config.ts`
- Modify or delete: `src/exercises/thoughtCatcher/ThoughtCatcherSummary.tsx`

**Interfaces:**
- Consumes: `ThoughtCatcherResponse`, reflection timeline primitives, coping-card save behavior
- Produces: one shared recap renderer used for both checkpoint and final summary

- [ ] Build the shared thought-record summary component
- [ ] Replace the old checkpoint summary step with the shared recap component
- [ ] Replace the final Thought Catcher summary with the shared recap component or a thin wrapper
- [ ] Delete stale Thought Catcher-only summary implementation if no longer needed

### Task 4: Align Thought Catcher config to shared CBT patterns

**Files:**
- Modify: `src/exercises/thoughtCatcher/config.ts`

**Interfaces:**
- Consumes: shared `IntroStep`, `TextInputStep`, `SliderStep`, `ChoiceStep`, `ThoughtRecordSummary`
- Produces: Thought Catcher screens configured through shared CBT props instead of local style drift

- [ ] Make the exercise background white
- [ ] Update situation, automatic-thought, and balanced-thought step copy and props to use the shared CBT writing style
- [ ] Update intensity and post-intensity sliders to the shared belief-rating presentation
- [ ] Update Reality Check copy and shared choice-row usage

### Task 5: Verify and remove stale references

**Files:**
- Modify: any touched barrel exports if required

**Interfaces:**
- Consumes: changed Thought Catcher and shared component files
- Produces: no stale Thought Catcher summary path and no stale step-specific duplicate UI

- [ ] Search for remaining stale Thought Catcher summary references
- [ ] Run `git diff --check`
- [ ] Run focused TypeScript verification where practical
