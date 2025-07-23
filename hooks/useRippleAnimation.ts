import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export interface RippleAnimationValues {
  scale: Animated.Value;
  opacity: Animated.Value;
}

/**
 * Reusable hook that provides pulsing ripple `scale` and `opacity` values.
 * @param active When `true`, the ripple animates continuously; otherwise it resets.
 * @param duration Total duration of one outward pulse (ms).
 */
export const useRippleAnimation = (
  active: boolean,
  duration: number = 1200
): RippleAnimationValues => {
  const scale = useRef<Animated.Value>(new Animated.Value(1)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0.5)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    const startPulse = (): void => {
      scale.setValue(1);
      opacity.setValue(0.5);
      animation = Animated.parallel([
        Animated.timing(scale, {
          toValue: 2.5,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]);
      animation.start(({ finished }) => {
        if (finished && active) {
          startPulse();
        }
      });
    };

    if (active) {
      startPulse();
    } else {
      // reset
      scale.setValue(1);
      opacity.setValue(0);
      animation?.stop?.();
    }

    return () => {
      animation?.stop?.();
    };
  }, [active, duration, opacity, scale]);

  return { scale, opacity };
};
