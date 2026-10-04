import React, { useEffect, useRef } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedStepContainerProps {
  stepIndex: number;
  className: string;
  children: React.ReactNode;
}

export function AnimatedStepContainer({
  stepIndex,
  className,
  children,
}: AnimatedStepContainerProps) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const previousStepRef = useRef(stepIndex);

  useEffect(() => {
    if (previousStepRef.current === stepIndex) return;
    const isForward = stepIndex > previousStepRef.current;
    previousStepRef.current = stepIndex;
    translateX.value = isForward ? 18 : -18;
    opacity.value = 0;
    translateX.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [stepIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View className={className} style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
