import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";
import { SPRING_BOUNCY, TIMING_EXIT, DURATION } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface XPGainAnimationProps {
  amount: number;
  label?: string;
  onComplete?: () => void;
}

export const XPGainAnimation: React.FC<XPGainAnimationProps> = ({
  amount,
  label,
  onComplete,
}) => {
  const reducedMotion = useReducedMotion();
  const translateY = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(reducedMotion ? 1 : 0);
  const scale = useSharedValue<number>(reducedMotion ? 1 : 0.4);

  useEffect(() => {
    if (reducedMotion) {
      // No animation — just show briefly then complete
      opacity.value = 1;
      scale.value = 1;
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, TIMING_EXIT);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timeout);
    }

    // Spring pop-in: scale 0.4 → 1.15 → 1.0 with bouncy spring
    scale.value = withSpring(1, SPRING_BOUNCY);

    // Fade in fast
    opacity.value = withTiming(1, { duration: DURATION.ultraFast });

    // Float upward: spring to -20px, then drift further and fade out
    translateY.value = withSequence(
      withSpring(-22, { stiffness: 280, damping: 18 }),
      withDelay(
        1100,
        withTiming(-44, { duration: DURATION.slow }),
      ),
    );

    // Fade out after hold
    opacity.value = withSequence(
      withTiming(1, { duration: DURATION.ultraFast }),
      withDelay(1200, withTiming(0, { duration: DURATION.fast })),
    );

    const triggerComplete = () => onComplete?.();
    const timeout = setTimeout(() => {
      triggerComplete();
    }, 2000);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute top-0 right-0 z-50"
    >
      <View className="bg-yellow-400 rounded-full px-3 py-1.5 flex-row items-center shadow-lg">
        <Text className="text-yellow-900 font-bold text-sm">+{amount} XP</Text>
        {label && (
          <Text className="text-yellow-800 text-xs ml-1">• {label}</Text>
        )}
      </View>
    </Animated.View>
  );
};
