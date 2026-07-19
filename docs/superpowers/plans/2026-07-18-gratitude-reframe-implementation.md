# Gratitude Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Gratitude Reframe so it uses the shared CBT exercise system, shared reusable components, and a structured recap instead of older one-off journaling UI.

**Architecture:** Keep the exercise route and registry unchanged, but migrate Gratitude Reframe onto the same shared step language as Thought Reframing and Thought Catcher. Reuse `IntroStep`, `ChoiceStep`, `SliderStep`, `ExerciseTextComposer`, and shared recap patterns; extend shared components only when the current reusable API cannot express the approved design cleanly.

**Tech Stack:** Expo Router, React Native, TypeScript, NativeWind className styling, shared exercise components under `src/components/exercise`, existing design tokens from `lib/tokens.ts`

## Global Constraints

- Reuse existing shared exercise components first; only add reusable variants when existing shared components are insufficient.
- Gratitude Reframe must align with the same CBT system as Thought Reframing and Thought Catcher.
- The writing step uses a list of separate gratitude items, not one long reflection textarea.
- Mood intensity must use a 0-10 scale, not 0-100.
- Inputs must follow the same composer sizing and spacing rules as the rest of CBT.
- Avoid decorative gratitude-only UI, visible AI-first UI, ghost cards, oversized radii, and celebratory poster-style summaries.
- Copy must stay direct, plain, calm, and concrete.
- Preserve the dirty worktree; do not revert unrelated changes.

---

## File Structure

### Existing files to modify

- `src/exercises/gratitudeReframe/config.ts`
  - Owns flow order, validation, migration, labels, and step component selection for Gratitude Reframe.
- `src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx`
  - Current gratitude-specific summary implementation; likely replaced with shared recap composition.
- `src/components/exercise/steps/MultiTextInputStep.tsx`
  - Shared list-entry step that currently still uses older suggestion/composer behavior.
- `src/components/exercise/steps/ChoiceStep.tsx`
  - Shared choice step; reuse existing calm layout variant or extend it minimally for gratitude direction rows.
- `src/components/exercise/steps/SliderStep.tsx`
  - Shared slider; may need copy/config-only changes from Gratitude config, not structural changes.
- `src/components/exercise/ThoughtRecordRecap.tsx`
  - Shared recap structure that may be adapted for Gratitude summary if current props are too thought-record-specific.

### Existing files to inspect during execution

- `src/exercises/thoughtCatcher/config.ts`
- `src/exercises/thoughtReframing/config.ts`
- `src/exercises/thoughtReframing/ThoughtReframingSummary.tsx`
- `src/components/exercise/ExerciseTextComposer.tsx`
- `src/components/exercise/ReflectionTimeline.tsx`
- `src/components/exercise/ReflectionStepSections.tsx`

### No new gratitude-only primitives unless unavoidable

If new UI surface is required, prefer:

- extending `MultiTextInputStep`
- extending `ThoughtRecordRecap`
- extending `ChoiceStep`

Do not create bespoke `GratitudePromptCard`, `GratitudeMoodCard`, or similar one-off components unless the shared system cannot reasonably support the design.

---

### Task 1: Migrate Gratitude Config Onto Shared CBT Step Language

**Files:**
- Modify: `src/exercises/gratitudeReframe/config.ts`
- Inspect: `src/exercises/thoughtCatcher/config.ts`
- Inspect: `src/exercises/thoughtReframing/config.ts`

**Interfaces:**
- Consumes:
  - `ExerciseConfig<GratitudeReframeResponse>`
  - shared step factories from `src/components/exercise/steps/createStep`
- Produces:
  - updated `gratitudeReframeConfig: ExerciseConfig<GratitudeReframeResponse>`
  - migration path from legacy 0-100 mood values to 0-10
  - new ordered steps: `intro`, `mood`, `mood_intensity`, `prompts`, `reflection`, `reevaluate`, `summary`

- [ ] **Step 1: Write the failing type expectation in a scratch note**

Document the intended response shape before editing:

