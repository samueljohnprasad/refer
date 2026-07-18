# Thought Reframing Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the six approved Superdesign screens as one calm Thought Reframing flow without changing saved response shapes or other exercises.

**Architecture:** Preserve the shared exercise shell and existing Thought Reframing state. Add backward-compatible display props to shared Intro/Slider infrastructure only where required, keep evidence behavior inside its existing local components, and reorder the dedicated summary component without changing persistence or completion callbacks.

**Tech Stack:** React 19, React Native 0.85, Expo Router, TypeScript, NativeWind classes, Feather/Hugeicons, `@react-native-community/slider`.

## Global Constraints

- Preserve `ThoughtReframingResponse`, step order, validators, analytics labels, save payloads, and AI request schemas.
- Preserve all five intro timeline stages and their full labels.
- Do not change default behavior for other exercises consuming `IntroStep`, `StepLayout`, `StepHeader`, or `SliderStep`.
- Keep examples collapsed by default and learner-authored input primary.
- Do not add dependencies or modify package-manager state.
- Do not commit because target files already contain user-owned edits.
- Defer simulator and agent-device verification until explicitly requested.

---

### Task 1: Preserve And Tighten The Full Intro Timeline

**Files:**
- Modify only if required: `src/components/exercise/steps/IntroStep.tsx`
- Verify: `src/exercises/thoughtReframing/config.ts:74`

**Interfaces:**
- Consumes: existing `title`, `subtitle`, `duration`, and `bulletPoints` props.
- Produces: unchanged intro navigation and five visible timeline stages.

- [ ] **Step 1: Confirm the configured timeline**

Run:

```bash
sed -n '70,105p' src/exercises/thoughtReframing/config.ts
sed -n '20,110p' src/components/exercise/steps/IntroStep.tsx
```

Expected: five approved labels, `hideHeader: true`, and `nextLabel: "Begin"` already exist.

- [ ] **Step 2: Keep timeline rows stable without adding descriptions**

Retain each stage as one node and one `body-bold` label. If source inspection confirms wrapping can detach the connector, replace the fixed connector height with a row-relative connector that fills the space between adjacent nodes. Do not add stage descriptions, secondary footer copy, cards, or new props.

- [ ] **Step 3: Remove only dead imports or spacing noise found in the touched block**

Keep panda, title, subtitle, duration, FadeInItem order, and Begin behavior unchanged. Do not reformat unrelated IntroStep consumers.

- [ ] **Step 4: Verify all stages remain present**

```bash
rg -n "Describe the triggering situation|Catch your automatic thought|Notice thought patterns|Weigh the evidence for and against|Create a balanced thought" src/exercises/thoughtReframing/config.ts
git diff --check -- src/components/exercise/steps/IntroStep.tsx src/exercises/thoughtReframing/config.ts
```

Expected: five matches and no whitespace errors.

---

### Task 2: Keep Automatic Thought Input Primary

**Files:**
- Modify: `src/exercises/thoughtReframing/customSteps.tsx:407`

**Interfaces:**
- Consumes: existing `situation`, `automaticThought`, optional generated suggestions, and update callback.
- Produces: unchanged `automaticThought: string` updates.

- [ ] **Step 1: Verify current approved behavior before editing**

Confirm the current branch already has an unframed `What happened` reference, dominant `GlowyInput`, `showThoughtSuggestions` initialized to false, and example selection that closes the disclosure.

- [ ] **Step 2: Remove only remaining duplicate instruction or unstable spacing**

Keep one teaching cue and one input requirement. Preserve the disclosure label behavior:

```tsx
{showThoughtSuggestions ? "Hide examples" : "Need an example?"}
```

Do not render loading, error, or suggestion rows unless the disclosure is open.

- [ ] **Step 3: Verify default state remains collapsed**

```bash
rg -n "useState\(false\)|Need an example\?|showThoughtSuggestions && isAiLoading|setShowThoughtSuggestions\(false\)" src/exercises/thoughtReframing/customSteps.tsx
```

Expected: closed initial state, gated loading, and collapse after selection.

---

### Task 3: Remove Duplicate Slider Step Count Safely

