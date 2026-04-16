import React, { useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StepHeader } from "@/src/screens/ThoughtReframingScreen/components/StepHeader";
import { StepNavigation } from "@/src/screens/ThoughtReframingScreen/components/StepNavigation";

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
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

    const content = (
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

        {scrollable ? (
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
        )}

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={guardedBack}
          onNext={guardedNext}
          nextLabel={nextLabel}
          isLoading={isLoading}
        />
      </Pressable>
    );

    if (Platform.OS === "ios") {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  },
);

StepLayout.displayName = "StepLayout";
