import React, { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { atom, useAtom } from "jotai";
import { Text } from "@/components/Themed";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { OnBoardingFormData, StepsAppProps } from "./types";
import { MOODS, TOTAL_STEPS, BUTTON_COLOR } from "./constants";
import { Dots } from "./steps/dots";
import { SplitButton } from "./steps/split-button";
import { StepInput } from "./renderStepInput";
import { useStepNavigation } from "./hooks/useStepNavigation";
import {
  useBackgroundAnimation,
  glassOverlayBaseStyle,
} from "./hooks/useBackgroundAnimation";
import { Stack } from "expo-router";

export const onboardFormDataAtom = atom<OnBoardingFormData>({
  name: "",
  ageRange: undefined,
  gender: undefined,
  reasons: [],
});

const App = ({ onComplete }: StepsAppProps) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] =
    useAtom<OnBoardingFormData>(onboardFormDataAtom);

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

  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      runOnJS(setIsLastStep)(index === TOTAL_STEPS - 1);
    }
  );

  const updateFormData = useCallback(
    (updates: Partial<OnBoardingFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    [setFormData]
  );

  const currentMood = MOODS[currentStep];

  const rightLabel = isLastStep ? " Start Your First Entry 🚀" : "Continue";

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

  const handleBackAction = useCallback(() => {
    decreaseActiveIndex();
  }, [decreaseActiveIndex]);

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => {
            return (
              <Animated.View
                style={[{ backgroundColor: "#fff" }, backgroundAnimatedStyle]}
                className="h-32 items-start justify-end px-4"
              >
                <View className="mb-5">
                  <Dots
                    activeIndex={activeIndex}
                    count={TOTAL_STEPS}
                    dotSize={18}
                  />
                </View>
              </Animated.View>
            );
          },
        }}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          glassOverlayBaseStyle.base,
          glassOverlayStyle,
        ]}
      />

      <View className="flex-1 w-full">
        <StepInput
          currentMood={currentMood}
          formData={formData}
          updateFormData={updateFormData}
        />
      </View>

      <View className="w-full border-t border-gray-300">
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
