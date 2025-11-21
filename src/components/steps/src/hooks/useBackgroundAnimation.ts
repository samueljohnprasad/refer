import { useEffect } from "react";
import { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import { BACKGROUND_COLORS } from "../constants";
import { StyleSheet } from "react-native";

/**
 * Custom hook to manage onboarding background animations
 */
export const useBackgroundAnimation = (
  activeIndexValue: number,
  currentStep: number,
  setIsLastStep: (value: boolean) => void
) => {
  const backgroundProgress = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  // Update background progress when step changes
  useEffect(() => {
    backgroundProgress.value = withTiming(activeIndexValue, { duration: 300 });
  }, [activeIndexValue, backgroundProgress]);

  // Update floating animation on step change
  useEffect(() => {
    floatingAnimation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(
        200,
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      )
    );
  }, [currentStep, floatingAnimation]);

  // Luxury gradient background animation
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const progress = backgroundProgress.value;
    return {
      backgroundColor: interpolateColor(
        progress,
        [0, 1, 2, 3, 4],
        BACKGROUND_COLORS
      ),
    };
  });

  // Glass overlay animation
  const glassOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(0.4, { duration: 500 }),
    };
  });

  return {
    backgroundAnimatedStyle,
    glassOverlayStyle,
    floatingAnimation,
  };
};

export const glassOverlayBaseStyle = StyleSheet.create({
  base: {
    backgroundColor: "rgba(255,255,255,0.15)",
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
  },
});
