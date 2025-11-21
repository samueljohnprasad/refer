import React, { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { atom, useAtom } from "jotai";
import { Text } from "@/components/Themed";
import {
  KeyboardAvoidingView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";

// Types and Constants
import { OnBoardingFormData, StepsAppProps } from "./types";
import { MOODS, TOTAL_STEPS, BUTTON_COLOR } from "./constants";

// Components
import { Dots } from "./steps/dots";
import { SplitButton } from "./steps/split-button";
import { StepInput } from "./renderStepInput";

// Hooks
import { useStepNavigation } from "./hooks/useStepNavigation";
import {
  useBackgroundAnimation,
  glassOverlayBaseStyle,
} from "./hooks/useBackgroundAnimation";

// Global state atom
export const onboardFormDataAtom = atom<OnBoardingFormData>({
  name: "",
  ageRange: undefined,
  gender: undefined,
  reasons: [],
});

/**
 * Main onboarding stepper component
 * Manages multi-step onboarding flow with form data collection
 */
const App = ({ onComplete }: StepsAppProps) => {
  // Loading state
  const [loading, setLoading] = React.useState(false);

  // Form data state
  const [formData, setFormData] =
    useAtom<OnBoardingFormData>(onboardFormDataAtom);

  // Navigation state and methods
  const {
    currentStep,
    splitted,
    setSplitted,
    isLastStep,
    setIsLastStep,
    activeIndex,
    increaseActiveIndex,
    decreaseActiveIndex,
  } = useStepNavigation();

  // Background animations
  const { backgroundAnimatedStyle, glassOverlayStyle } = useBackgroundAnimation(
    activeIndex.value,
    currentStep,
    setIsLastStep
  );

  // Keyboard animation
  const { height } = useGradualAnimation();
  const keyboardPadding = useAnimatedStyle(
    () => ({
      height: height.value,
    }),
    []
  );

  // Update isLastStep when activeIndex changes
  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      runOnJS(setIsLastStep)(index === TOTAL_STEPS - 1);
    }
  );

  // Helper to update form data
  const updateFormData = useCallback(
    (updates: Partial<OnBoardingFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    [setFormData]
  );

  // Get current mood definition
  const currentMood = MOODS[currentStep];

  // Button labels
  const rightLabel = isLastStep ? " Start Your First Entry 🚀" : "Continue";

  // Handle main action (Continue/Complete)
  const handleMainAction = useCallback(async () => {
    if (isLastStep) {
      try {
        setLoading(true);
        await onComplete?.(formData);
      } finally {
        setLoading(false);
      }
      return;
    }
    increaseActiveIndex();
    setSplitted(true);
  }, [isLastStep, formData, onComplete, increaseActiveIndex, setSplitted]);

  // Handle back action
  const handleBackAction = useCallback(() => {
    decreaseActiveIndex();
  }, [decreaseActiveIndex]);

  return (
    <KeyboardAvoidingView className="flex-1">
      <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
        {/* Premium glass overlay for depth */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            glassOverlayBaseStyle.base,
            glassOverlayStyle,
          ]}
        />

        {/* Content area with proper spacing */}
        <View
          className="flex-1 w-full"
          style={{ paddingTop: 70, paddingBottom: 30 }}
        >
          <StepInput
            currentMood={currentMood}
            formData={formData}
            updateFormData={updateFormData}
          />
        </View>

        {/* Bottom section for progress and buttons */}
        <View className="w-full" style={{ marginTop: 20 }}>
          {/* Premium progress indicator with step labels */}
          <View className="px-6 mb-2">
            <Dots activeIndex={activeIndex} count={TOTAL_STEPS} dotSize={18} />
          </View>

          {/* Premium navigation buttons with glass effect */}
          <View style={{ marginTop: 24, marginBottom: 24 }}>
            <SplitButton
              loading={loading}
              splitted={splitted}
              mainAction={{
                label: "Continue",
                labelColor: "white",
                onPress: handleMainAction,
                backgroundColor: BUTTON_COLOR,
              }}
              leftAction={{
                label: "Back",
                labelColor: "#64748B",
                onPress: handleBackAction,
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
              rightAction={{
                label: rightLabel,
                labelColor: "white",
                iconVisible: true,
                onPress: handleMainAction,
                backgroundColor: BUTTON_COLOR,
              }}
            />
          </View>

          <Animated.View style={keyboardPadding} pointerEvents="none" />
          <KeyboardToolbar
            pointerEvents="none"
            content={<Text></Text>}
            showArrows={false}
            insets={{ left: 16, right: 0 }}
            doneText="Close keyboard"
          />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export { App };
