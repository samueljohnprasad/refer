# ABC Analysis Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ABC Analysis on the shared CBT exercise system so it matches Thought Reframing, Thought Catcher, and Gratitude Reframe in flow structure, input treatment, summary structure, and visible copy.

**Architecture:** Keep the existing `ABCAnalysisResponse` storage shape, but change the visible step sequence and presentation. Reuse the shared intro, text-entry, slider, and recap components; add or extend a shared emotion-selection path only if the current reusable selectors cannot support the new `How did you feel?` step cleanly. Keep AI support visually secondary and preserve at least two visible example starters on relevant text-entry steps.

**Tech Stack:** Expo Router, React Native, TypeScript, NativeWind-style className styling, shared exercise step components under `src/components/exercise/steps`, shared recap components under `src/components/exercise`.

## Global Constraints

- move ABC off older screen-specific patterns
- reuse the shared CBT intro, input, slider, and recap systems
- reduce therapy jargon in the visible UI
- keep the ABC structure in the exercise logic without making the user decode it
- use plain language first
- keep suggestions and AI visually secondary
- preserve the completed journey in a form that still makes sense later
- same 0-10 model
- same input height as the shared CBT text-entry steps
- same always-available voice affordance
- keep at least two visible starter examples by default on relevant text-entry steps
- no glow by default
- no blue helper card
- no new test coverage
- avoid broad refactors outside ABC and the shared components directly needed for ABC alignment

---

## File Structure

### Existing files to modify

- `src/exercises/abcAnalysis/config.ts`
  - owns ABC step order, step labels, slider titles, intro metadata, and AI wiring
- `src/exercises/abcAnalysis/customSteps.tsx`
  - currently owns older ABC-specific text and consequence screens; should become a thin layer over shared step primitives
- `src/exercises/abcAnalysis/ABCSummaryStep.tsx`
  - currently uses a custom completion design; should move onto shared recap/timeline composition
- `src/components/exercise/steps/MultiChoiceStep.tsx`
  - candidate shared selector to support the new `How did you feel?` step with 1-3 selections and calmer CBT styling
- `src/components/exercise/ThoughtRecordRecap.tsx`
  - candidate shared summary layer if ABC needs a generic recap variant for “emotion + action + reframe + predicted change”

### Files to inspect during implementation but not change unless necessary

- `src/components/exercise/steps/TextInputStep.tsx`
- `src/components/exercise/steps/SliderStep.tsx`
- `src/components/exercise/intro/ExerciseIntro.tsx`
- `src/components/exercise/ReflectionTimeline.tsx`
- `src/types/exerciseFlow.ts`

### No new files expected unless a shared generic helper becomes necessary

- If a new helper is needed, it must be shared and named generically under `src/components/exercise/` or `src/components/exercise/steps/`, not under `src/exercises/abcAnalysis/`.

---

### Task 1: Rebuild ABC config and flow sequence

**Files:**
- Modify: `src/exercises/abcAnalysis/config.ts`
- Inspect: `src/types/exerciseFlow.ts`

**Interfaces:**
- Consumes: `ExerciseConfig<ABCAnalysisResponse>`, `createStep(...)`, `IntroStep`, `SliderStep`
- Produces:
  - updated `abcAnalysisConfig: ExerciseConfig<ABCAnalysisResponse>`
  - step IDs in final order:
    - `"intro"`
    - `"pre_emotional_intensity"`
    - `"activating_event"`
    - `"belief"`
    - `"consequence_emotion"`
    - `"consequence_behavior"`
    - `"alternative_belief"`
    - `"new_consequence"`
    - `"post_emotional_intensity"`
    - `"summary"`

- [ ] **Step 1: Update intro content and bullet sequence**

Set the intro metadata to the shared CBT-style copy:

```ts
{
  title: "ABC Analysis",
  subtitle: "See how a moment, a thought, and a reaction connect.",
  duration: "7-10 min",
  bulletPoints: [
    "Name what happened",
    "Catch the automatic thought",
    "Notice the feeling and reaction",
    "Try a more balanced thought",
    "See what might change",
  ],
}
```