```ts
type GratitudeReframeResponse = {
  currentMood: string | null;
  moodIntensity: number | null;
  selectedPrompt: string;
  gratitudeEntries: string[];
  finalMoodIntensity?: number;
};
```

Expected failure mode before implementation: config still uses `50`-based defaults and skips the dedicated starting intensity step.

- [ ] **Step 2: Update initial state and migration logic**

In `src/exercises/gratitudeReframe/config.ts`, change the default intensities from `50` to `5` and add migration logic that scales any legacy value above `10` down to the `0-10` range.

Implementation shape:

```ts
function normalizeMoodScore(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;
  if (value > 10) return Math.min(Math.max(Math.round(value / 10), 0), 10);
  return Math.min(Math.max(Math.round(value), 0), 10);
}
```

- [ ] **Step 3: Insert the dedicated starting mood-intensity slider step**

Update the steps array so the flow order becomes:

```ts
[
  "intro",
  "mood",
  "mood_intensity",
  "prompts",
  "reflection",
  "reevaluate",
  "summary",
]
```

The new `mood_intensity` step should use `SliderStep` with:

```ts
{
  title: "How strong is it right now?",
  subtitle: "",
  fieldKey: "moodIntensity",
  min: 0,
  max: 10,
  minLabel: "Low",
  midLabel: "Noticeable",
  maxLabel: "Strong",
  unit: "/10",
  showStepCount: false,
}
```

- [ ] **Step 4: Convert existing choice steps to the calm shared layout**

Update both `mood` and `prompts` steps to pass the reusable calm layout variant through `ChoiceStep`.

Target shape:

```ts
layoutVariant: "cbt_reflection" as const,
showStepCount: false,
```

For prompt options, add short descriptions instead of long decorative labels when needed.

- [ ] **Step 5: Update the gratitude writing step to the approved list-entry shape**

Keep `MultiTextInputStep`, but pass stricter CBT-style config:

```ts
{
  title: "Gratitude items",
  subtitle: "Write real things that mattered, even if they were small.",
  fieldKey: "gratitudeEntries",
  placeholder: "Type one thing that mattered...",
  minItems: 1,
  maxItems: 5,
  validationMessage:
    "Even small things count. Name what was genuinely there.",
}
```

- [ ] **Step 6: Update the ending slider step to the same 0-10 system**

Change `reevaluate` to:

```ts
{
  title: "How does your mood feel now?",
  subtitle: "",
  fieldKey: "finalMoodIntensity",
  min: 0,
  max: 10,
  minLabel: "Low",
  midLabel: "Noticeable",
  maxLabel: "Strong",
  unit: "/10",
  showStepCount: false,
}
```

- [ ] **Step 7: Run a focused verification**

Run: `rg -n "50|100|mood_intensity|layoutVariant|showStepCount" src/exercises/gratitudeReframe/config.ts`

Expected:
- `moodIntensity` and `finalMoodIntensity` default to `5`
- `mood_intensity` step exists
- `layoutVariant: "cbt_reflection"` is present on choice steps
- no remaining `0-100` slider config in Gratitude Reframe

- [ ] **Step 8: Commit**

```bash
git add src/exercises/gratitudeReframe/config.ts
git commit -m "feat: align gratitude reframe flow with shared cbt steps"
```

---

### Task 2: Refactor Multi-Item Entry Into the Shared CBT Composer System

**Files:**
- Modify: `src/components/exercise/steps/MultiTextInputStep.tsx`
- Inspect: `src/components/exercise/ExerciseTextComposer.tsx`
- Inspect: `src/exercises/thoughtReframing/customSteps.tsx`
- Test: narrow verification via search and typecheck output inspection

**Interfaces:**
- Consumes:
  - `ExerciseTextComposer` in `mode="list"`
  - `StepLayout`
  - `SuggestionCards`
- Produces:
  - improved `MultiTextInputStep` that uses the same CBT rhythm as newer flows
  - reusable prop surface for future list-entry CBT exercises

- [ ] **Step 1: Define the target reusable prop additions**

Add only the props needed to make `MultiTextInputStep` match CBT behavior without becoming gratitude-specific:

