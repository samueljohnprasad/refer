import { useEffect, useRef, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { OnboardingStepName, OnboardingStepConfig } from "../types";
import type { useOnboardingAnalytics } from "./useOnboardingAnalytics";

const STEP_ENTER_DURATION_MS = 200;

export function useOnboardingTransitions(
  currentStep: OnboardingStepName,
  currentStepIndex: number,
  currentStepConfig: OnboardingStepConfig,
  screenWidth: number,
  analytics: ReturnType<typeof useOnboardingAnalytics>,
  initialBackgroundColor: string,
) {
  // ponytail: remove horizontal slide (slideX) so screen doesn't shift left-to-right; keep clean opacity & bg fade
  const slideOpacity = useSharedValue(1);
  const backgroundOverlayOpacity = useSharedValue(0);

  const hasAnimatedStepRef = useRef(false);
  const currentBackgroundColorRef = useRef(initialBackgroundColor);
  const prevStepRef = useRef(currentStepIndex);

  const [containerBackgroundColor, setContainerBackgroundColor] =
    useState(initialBackgroundColor);
  const [transitionOverlayColor, setTransitionOverlayColor] = useState(
    initialBackgroundColor,
  );

  const backgroundOverlayStyle = useAnimatedStyle(() => ({
    opacity: backgroundOverlayOpacity.value,
  }));

  const stepContainerStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
  }));

  useEffect(() => {
    const nextBackgroundColor = currentStepConfig.backgroundColor;

    if (!hasAnimatedStepRef.current) {
      hasAnimatedStepRef.current = true;
      prevStepRef.current = currentStepIndex;
      currentBackgroundColorRef.current = nextBackgroundColor;
      setContainerBackgroundColor(nextBackgroundColor);
      setTransitionOverlayColor(nextBackgroundColor);
      backgroundOverlayOpacity.value = 0;
      slideOpacity.value = 1;
      analytics.trackStepViewed(currentStep, currentStepIndex);
      return;
    }

    // Ignore re-renders on the same step
    if (prevStepRef.current === currentStepIndex) {
      return;
    }

    prevStepRef.current = currentStepIndex;

    const previousBackgroundColor = currentBackgroundColorRef.current;
    if (nextBackgroundColor !== previousBackgroundColor) {
      currentBackgroundColorRef.current = nextBackgroundColor;
      setTransitionOverlayColor(previousBackgroundColor);
      setContainerBackgroundColor(nextBackgroundColor);
      backgroundOverlayOpacity.value = 1;
      backgroundOverlayOpacity.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    }

    slideOpacity.value = 0;
    slideOpacity.value = withTiming(1, {
      duration: STEP_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });

    analytics.trackStepViewed(currentStep, currentStepIndex);
  }, [currentStepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    containerBackgroundColor,
    transitionOverlayColor,
    backgroundOverlayStyle,
    stepContainerStyle,
  };
}
