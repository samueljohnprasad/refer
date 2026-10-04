import React, { useCallback, useRef } from "react";
import { Keyboard, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { StepHeader } from "@/src/screens/ThoughtReframingScreen/components/StepHeader";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";


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
  showStepCount?: boolean;
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
    showStepCount = true,
  }) => {
    const lastTapRef = useRef(0);
    const translateCopy = useExerciseCopy();

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
          title={translateCopy(title)}
          subtitle={translateCopy(subtitle)}
          progress={progress}
          stepNumber={stepIndex + 1}
          totalSteps={totalSteps}
          showStepCount={showStepCount}
        />
        <View className="pb-4">{children}</View>
      </Pressable>
    );
  },
);

StepLayout.displayName = "StepLayout";
