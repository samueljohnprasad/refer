# Multiple Choice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `MultipleChoiceExercise` component with a 2-step check flow (Check -> Continue) and a colored success/error footer banner matching Duolingo.

**Architecture:** We will update `LessonScreen` to support a `footerStatus` state (default, success, error). We will update `NodeEngine` to manage a `checkStatus` state for scored exercises. The `MultipleChoiceExercise` will pass `{ isCorrect, optionId }` up to the engine.

**Tech Stack:** React Native, Expo, NativeWind

## Global Constraints
Use typescript, exact types, NativeWind for styles, standard git commit conventions.

---

### Task 1: Update Mock Data

**Files:**
- Modify: `src/data/mock/sleep-reset-flat.ts`

**Interfaces:**
- Updates `multiple_choice` payloads to include `subPrompt` inside `content`.

- [ ] **Step 1: Update multiple_choice payloads**
Add `subPrompt` to the first `multiple_choice` exercise payload in `src/data/mock/sleep-reset-flat.ts` (around line 300).
```typescript
    "content": {
      "prompt": "Your brain has 4 sleep stages. Which description matches 'deep sleep' (N3)?",
      "subPrompt": "Select the best answer...",
      "options": [
```

- [ ] **Step 2: Commit**
```bash
git add src/data/mock/sleep-reset-flat.ts
git commit -m "chore: add subPrompt to multiple_choice mock data"
```

---

### Task 2: Update LessonScreen and ActionFooter

**Files:**
- Modify: `src/components/ui/LessonScreen.tsx`

**Interfaces:**
- Consumes: ActionFooterProps

- [ ] **Step 1: Add status prop to ActionFooterProps**
In `src/components/ui/LessonScreen.tsx`, update `ActionFooterProps` to include `status?: "default" | "success" | "error"`.

```typescript
export interface ActionFooterProps {
  // ... existing props
  status?: "default" | "success" | "error";
}
```

- [ ] **Step 2: Update ActionFooter UI based on status**
Modify `ActionFooter` in `LessonScreen.tsx` to conditionally render a colored background and a banner message based on `status`.
```tsx
const ActionFooter: React.FC<ActionFooterProps> = ({
  // ... existing props
  status = "default",
}) => {
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <ScreenLayout.Footer 
      variant={variant} 
      style={style} 
      className={`${className || ""} ${isSuccess ? "bg-green-100" : isError ? "bg-red-100" : "bg-white"}`}
    >
      <View className="w-full gap-1">
        {isSuccess && (
          <View className="flex-row items-center mb-4 ml-1">
            <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center mr-3">
              <Text className="text-white font-bold text-lg">✓</Text>
            </View>
            <Text className="text-green-600 font-bold text-xl">Awesome!</Text>
          </View>
        )}
        {isError && (
          <View className="flex-row items-center mb-4 ml-1">
            <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center mr-3">
              <Text className="text-white font-bold text-lg">✗</Text>
            </View>
            <Text className="text-red-500 font-bold text-xl">Incorrect</Text>
          </View>
        )}

        <Button
          label={primaryLabel}
          onPress={onPrimaryPress}
          disabled={primaryDisabled}
          loading={primaryLoading}
          leftIcon={primaryLeftIcon}
          rightIcon={primaryRightIcon}
          // The Button component may need to support custom colors, or we can just pass a className to style it.
          // For now, we'll use primary variant and rely on NativeWind classes to override if needed.
          className={isSuccess ? "bg-green-500 border-green-600" : isError ? "bg-red-500 border-red-600" : ""}
          variant="primary"
          fullWidth
        />
        // ... secondary button
```
Note: Ensure `Button` accepts `className` prop to override styles if needed.

- [ ] **Step 3: Commit**
```bash
git add src/components/ui/LessonScreen.tsx
git commit -m "feat: add success/error status to LessonScreen footer"
```

---

### Task 3: Update NodeEngine Check Flow

**Files:**
- Modify: `src/components/node/NodeEngine.tsx`

**Interfaces:**
- Consumes: `LessonScreen` status prop.

- [ ] **Step 1: Add checkStatus to NodeEngine**
```tsx
  const [checkStatus, setCheckStatus] = useState<"idle" | "success" | "error">("idle");
```
Reset it in the `useEffect` when exercise changes:
```tsx
    setCheckStatus("idle");
```

- [ ] **Step 2: Update handleContinuePress logic**
```tsx
  const handleContinuePress = () => {
    // If scored and we haven't checked yet
    if (currentExercise.isScored && checkStatus === "idle") {
      if (currentResponse?.isCorrect) {
        setCheckStatus("success");
      } else {
        setCheckStatus("error");
      }
      return;
    }

    // 1. Save the response
    // ... rest of the existing advance logic
```

- [ ] **Step 3: Pass status and label to LessonScreen**
```tsx
    <LessonScreen
      progress={(currentIndex + 1) / exercises.length}
      onClose={onClose || (() => onNodeComplete(localResponses))}
      primaryLabel={
        currentExercise.isScored && checkStatus === "idle"
          ? "Check"
          : (currentIndex === exercises.length - 1 ? "Finish" : "Continue")
      }
      primaryDisabled={!isCurrentExerciseReady}
      onPrimaryPress={handleContinuePress}
      status={checkStatus} // Passed down to ActionFooter
    >
```

- [ ] **Step 4: Commit**
```bash
git add src/components/node/NodeEngine.tsx
git commit -m "feat: add check flow to NodeEngine for scored exercises"
```

---

### Task 4: Implement MultipleChoiceExercise Component

**Files:**
- Modify: `src/components/exercise/MultipleChoiceExercise.tsx`

**Interfaces:**
- Consumes: payload with options and correct boolean.

- [ ] **Step 1: Implement the UI and interaction logic**
```tsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';

export const MultipleChoiceExercise = ({ payload, onInteraction }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedId(option.id);
    onInteraction({
      optionId: option.id,
      isCorrect: option.correct === true,
      text: option.text,
    });
  };

  const { prompt, subPrompt, options } = payload.content || {};

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and respond"}
        </Text>
      </View>

      <View className="flex-row items-start mb-6">
        <View className="mr-5 mt-2 z-10">
          <Mascot state="panda-happy" size={80} />
        </View>
        <View className="flex-1 bg-white rounded-3xl p-5 border-2 border-slate-200 relative">
          <View 
            className="absolute -left-[11px] top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200" 
            style={{ transform: [{ rotate: '45deg' }] }} 
          />
          <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
            {prompt}
          </Text>
        </View>
      </View>

      {subPrompt && (
        <Text className="text-slate-500 font-bold text-lg mb-6 tracking-wide">
          {subPrompt}
        </Text>
      )}

      <View className="gap-4">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(opt)}
              className={`p-5 rounded-2xl border-2 items-center justify-center bg-white ${
                isSelected ? 'border-sky-400 bg-sky-50' : 'border-slate-200'
              }`}
            >
              <Text className={`text-lg font-medium ${isSelected ? 'text-sky-600' : 'text-slate-600'}`}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
```

- [ ] **Step 2: Commit**
```bash
git add src/components/exercise/MultipleChoiceExercise.tsx
git commit -m "feat: implement MultipleChoiceExercise component"
```
