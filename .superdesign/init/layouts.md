# Shared Layouts

## Exercise route

The route resolves an exercise type and renders the shared ExerciseFlowScreen shell.

## `app/tabs/screens/exercise-flow.tsx`

```tsx
import React from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { ExerciseType } from "@/src/types/exerciseFlow";
import { ExerciseFlowScreen } from "@/src/screens/ExerciseFlowScreen/ExerciseFlowScreen";

export default function ExerciseFlowRoute() {
  const params = useLocalSearchParams<{
    type: string;
    entryId?: string;
    readOnly?: string;
  }>();

  return (
    <ExerciseFlowScreen
        exerciseType={params.type as ExerciseType}
        entryId={params.entryId}
        readOnly={params.readOnly === "true"}
      />
  );
}
```

## Step layout

Shared step header, progress, keyboard dismissal, and content wrapper.

## `src/components/exercise/steps/StepLayout.tsx`

```tsx
import React, { useCallback, useRef } from "react";
import { Keyboard, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { StepHeader } from "@/src/screens/ThoughtReframingScreen/components/StepHeader";


const DEBOUNCE_MS = 400;

interface StepLayoutProps {
  title: string;
  subtitle: string;
  progress: number;
  stepIndex: number;
  totalSteps: number;
  canGoBack: boolean;
  isValid: boolean;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
  nextLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  /** If true, wraps children in a ScrollView */
  scrollable?: boolean;
}

export const StepLayout: React.FC<StepLayoutProps> = React.memo(
  ({
    title,
    subtitle,
    progress,
    stepIndex,
    totalSteps,
    canGoBack,
    isValid,
    onBack,
    onNext,
    onClose,
    nextLabel,
    isLoading,
    children,
    scrollable = false,
  }) => {
    const lastTapRef = useRef(0);

    const guardedNext = useCallback(() => {
      const now = Date.now();
      if (now - lastTapRef.current < DEBOUNCE_MS) return;
      lastTapRef.current = now;
      Keyboard.dismiss();
      Haptics.selectionAsync().catch(() => {});
      onNext();
    }, [onNext]);

    const guardedBack = useCallback(() => {
      const now = Date.now();
      if (now - lastTapRef.current < DEBOUNCE_MS) return;
      lastTapRef.current = now;
      Keyboard.dismiss();
      Haptics.selectionAsync().catch(() => {});
      onBack();
    }, [onBack]);

    return (
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <StepHeader
          title={title}
          subtitle={subtitle}
          progress={progress}
          stepNumber={stepIndex + 1}
          totalSteps={totalSteps}
        />
        <View className="pb-4">{children}</View>
      </Pressable>
    );
  },
);

StepLayout.displayName = "StepLayout";
```