**Files:**
- Modify: `src/screens/ThoughtReframingScreen/components/StepHeader.tsx`
- Modify: `src/components/exercise/steps/StepLayout.tsx`
- Modify: `src/components/exercise/steps/SliderStep.tsx`
- Modify: `src/exercises/thoughtReframing/config.ts:136`

**Interfaces:**
- Consumes: current `stepNumber` and `totalSteps` props.
- Produces: optional `showStepCount?: boolean` propagated from SliderStep to StepLayout to StepHeader; default remains `true`.

- [ ] **Step 1: Add a backward-compatible StepHeader prop**

```tsx
interface StepHeaderProps {
  // existing props
  showStepCount?: boolean;
}

export const StepHeader = React.memo(
  ({ title, subtitle, stepNumber, totalSteps, showStepCount = true }) => {
    const hasStepCount =
      showStepCount &&
      typeof stepNumber === "number" &&
      typeof totalSteps === "number" &&
      totalSteps > 0;
```

- [ ] **Step 2: Propagate the option through StepLayout and SliderStep**

Add `showStepCount?: boolean` to both prop interfaces. Default it to `true` in SliderStep and pass it unchanged through StepLayout to StepHeader.

- [ ] **Step 3: Disable only the Thought Reframing rating labels**

In both initial and post-reframe SliderStep configurations, pass:

```tsx
showStepCount: false,
```

Do not change any other exercise config.

- [ ] **Step 4: Keep quote, value, and slider dimensions stable**

Use an unframed context block, a fixed-height value region, and existing slider accessibility values. Keep `Not true`, `Partly`, and `Completely`; do not add numeric labels under each anchor.

- [ ] **Step 5: Verify shared consumers remain defaulted**

```bash
rg -n "component: createStep\(SliderStep" src/exercises -g 'config.ts'
rg -n "showStepCount" src/screens/ThoughtReframingScreen/components/StepHeader.tsx src/components/exercise/steps/StepLayout.tsx src/components/exercise/steps/SliderStep.tsx src/exercises/thoughtReframing/config.ts
```

Expected: only Thought Reframing opts out; shared defaults remain true.

---

### Task 4: Flatten Evidence Rows And Collapse Examples

**Files:**
- Modify: `src/screens/ThoughtReframingScreen/components/BulletListInput.tsx`
- Modify: `src/exercises/thoughtReframing/customSteps.tsx:971`

**Interfaces:**
- Consumes: existing string arrays, `onAdd`, `onRemove`, voice transcription, generated suggestions, and read-only state.
- Produces: unchanged `evidenceFor: string[]` and `evidenceAgainst: string[]` updates.

- [ ] **Step 1: Add read-only support without changing editable defaults**

Add `readOnly?: boolean` defaulting to false. Always render saved rows; when read-only, hide the remove action and input block.

- [ ] **Step 2: Replace saved-item cards with flat rows**

Use a top/bottom hairline list. Each row contains a small sage bullet, wrapping text, and a 44-point icon-only remove target. The remove accessibility label must include the item position and text.

Required row structure:

```tsx
<View className="min-h-[52px] flex-row items-start border-b border-sage-100/70 py-3">
  <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-sage-400" />
  <Text className="flex-1 pr-2 text-[15px] leading-[21px] text-ink">
    {item}
  </Text>
  {!readOnly ? <Pressable className="h-11 w-11" /> : null}
</View>
```

- [ ] **Step 3: Keep the input dominant and controls stable**

Retain multiline input, voice, transcription state, add validation, and error copy. Reduce input radius to the existing 8-12 point range and ensure controls cannot resize the input.

- [ ] **Step 4: Use the same collapsed disclosure in both evidence steps**

Change closed copy from `Examples` to `Need an example?`. Keep `showEvidenceSuggestions` initialized false and gate all loading/error/example UI behind it.

- [ ] **Step 5: Close examples after selection and add thought context to Evidence Against**

After `toggleSuggestionItem`, call `setShowEvidenceSuggestions(false)`. Add an unframed left-rule context reference for `response.automaticThought` above the Evidence Against input. Change its subtitle to `What facts do not fit the prediction?`.

