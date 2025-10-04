/**
 * useNameInputAnimations
 *
 * Reusable hook encapsulating animations and gestures for a floating-label input
 * using react-native-reanimated, react-native-gesture-handler, and Skia-driven
 * underline progress. Keep presentational components lean.
 */

import { useCallback, useMemo } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface UseNameInputAnimationsParams {
  value: string;
  measuredWidth: number;
  onClear: () => void;
}

export interface UseNameInputAnimationsResult {
  focused: ReturnType<typeof useSharedValue<number>>;
  progress: ReturnType<typeof useDerivedValue<number>>;
  rContainerStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  rLabelStyle: ReturnType<typeof useAnimatedStyle<TextStyle>>;
  rUnderlineWidth: ReturnType<typeof useDerivedValue<number>>;
  clearGesture: ReturnType<typeof Gesture.Pan>;
  onFocus: () => void;
  onBlur: () => void;
}

export const useNameInputAnimations = (
  params: UseNameInputAnimationsParams,
): UseNameInputAnimationsResult => {
  const { value, measuredWidth, onClear } = params;

  const focused = useSharedValue<number>(0);
  const shake = useSharedValue<number>(0);

  const hasValue = useDerivedValue<number>(() => (value.length > 0 ? 1 : 0), [
    value,
  ]);
  const progress = useDerivedValue<number>(
    () => Math.max(focused.value, hasValue.value),
    [hasValue, focused],
  );

  const onFocus = useCallback(() => {
    focused.value = withTiming(1, { duration: 220 });
  }, [focused]);

  const onBlur = useCallback(() => {
    focused.value = withTiming(0, { duration: 220 });
  }, [focused]);

  const rContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    const translateY = interpolate(focused.value, [0, 1], [0, -2], Extrapolate.CLAMP);
    const translateX = interpolate(shake.value, [0, 1, 2, 3, 4], [0, -8, 8, -6, 0]);
    return {
      transform: [{ translateY }, { translateX }],
    };
  }, []);

  const rLabelStyle = useAnimatedStyle<TextStyle>(() => {
    const ty = interpolate(progress.value, [0, 1], [0, -20], Extrapolate.CLAMP);
    const scale = interpolate(progress.value, [0, 1], [1, 0.86], Extrapolate.CLAMP);
    const opacity = withTiming(progress.value ? 1 : 0.9, { duration: 200 });
    return {
      transform: [{ translateY: ty }, { scale }],
      opacity,
      color: progress.value === 1 ? '#0b84ff' : '#666666',
    };
  }, []);

  const rUnderlineWidth = useDerivedValue<number>(() => {
    return interpolate(progress.value, [0, 1], [measuredWidth * 0.35, measuredWidth]);
  }, [measuredWidth]);

  const clearGesture = useMemo(() => {
    let cleared = false;
    return Gesture.Pan()
      .onUpdate(e => {
        if (e.translationX < -50) cleared = true;
      })
      .onEnd(() => {
        if (cleared) {
          // trigger subtle shake
          shake.value = 0;
          shake.value = withTiming(4, { duration: 260 });
          onClear();
          cleared = false;
        }
      });
  }, [onClear, shake]);

  return {
    focused,
    progress,
    rContainerStyle,
    rLabelStyle,
    rUnderlineWidth,
    clearGesture,
    onFocus,
    onBlur,
  };
};
