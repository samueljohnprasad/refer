import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealPath({ children, index }: { children: React.ReactNode; index: number }): React.ReactElement {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = 0;
    const cappedIndex = Math.min(index, 12);
    progress.value = withDelay(
      400 + cappedIndex * 100, // Stagger based on capped index
      withTiming(1, {
        duration: 1150,
        easing: Easing.bezier(0.45, 0, 0.25, 1),
      })
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  // Note: True strokeDashoffset animation requires modifying the SVG path directly.
  // For simplicity and component separation, we fade in the path sequentially.
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
