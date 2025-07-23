import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

/**
 * Provides an animated opacity shared value that oscillates slowly to create a
 * "breathing" visual effect. A brightnessFactor > 1 makes the overlay more
 * intense (brighter), < 1 makes it subtler (dimmer).
 */
export const useBreathingOpacity = (
  enabled: boolean,
  brightnessFactor: number = 1
): Animated.AnimatedInterpolation<number> => {
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [breath, enabled]);

  return breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15 * brightnessFactor], // max overlay 15% brightness
  });
};
