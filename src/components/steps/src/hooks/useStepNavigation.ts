import { useCallback, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { TOTAL_STEPS } from "../constants";


/**
 * Custom hook to manage onboarding step navigation
 */
export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [splitted, setSplitted] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);

  const activeIndex = useSharedValue(0);

  const increaseActiveIndex = useCallback(() => {
    if (activeIndex.value < TOTAL_STEPS - 1) {
      activeIndex.value = activeIndex.value + 1;
      setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
    }
  }, [activeIndex]);

  const decreaseActiveIndex = useCallback(() => {
    if (activeIndex.value === 1) {
      setSplitted(false);
    }
    activeIndex.value = Math.max(0, activeIndex.value - 1);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, [activeIndex]);

  return {
    currentStep,
    splitted,
    setSplitted,
    isLastStep,
    setIsLastStep,
    activeIndex,
    increaseActiveIndex,
    decreaseActiveIndex,
  };
};