- [ ] **Step 2: Split the consequence step into two config steps**

Replace the single `"consequence"` step with:

```ts
{
  id: "consequence_emotion",
  component: ABCConsequenceEmotionStep,
  label: "How did you feel?",
  validate: (r) => r.consequenceEmotion.trim().length >= 1,
},
{
  id: "consequence_behavior",
  component: ABCConsequenceBehaviorStep,
  label: "What did you do next?",
  validate: (r) => r.consequenceBehavior.trim().length >= 1,
},
```

- [ ] **Step 3: Rewrite visible step labels to the approved language**

Keep field storage names stable while changing visible labels:

```ts
belief -> "Automatic thought"
alternative_belief -> "More balanced thought"
new_consequence -> "What might change now?"
```

- [ ] **Step 4: Align slider titles and subtitles**

Use:

```ts
pre_emotional_intensity:
  title: "How intense does it feel?"
  subtitle: "Before you unpack it, where is it right now?"

post_emotional_intensity:
  title: "How intense does it feel now?"
  subtitle: "After looking at the chain, where is it now?"
```

Keep the 0-10 scale and current neutral label styling.

- [ ] **Step 5: Keep AI wiring but remap it to the new steps**

Requirements:

- `activating_event` AI remains event-only
- `belief` AI still produces first-person thought suggestions
- `consequence_emotion` should provide emotion suggestions only
- `consequence_behavior` should provide reaction/behavior suggestions only
- `alternative_belief` and `new_consequence` keep their current semantic roles

If the current single consequence AI builder is reused, split the result handling at the step level instead of introducing duplicate prompt logic unless needed.

- [ ] **Step 6: Run a focused config sanity check**

Run:

```bash
rg -n 'id: "consequence|id: "consequence_emotion|id: "consequence_behavior' src/exercises/abcAnalysis/config.ts
```

Expected:

- old single `consequence` step removed
- both new split steps present exactly once

- [ ] **Step 7: Commit**

```bash
git add src/exercises/abcAnalysis/config.ts
git commit -m "refactor: split abc analysis flow steps"
```

---

### Task 2: Move ABC screens onto shared CBT input and selection patterns

**Files:**
- Modify: `src/exercises/abcAnalysis/customSteps.tsx`
- Modify if needed: `src/components/exercise/steps/MultiChoiceStep.tsx`
- Inspect: `src/components/exercise/steps/TextInputStep.tsx`

**Interfaces:**
- Consumes:
  - `TextInputStep`
  - `MultiChoiceStep`
  - `StepProps<ABCAnalysisResponse>`
- Produces:
  - `ABCActivatingEventStep`
  - `ABCBeliefStep`
  - `ABCConsequenceEmotionStep`
  - `ABCConsequenceBehaviorStep`
  - `ABCAlternativeBeliefStep`
  - `ABCNewConsequenceStep`

- [ ] **Step 1: Remove the older screen-local text input scaffolding**

Delete or stop using:

- local `TextQuestionStep`
- direct `TextInput` layout blocks
- blue helper boxes
- older `SuggestionCards`-first screen treatments

Replace them with thin wrappers around shared step primitives.

- [ ] **Step 2: Rebuild the text-entry steps with `TextInputStep`**

Implement each wrapper using shared text step props:

```ts
ABCActivatingEventStep
  title: "What happened?"
  subtitle: "Start with the moment, not what it meant."
  tipText: "Write what a camera could have seen or heard."

ABCBeliefStep
  title: "Automatic thought"
  subtitle: "Write the sentence your mind added."
  tipText: "Do not make it fair yet. Just catch it."

ABCConsequenceBehaviorStep
  title: "What did you do next?"
  subtitle: "Name the reaction that followed."
  tipText: "What did you do, avoid, say, or repeat?"

ABCAlternativeBeliefStep
  title: "More balanced thought"
  subtitle: "Write a fairer version that still feels believable."
  referenceQuote: { label: "Automatic thought", text: response.belief }

ABCNewConsequenceStep
  title: "What might change now?"
  subtitle: "If you held that thought, what might feel or go differently?"
```

