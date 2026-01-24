import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

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
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Start animation
    opacity.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      withDelay(
        1500,
        withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }),
      ),
    );

    translateY.value = withSequence(
      withTiming(-20, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withDelay(
        1200,
        withTiming(-40, { duration: 500, easing: Easing.in(Easing.ease) }),
      ),
    );

    scale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 100 }),
      withDelay(1400, withTiming(0.8, { duration: 300 })),
    );

    // Trigger onComplete after animation
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 2200);

    return () => clearTimeout(timeout);
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