- [ ] **Step 6: Replace the bias-note card with quiet inline text**

If `showBiasNote` remains, render it as an unframed note with a left rule or plain caption. Do not use rounded background or border containers.

- [ ] **Step 7: Verify evidence behavior**

```bash
rg -n "rounded-xl px-4 py-3 mb-2|Need an example\?|showEvidenceSuggestions &&|setShowEvidenceSuggestions\(false\)|What facts do not fit the prediction" src/screens/ThoughtReframingScreen/components/BulletListInput.tsx src/exercises/thoughtReframing/customSteps.tsx
git diff --check -- src/screens/ThoughtReframingScreen/components/BulletListInput.tsx src/exercises/thoughtReframing/customSteps.tsx
```

Expected: old saved-item card class absent; both disclosures are gated and collapse after use.

---

### Task 5: Reorder And Harden The Editorial Summary

**Files:**
- Modify: `src/exercises/thoughtReframing/ThoughtReframingSummary.tsx`

**Interfaces:**
- Consumes: unchanged Thought Reframing response and coping-card mutation.
- Produces: unchanged save-card action, completion callback, and summary data.

- [ ] **Step 1: Preserve the outcome and save action**

Keep `Thought reframed`, the balanced thought band, save state, haptics, and error behavior unchanged.

- [ ] **Step 2: Reorder sections to match the approved reading sequence**

Render context before measurement:

```text
Balanced thought
Thought record: situation, first thought, emotions, patterns
Belief shift
Evidence supported / challenged
Completion note
```

Move existing JSX blocks; do not duplicate their data derivation or behavior.

- [ ] **Step 3: Prevent thought clipping and footer overlap**

Keep the first thought unrestricted by `numberOfLines`, use stable `leading-[29px]`, and increase summary bottom padding enough that the final completion note scrolls fully above the sticky Complete/Edit answers footer.

- [ ] **Step 4: Keep flat sections and concise evidence counts**

Preserve hairlines and whitespace. Keep evidence lists unframed and show counts in their headings. Do not add cards or accordions.

- [ ] **Step 5: Verify summary order and behavior**

```bash
rg -n "The thought record|What shifted|The evidence you tested|Save for a difficult moment|numberOfLines" src/exercises/thoughtReframing/ThoughtReframingSummary.tsx
git diff --check -- src/exercises/thoughtReframing/ThoughtReframingSummary.tsx
```

Expected: source order is thought record, shift, evidence; no line limit on the first thought.

---

### Task 6: Regression Verification

**Files:**
- Verify every file changed by Tasks 1-5.

**Interfaces:**
- Consumes: completed implementation.
- Produces: fresh evidence for whitespace, Jest availability, shared-consumer safety, and touched-file TypeScript status.

- [ ] **Step 1: Run whitespace validation**

```bash
git diff --check
```

Expected: exit zero.

- [ ] **Step 2: Run Jest without Watchman**

```bash
npm test -- --runInBand --watchAll=false --watchman=false --passWithNoTests
```

Expected: exit zero; currently the repository reports no tests found.

- [ ] **Step 3: Run TypeScript and isolate touched paths**

```bash
./node_modules/.bin/tsc --noEmit --pretty false
```

Expected: repository-wide TypeScript may remain nonzero because of existing unrelated failures. Confirm no errors reference IntroStep, StepHeader, StepLayout, SliderStep, customSteps, BulletListInput, ThoughtReframingSummary, or Thought Reframing config.

- [ ] **Step 4: Review the scoped diff and consumer list**

```bash
git diff -- src/components/exercise/steps/IntroStep.tsx src/screens/ThoughtReframingScreen/components/StepHeader.tsx src/components/exercise/steps/StepLayout.tsx src/components/exercise/steps/SliderStep.tsx src/screens/ThoughtReframingScreen/components/BulletListInput.tsx src/exercises/thoughtReframing/customSteps.tsx src/exercises/thoughtReframing/ThoughtReframingSummary.tsx src/exercises/thoughtReframing/config.ts
```

Expected: only approved flow changes and pre-existing user edits remain; shared defaults are backward-compatible.