All of these must:

- use the same composer height as the shared CBT text-entry steps
- keep voice visible
- keep glow off
- keep at least two visible example starters through the shared examples area

- [ ] **Step 3: Rebuild the feeling step as a shared selector**

Preferred implementation:

- use `MultiChoiceStep`
- set `maxSelections={3}`
- feed a compact emotion option set already aligned with the CBT system

Target visible copy:

```ts
title: "How did you feel?"
subtitle: "Name the emotion that followed the thought."
```

If `MultiChoiceStep` is visually too old, restyle it generically to match the calmer CBT selection pattern instead of building an ABC-only emotion screen.

- [ ] **Step 4: Make `MultiChoiceStep` reusable enough for CBT emotion selection**

Only if needed, extend `MultiChoiceStep` with generic props such as:

```ts
layoutVariant?: "default" | "cbt_reflection"
showStepCount?: boolean
```

Use the same neutral white/sage surface language as the newer CBT screens. Do not introduce bright-green chip styling or old slate-heavy UI.

- [ ] **Step 5: Keep examples visible by default on relevant text steps**

In the ABC wrappers, pass example suggestions so the shared step can show at least two starter examples without leading with AI. AI suggestions may still appear, but they must stay visually secondary.

- [ ] **Step 6: Run a focused source check**

Run:

```bash
rg -n 'TextQuestionStep|backgroundColor: "#EFF6FF"|Generating ideas|AI Suggestions' src/exercises/abcAnalysis/customSteps.tsx src/components/exercise/steps/MultiChoiceStep.tsx
```

Expected:

- old blue helper styling removed
- no ABC-local legacy text-step scaffold left in use

- [ ] **Step 7: Commit**

```bash
git add src/exercises/abcAnalysis/customSteps.tsx src/components/exercise/steps/MultiChoiceStep.tsx
git commit -m "refactor: align abc analysis shared steps"
```

---

### Task 3: Rebuild the ABC summary on the shared recap system

**Files:**
- Modify: `src/exercises/abcAnalysis/ABCSummaryStep.tsx`
- Modify if needed: `src/components/exercise/ThoughtRecordRecap.tsx`
- Modify if needed: `src/components/exercise/ReflectionTimeline.tsx`

**Interfaces:**
- Consumes:
  - `ThoughtRecordRecap`
  - `RecapSection`
  - `StepProps<ABCAnalysisResponse>`
- Produces:
  - updated `ABCSummaryStep(props: StepProps<ABCAnalysisResponse>): React.JSX.Element`
  - generic recap support for ordered ABC sections if missing

- [ ] **Step 1: Remove the custom animated summary composition**

Delete or stop using:

- custom stagger/fade wrappers
- custom score bar block
- mascot/title hero that diverges from shared recap behavior
- ABC-specific card stack layout

Move the summary onto `ThoughtRecordRecap` unless a very small generic extension is needed.

- [ ] **Step 2: Map ABC data into the shared recap shape**

Use an ordered recap/timeline like:

```ts
sections: [
  { label: "What happened", value: response.activatingEvent },
  { label: "Automatic thought", value: response.belief, tone: "serif" },
  { label: "How you felt", value: response.consequenceEmotion },
  { label: "What you did next", value: response.consequenceBehavior },
  { label: "More balanced thought", value: response.alternativeBelief },
  { label: "What might change now", value: response.newConsequence },
]
```

Use:

```ts
title: "ABC complete"
subtitle: "Here’s the chain you worked through."
```

Keep before/after intensity through the shared score-shift UI.

- [ ] **Step 3: Add a small generic recap extension only if ABC truly needs it**

Allowed shared extensions:

- support a custom score label such as `"Intensity"`
- support after-timeline content if the save-action needs placement
- support unnumbered ordered recap sections without changing the recap visual language

