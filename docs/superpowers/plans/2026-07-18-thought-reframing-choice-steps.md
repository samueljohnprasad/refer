# Thought Reframing Choice Steps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace high-noise emotion pills, stacked thought-pattern cards, and default AI surfaces with compact choices, flat pattern rows, and learner-requested inline help.

**Architecture:** Keep response state, validation, and exercise-shell behavior inside the existing thought-reframing flow. Change only the two step render branches and their local choice components; AI output remains existing input data but becomes invisible until an explicit disclosure is opened.

**Tech Stack:** React 19, React Native 0.85, Expo Router, TypeScript, NativeWind classes, Feather icons.

## Global Constraints

- Preserve `ThoughtReframingResponse`, selection limits, config validation, header, footer, and navigation behavior.
- Keep Cormorant titles and Geist operational text.
- Keep choice targets at least 44 points high.
- Do not add dependencies or modify package-manager state.
- Do not use cards, gradients, blur, modal AI explanations, AI labels, or assistant decoration.
- Keep AI pattern suggestions completely hidden until `Need help spotting a pattern?` is opened.
- Do not commit because the target files already contain unrelated user-owned changes.

---

### Task 1: Compact Emotion Choices

**Files:**
- Modify: `src/exercises/thoughtReframing/customSteps.tsx:562`
- Modify: `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx:1`

**Interfaces:**
- Consumes: `EmotionOption`, `EmotionRating[]`, `selectedEmotions`, and `onUpdate` from the existing flow.
- Produces: unchanged `selectedEmotions: EmotionRating[]` updates through `handleToggle(name)`.

- [ ] **Step 1: Record current state assumptions**

Confirm with source inspection that the maximum remains three, selection uses `EmotionRating`, and the config requires at least one selected emotion.

Run:

```bash
sed -n '562,674p' src/exercises/thoughtReframing/customSteps.tsx
sed -n '145,190p' src/exercises/thoughtReframing/config.ts
```

Expected: `MAX_EMOTIONS = 3`, toggle writes `selectedEmotions`, and validation checks `length >= 1`.

- [ ] **Step 2: Implement the compact field treatment**

Change `EmotionChip` to a stable 48-point field with an 8-point radius, restrained border, existing emoji and label, and trailing check. Keep checkbox semantics, pressed feedback, disabled behavior, and a selected tonal wash.

Required shape:

```tsx
<Pressable
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isSelected, disabled: isDisabled }}
  className="w-full rounded-lg border px-3 flex-row items-center"
  style={({ pressed }) => ({
    minHeight: 48,
    borderColor: isSelected ? SAGE[500] : BRAND_BORDER,
    backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
    opacity: pressed ? 0.72 : 1,
  })}
>
```

- [ ] **Step 3: Remove hidden AI ordering and add selection status**

Render `EMOTION_OPTIONS` in canonical order. Do not sort by `aiSuggestions` and do not mark suggested emotions. Add non-interactive status text beside the instruction:

```tsx
<View className="mb-5 flex-row items-center justify-between">
  <Text variant="body" className="text-[15px] leading-[20px]">
    Pick up to 3.
  </Text>
  <Text variant="caption" className="text-sage-700">
    {selectedEmotions.length}/3 selected
  </Text>
</View>
```

Keep the existing two-column grid and disable only unselected choices at the limit.

- [ ] **Step 4: Verify emotion behavior statically**

Run:

```bash
rg -n "aiSuggestedNames|suggested=|selectedEmotions.length.*selected|MAX_EMOTIONS" src/exercises/thoughtReframing/customSteps.tsx
git diff --check -- src/exercises/thoughtReframing/customSteps.tsx src/screens/ThoughtReframingScreen/components/EmotionChip.tsx
```

Expected: no emotion AI ordering or suggestion prop remains in the step; selection count and maximum remain; diff check exits zero.

---

### Task 2: Flat Thought-Pattern List And Optional Help

**Files:**
- Modify: `src/exercises/thoughtReframing/customSteps.tsx:674`
- Modify: `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx:1`

**Interfaces:**
- Consumes: existing `selectedDistortions`, `aiSuggestions`, `isAiLoading`, and `aiError` step props.
- Produces: unchanged `selectedDistortions: CognitiveDistortionKey[]` updates through `handleToggle(key)`.