```ts
interface MultiTextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  minItems?: number;
  maxItems?: number;
  maxLength?: number;
  validationMessage?: string;
  psychoeducationText?: string;
  composerMinHeight?: number;
  showStepCount?: boolean;
  suggestionsTitle?: string;
  suggestionsHelperText?: string;
  suggestionsCollapsedByDefault?: boolean;
}
```

- [ ] **Step 2: Remove older AI-first ordering from the list step**

Reorder `MultiTextInputStep` so the list composer remains the primary object and suggestions are secondary.

Target render order:

1. `PsychoeducationCard` if present
2. list composer
3. validation / count line
4. optional suggestions disclosure

Do not keep visible suggestion cards above the empty composer.

- [ ] **Step 3: Standardize composer sizing and styling**

Set the default list composer height to the same compact CBT height already used elsewhere.

Target behavior:

```ts
const composerMinHeight = props.composerMinHeight ?? 100;
```

Pass `glow={false}` explicitly or remove any old glow behavior from this step.

- [ ] **Step 4: Move suggestions behind a disclosure**

Wrap AI suggestions in the same disclosure pattern already used by newer CBT steps when possible.

If `ReflectionDisclosure` is available and compatible, use it. If not, add the smallest reusable disclosure treatment inside `MultiTextInputStep` without inventing a gratitude-only UI.

Target copy:

```ts
title: suggestionsTitle ?? "Need an example?"
helperText: suggestionsHelperText ?? "Use only if it fits. Make the words yours."
```

- [ ] **Step 5: Bring count and validation into the same tonal system**

Replace the current generic count line:

```tsx
<Text className="text-xs text-slate-400 mt-2">
```

with the same ink-soft caption treatment used across CBT steps.

Target content:

```tsx
<Text variant="caption" className="mt-2 text-ink-soft">
  {items.length}/{maxItems} items{minItems > 0 ? ` (min ${minItems})` : ""}
</Text>
```

- [ ] **Step 6: Run focused verification**

Run: `sed -n '1,240p' src/components/exercise/steps/MultiTextInputStep.tsx`

Expected:
- composer appears before suggestions
- no `glow` usage remains in this step
- compact shared composer height is configurable and defaults correctly
- suggestions are no longer the leading visual object

- [ ] **Step 7: Commit**

```bash
git add src/components/exercise/steps/MultiTextInputStep.tsx
git commit -m "refactor: align multi text input step with shared cbt composer"
```

---

### Task 3: Replace Gratitude Summary With a Structured Shared Recap

**Files:**
- Modify: `src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx`
- Modify: `src/components/exercise/ThoughtRecordRecap.tsx`
- Inspect: `src/exercises/thoughtCatcher/ThoughtCatcherSummary.tsx`
- Inspect: `src/exercises/thoughtReframing/ThoughtReframingSummary.tsx`
- Inspect: `src/components/exercise/ReflectionTimeline.tsx`

**Interfaces:**
- Consumes:
  - shared recap/timeline components
  - `GratitudeReframeResponse`
- Produces:
  - summary screen that preserves gratitude direction, gratitude items, and mood shift in a structured recap
  - any shared recap extension needed for non-thought-record exercises

- [ ] **Step 1: Decide whether `ThoughtRecordRecap` can be generalized safely**

Inspect `ThoughtRecordRecap.tsx` and determine whether it can accept a more generic section model without harming Thought Catcher.

Preferred shared interface:

```ts
type RecapSection = {
  label: string;
  value: string | string[];
  tone?: "default" | "serif" | "muted";
};
```

If a small generalization works, do that instead of keeping a custom gratitude summary layout.

- [ ] **Step 2: Remove decorative gratitude-only summary chrome**

Delete or replace these patterns from `GratitudeReframeSummary.tsx`:

- emoji/plant hero used as the primary visual anchor
- ornamental tinted gratitude card
- sparkle-led item rows
- poster-like celebration framing

Replace them with structured recap content inside the shared completion system.

- [ ] **Step 3: Render the approved gratitude recap structure**

