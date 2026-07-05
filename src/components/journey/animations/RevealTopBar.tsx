import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealTopBar({ children }: { children: React.ReactNode }): React.ReactElement {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    // Top bar animation down
    progress.value = withDelay(
      100, // Slight delay to let screen reveal start
      withTiming(1, {
        duration: 900,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -24 * (1 - progress.value);
    
    return {
      opacity: progress.value,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