Do not add any ABC-named props to shared recap components.

- [ ] **Step 4: Preserve save and deeper-navigation behavior**

If the current summary supports saving the balanced thought or navigating deeper, keep that behavior only if it still fits the shared recap layout cleanly. Prefer the shared action placement rather than rebuilding custom summary chrome.

- [ ] **Step 5: Run a focused summary sanity check**

Run:

```bash
rg -n 'ABC complete|What happened|Automatic thought|How you felt|What you did next|More balanced thought|What might change now' src/exercises/abcAnalysis/ABCSummaryStep.tsx
```

Expected:

- summary labels match the approved plain-language flow
- old ABC-specific headline/card language removed

- [ ] **Step 6: Commit**

```bash
git add src/exercises/abcAnalysis/ABCSummaryStep.tsx src/components/exercise/ThoughtRecordRecap.tsx src/components/exercise/ReflectionTimeline.tsx
git commit -m "refactor: move abc summary onto shared recap"
```

---

### Task 4: Final ABC cleanup and verification

**Files:**
- Modify if needed: `src/exercises/abcAnalysis/config.ts`
- Modify if needed: `src/exercises/abcAnalysis/customSteps.tsx`
- Modify if needed: `src/exercises/abcAnalysis/ABCSummaryStep.tsx`
- Modify if needed: `src/components/exercise/steps/MultiChoiceStep.tsx`
- Modify if needed: `src/components/exercise/ThoughtRecordRecap.tsx`

**Interfaces:**
- Consumes: completed ABC flow and any shared reusable selector/recap updates from Tasks 1-3
- Produces: final code-verified ABC Analysis redesign with no new test files

- [ ] **Step 1: Remove stale ABC-local imports and dead UI paths**

Clean out obsolete imports and dead code left from the old implementation, including unused animation helpers, unused card helpers, and unused direct text-input blocks.

- [ ] **Step 2: Run narrow formatting and static checks**

Run:

```bash
git diff --check
```

Expected:

- no whitespace or patch-format issues

Then run:

```bash
npx tsc --noEmit --pretty false 2>&1 | rg 'abcAnalysis|MultiChoiceStep|ThoughtRecordRecap|ReflectionTimeline'
```

Expected:

- no matches for the changed ABC/shared files

If the command exits non-zero because `rg` finds nothing, that is acceptable; the important condition is no reported errors for changed files.

- [ ] **Step 3: Sanity-review the final flow shape in source**

Run:

```bash
rg -n 'How did you feel\\?|What did you do next\\?|Automatic thought|More balanced thought|What might change now' src/exercises/abcAnalysis
```

Expected:

- the plain-language flow copy appears in config/custom steps/summary
- the old visible `belief`, `alternative belief`, and `new consequence` phrasing is gone from the user-facing ABC screens

- [ ] **Step 4: Commit**

```bash
git add src/exercises/abcAnalysis src/components/exercise/steps/MultiChoiceStep.tsx src/components/exercise/ThoughtRecordRecap.tsx src/components/exercise/ReflectionTimeline.tsx
git commit -m "feat: redesign abc analysis flow"
```

---

## Self-Review

### Spec coverage

- shared intro, slider, input, and recap reuse: covered by Tasks 1-3
- split consequence step into feeling + behavior: covered by Tasks 1-2
- plain-language copy replacement for visible therapy jargon: covered by Tasks 1-4
- visible starter examples and secondary AI treatment: covered by Task 2
- summary as a readable later record: covered by Task 3
- no new tests: enforced in global constraints and reflected in task steps

### Placeholder scan

- no `TODO`, `TBD`, or deferred placeholders remain
- file paths, step IDs, and target copy are explicit
- verification commands are concrete

### Type consistency

- response field names stay on the existing `ABCAnalysisResponse` shape
- new split config steps write to `consequenceEmotion` and `consequenceBehavior`
- visible copy changes do not require storage-field renames