Target summary content:

```ts
[
  { label: "Gratitude direction", value: promptLabel },
  { label: "What you named", value: gratitudeEntries },
  { label: "Mood intensity", value: [`Before ${preScore}/10`, `After ${postScore}/10`] },
]
```

Include a short shift interpretation generated from the score difference:

```ts
if (post > pre) "Your mood lifted after naming what mattered."
if (post === pre) "The feeling did not move much, but the record still matters."
if (post < pre) "The feeling stayed heavy. Naming support is still useful."
```

- [ ] **Step 4: Keep the completion controls consistent**

The summary footer should match the newer CBT completion pattern:

- primary `Complete`
- secondary `Edit answers`

If “save as coping card” remains, it must be quiet and secondary, not the visual anchor.

- [ ] **Step 5: Run focused verification**

Run: `rg -n "SparklesIcon|🌿|Perspective shifted|Bookmark" src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx`

Expected:
- decorative summary-only celebration artifacts are removed or reduced to quiet secondary support
- summary content is now structured around the user record

- [ ] **Step 6: Commit**

```bash
git add src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx src/components/exercise/ThoughtRecordRecap.tsx
git commit -m "refactor: move gratitude summary onto shared recap structure"
```

---

### Task 4: End-to-End Gratitude Reframe Verification

**Files:**
- Verify: `src/exercises/gratitudeReframe/config.ts`
- Verify: `src/exercises/gratitudeReframe/GratitudeReframeSummary.tsx`
- Verify: `src/components/exercise/steps/MultiTextInputStep.tsx`
- Verify any touched shared files from earlier tasks

**Interfaces:**
- Consumes:
  - completed flow wiring from Tasks 1-3
- Produces:
  - code-verified Gratitude Reframe flow with no local formatting errors and no touched-file TypeScript regressions

- [ ] **Step 1: Run formatting/syntax verification**

Run: `git diff --check`

Expected: no output

- [ ] **Step 2: Run a targeted structural search**

Run:

```bash
rg -n "mood_intensity|layoutVariant: \"cbt_reflection\"|composerMinHeight|Need an example\\?|/10" \
  src/exercises/gratitudeReframe \
  src/components/exercise/steps/MultiTextInputStep.tsx
```

Expected:
- starting mood slider exists
- calm choice variant is used
- gratitude list step uses the shared compact composer configuration
- sliders are on `/10`

- [ ] **Step 3: Run TypeScript check and inspect touched-file relevance**

Run: `npx tsc --noEmit --pretty false`

Expected:
- repo may still show unrelated pre-existing failures
- changed Gratitude Reframe files and touched shared exercise files must not appear in the new error list

- [ ] **Step 4: Optional visual verification if simulator is available**

Run the narrowest available app verification for Gratitude Reframe in the iOS simulator/dev app and inspect:

- intro parity with other CBT exercises
- calm choice rows
- compact list composer
- 0-10 sliders
- structured summary

If visual verification cannot be run, record the result as code-verified only.

- [ ] **Step 5: Commit**

```bash
git add src/exercises/gratitudeReframe src/components/exercise/steps/MultiTextInputStep.tsx src/components/exercise/ThoughtRecordRecap.tsx
git commit -m "feat: redesign gratitude reframe with shared cbt components"
```

---

## Self-Review

### Spec coverage

- Full CBT alignment: covered by Tasks 1-3.
- Shared component reuse first: covered by Tasks 2-3.
- List of separate gratitude items: covered by Tasks 1-2.
- 0-10 mood scale migration: covered by Task 1.
- Structured summary replacing decorative summary: covered by Task 3.
- Verification and touched-file TypeScript discipline: covered by Task 4.

### Placeholder scan

No `TODO`, `TBD`, or “implement later” placeholders remain. Each task names exact files, commands, and intended code shape.

### Type consistency

- `GratitudeReframeResponse` stays the config-owned response model.
- `moodIntensity` and `finalMoodIntensity` are treated consistently as `0-10`.
- Shared recap generalization is constrained to a reusable section model rather than unnamed ad hoc props.

