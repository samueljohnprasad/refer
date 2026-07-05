import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function ScreenReveal({ children }: { children: React.ReactNode }): React.ReactElement {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1050,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 0.955 + progress.value * (1 - 0.955);
    const translateY = 22 * (1 - progress.value);
    
    return {
      opacity: progress.value,
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View className="flex-1" style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
