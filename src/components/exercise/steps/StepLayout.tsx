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
        className="flex-1"
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
        <View className="flex-1">{children}</View>
      </Pressable>
    );
  },
);

StepLayout.displayName = "StepLayout";
