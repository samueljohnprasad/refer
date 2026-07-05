import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealNode({ children, index }: { children: React.ReactNode; index: number }): React.ReactElement {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withDelay(
      300 + index * 100, // Stagger based on index
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    // Pop effect: 0.5 -> 0.92 -> 1.06 -> 0.99 -> 1
    // Approximated by the bezier curve on a single 0-1 value mapped to 0.5-1.0
    const scale = 0.5 + progress.value * 0.5;

    return {
      opacity: progress.value,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
