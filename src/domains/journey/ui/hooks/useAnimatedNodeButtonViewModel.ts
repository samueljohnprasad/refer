import React, { useCallback, useRef } from "react";
import * as Haptics from "expo-haptics";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SPRING_DUOLINGO_PRESS } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

export type NodeHapticStyle = "none" | "light" | "medium" | "heavy";

export interface AnimatedNodeButtonProps {
  size: number;
  backgroundColor: string;
  shadowColor: string;
  onPress: (e?: any) => void;
  disabled?: boolean;
  hapticStyle?: NodeHapticStyle;
  shadowDepth?: number;
  borderRadius?: number;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityState?: { disabled?: boolean };
  className?: string;
}

const HAPTIC_MAP: Record<NodeHapticStyle, () => Promise<void>> = {
  none: () => Promise.resolve(),
  light: () => Haptics.selectionAsync(),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

const DEFAULT_SHADOW_DEPTH = 6;
const DOUBLE_TAP_GUARD_MS = 250;

export function useAnimatedNodeButtonViewModel({
  size,
  backgroundColor,
  shadowColor,
  onPress,
  disabled = false,
  hapticStyle = "medium",
  shadowDepth = DEFAULT_SHADOW_DEPTH,
  borderRadius,
  children,
  accessibilityLabel,
  accessibilityState,
  className,
}: AnimatedNodeButtonProps) {
  const reducedMotion: boolean = useReducedMotion();
  const pressY = useSharedValue<number>(0);
  const pressLock = useRef<boolean>(false);

  const radius: number = borderRadius ?? size / 2;

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  const handlePressIn = useCallback((): void => {
    if (disabled) return;

    HAPTIC_MAP[hapticStyle]().catch(() => {});

    if (reducedMotion) return;

    pressY.value = withSpring(shadowDepth, SPRING_DUOLINGO_PRESS);
  }, [disabled, hapticStyle, reducedMotion, pressY, shadowDepth]);

  const handlePressOut = useCallback((): void => {
    if (disabled || reducedMotion) return;

    pressY.value = withSpring(0, SPRING_DUOLINGO_PRESS);
  }, [disabled, reducedMotion, pressY]);

  const handlePress = useCallback(
    (e?: any): void => {
      if (disabled) return;

      if (pressLock.current) return;
      pressLock.current = true;

      try {
        onPress(e);
      } finally {
        setTimeout(() => {
          pressLock.current = false;
        }, DOUBLE_TAP_GUARD_MS);
      }
    },
    [disabled, onPress],
  );

  return {
    size,
    backgroundColor,
    shadowColor,
    disabled,
    shadowDepth,
    radius,
    children,
    accessibilityLabel,
    accessibilityState,
    className,
    pressStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  };
}
