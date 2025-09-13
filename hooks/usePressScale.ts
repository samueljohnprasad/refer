import { useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";

export interface UsePressScaleOptions {
  pressedScale?: number;
  pressInDuration?: number;
  pressOutDuration?: number;
}

export interface UsePressScaleReturn {
  scale: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
}

/**
 * Creates a reusable press scale animation for touchables.
 * Returns the Animated.Value and handlers to wire to onPressIn/onPressOut.
 */
export const usePressScale = (
  options?: UsePressScaleOptions
): UsePressScaleReturn => {
  const { pressedScale, pressInDuration, pressOutDuration } = useMemo(
    () => ({
      pressedScale: options?.pressedScale ?? 0.98,
      pressInDuration: options?.pressInDuration ?? 140,
      pressOutDuration: options?.pressOutDuration ?? 220,
    }),
    [options?.pressedScale, options?.pressInDuration, options?.pressOutDuration]
  );

  const easing = useMemo(() => Easing.bezier(0.25, 0.46, 0.45, 0.94), []);
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = (): void => {
    Animated.timing(scale, {
      toValue: pressedScale,
      duration: pressInDuration,
      easing,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (): void => {
    Animated.timing(scale, {
      toValue: 1,
      duration: pressOutDuration,
      easing,
      useNativeDriver: true,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
};

export default usePressScale;
