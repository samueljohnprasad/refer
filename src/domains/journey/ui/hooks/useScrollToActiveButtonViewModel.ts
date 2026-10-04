import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export type ScrollToActiveButtonDirection = "up" | "down";
export type ScrollToActiveButtonMode = "direction" | "focus";

export interface ScrollToActiveButtonProps {
  isVisible: boolean;
  direction?: ScrollToActiveButtonDirection;
  mode?: ScrollToActiveButtonMode;
  onPress: () => void;
}

const FADE_DURATION = 150;
const SLIDE_DURATION = 300;

export const getHiddenOffset = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): number => {
  return direction === "down" ? 20 : -20;
};

export const getAccessibilityLabel = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
  t: TFunction<"journeys">,
): string => {
  if (mode === "focus") return t("returnToCurrentLesson");
  return direction === "up"
    ? t("scrollUpToActiveLesson")
    : t("scrollDownToActiveLesson");
};

export function useScrollToActiveButtonViewModel({
  isVisible,
  direction = "down",
  mode = "direction",
  onPress,
}: ScrollToActiveButtonProps) {
  const { t } = useTranslation("journeys");
  const hiddenOffset = getHiddenOffset(mode, direction);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(hiddenOffset);

  useEffect(() => {
    const timingConfig = {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.quad),
    };
    if (isVisible) {
      opacity.value = withTiming(1, timingConfig);
      translateY.value = withTiming(0, timingConfig);
    } else {
      opacity.value = withTiming(0, { duration: FADE_DURATION });
      translateY.value = withTiming(hiddenOffset, timingConfig);
    }
  }, [isVisible, hiddenOffset, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const accessibilityLabel = getAccessibilityLabel(mode, direction, t);

  return {
    animatedStyle,
    accessibilityLabel,
    isVisible,
    direction,
    mode,
    onPress,
  };
}
