import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export interface UseTodayPillAnimationOptions {
  visible: boolean;
  durationMs?: number;
  offsetX?: number; // how far to slide in from the right (positive value)
  scaleFrom?: number; // starting scale value when hidden
}

export interface UseTodayPillAnimationResult {
  animatedStyle: {
    opacity: Animated.Value | Animated.AnimatedInterpolation<number>;
    transform: Array<
      | { translateX: Animated.AnimatedInterpolation<number> }
      | { scale: Animated.AnimatedInterpolation<number> }
    >;
  };
  pointerEvents: 'auto' | 'none';
}

export const useTodayPillAnimation = (
  options: UseTodayPillAnimationOptions
): UseTodayPillAnimationResult => {
  const { visible, durationMs = 600, offsetX = 16, scaleFrom = 0.98 } = options;

  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, durationMs, visible]);

  const animatedStyle: UseTodayPillAnimationResult['animatedStyle'] = {
    opacity: anim,
    transform: [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [offsetX, 0],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [scaleFrom, 1],
        }),
      },
    ],
  };

  return {
    animatedStyle,
    pointerEvents: visible ? 'auto' : 'none',
  };
};

export default useTodayPillAnimation;