- [ ] **Step 1: Replace cards with flat checkbox rows**

Change `DistortionCard` into a border-bottom row. Keep its public props unchanged so no other consumer breaks. Use a subtle selected wash and trailing filled check without a surrounding card:

```tsx
<Pressable
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isSelected, disabled: isDisabled }}
  className="border-b border-sage-100/70 px-1 py-3.5"
  style={({ pressed }) => ({
    minHeight: 72,
    backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
    opacity: pressed ? 0.72 : 1,
  })}
>
```

Keep icon, label, concise existing description, and 24-point trailing selection control.

- [ ] **Step 2: Remove default AI surfaces**

Delete `activeAiDistortionKey`, `activeAiDistortion`, the default AI read block, and the modal/blur tree. Remove now-unused `Modal`, `BlurView`, and `Card` imports only after confirming no later code in `customSteps.tsx` uses them.

Run before import removal:

```bash
rg -n "Modal|BlurView|<Card|activeAiDistortion" src/exercises/thoughtReframing/customSteps.tsx
```

- [ ] **Step 3: Add closed-by-default optional help state**

Add local state:

```tsx
const [showPatternHelp, setShowPatternHelp] = useState(false);
const [expandedExplanationKey, setExpandedExplanationKey] = useState<string | null>(null);
```

Render `Need help spotting a pattern?` after the manual list. Expose `accessibilityState={{ expanded: showPatternHelp }}`. Render loading, error, and up to two possible matches only while `showPatternHelp` is true.

- [ ] **Step 4: Add inline suggested matches and rationale disclosure**

For each available match, render one flat row with the pattern label, a `Use` or selected check action, and a separate `Why?` control. `Why?` toggles only that explanation and exposes expanded state. Use the existing generated explanation directly, with no modal and no AI wording.

Required interaction:

```tsx
onPress={() =>
  setExpandedExplanationKey((current) =>
    current === distortion.key ? null : distortion.key,
  )
}
```

When help closes, also clear `expandedExplanationKey`. Suggested selection must call the existing `handleToggle` path.

- [ ] **Step 5: Keep progressive disclosure and selected visibility**

Show up to four patterns total, with selected patterns pinned into those visible slots. Keep `More patterns` / `Fewer patterns` through the existing `MoreOptionsButton`; ensure the hidden count never becomes negative.

- [ ] **Step 6: Verify pattern behavior statically**

Run:

```bash
rg -n "AI read|AI summary|BlurView|<Modal|Need help spotting a pattern|Why\?|showPatternHelp|expandedExplanationKey" src/exercises/thoughtReframing/customSteps.tsx
git diff --check -- src/exercises/thoughtReframing/customSteps.tsx src/screens/ThoughtReframingScreen/components/DistortionCard.tsx
```

Expected: no old AI card/modal copy or components; help and rationale controls exist; diff check exits zero.

---

### Task 3: Type And Regression Verification

**Files:**
- Verify: `src/exercises/thoughtReframing/customSteps.tsx`
- Verify: `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx`
- Verify: `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx`

**Interfaces:**
- Consumes: completed Task 1 and Task 2 source.
- Produces: evidence that touched files add no TypeScript or whitespace regression.

- [ ] **Step 1: Run whitespace validation**

```bash
git diff --check
```

Expected: exit zero.

- [ ] **Step 2: Run TypeScript and isolate touched paths**

```bash
./node_modules/.bin/tsc --noEmit --pretty false 2>&1 | tee /tmp/happy-choice-steps-tsc.log
rg -n "customSteps|EmotionChip|DistortionCard" /tmp/happy-choice-steps-tsc.log
```

Expected: repository-wide TypeScript may remain nonzero because of pre-existing errors, but the second command prints no touched-file errors.

- [ ] **Step 3: Review final scoped diff**

```bash
git diff -- src/exercises/thoughtReframing/customSteps.tsx src/screens/ThoughtReframingScreen/components/EmotionChip.tsx src/screens/ThoughtReframingScreen/components/DistortionCard.tsx
```

Expected: only the approved emotion, pattern-row, and optional-help changes are present among the existing user-owned edits.

- [ ] **Step 4: Defer visual verification explicitly**

Do not start agent-device or simulator work in this pass. Record simulator verification as pending until the user requests it.
