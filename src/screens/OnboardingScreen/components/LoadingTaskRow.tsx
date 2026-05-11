import React, { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import Animated, {
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

interface LoadingTaskRowProps {
  label: string;
  completed: boolean;
  inProgress: boolean;
  index: number;
}

const LoadingTaskRow: React.FC<LoadingTaskRowProps> = ({
  label,
  completed,
  inProgress,
  index,
}) => {
  const rowOpacity = useSharedValue(0.5);
  const rowScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (completed) {
      rowOpacity.value = withTiming(1, { duration: 300 });
      rowScale.value = withSequence(
        withSpring(1.02, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 15, stiffness: 200 }),
      );
    } else if (inProgress) {
      rowOpacity.value = withTiming(1, { duration: 200 });
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        0,
        true,
      );
    } else {
      rowOpacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [completed, inProgress]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
    transform: [{ scale: rowScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100).duration(400)}
      style={rowStyle}
      className="flex-row items-center gap-3 rounded-xl border border-sage-100 bg-warm-white px-4 py-3.5"
    >
      <View className="h-[18px] w-[18px] items-center justify-center">
        {completed ? (
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            className="h-[18px] w-[18px] items-center justify-center rounded-full bg-sage-500"
          >
            <Text className="text-[11px] font-extrabold text-white">✓</Text>
          </Animated.View>
        ) : inProgress ? (
          <Animated.View style={pulseStyle}>
            <ActivityIndicator size="small" color="#5A7A56" />
          </Animated.View>
        ) : (
          <View className="h-[18px] w-[18px] rounded-full border-2 border-sage-200" />
        )}
      </View>
      <Text
        className={`flex-1 text-sm font-medium ${
          completed
            ? "text-sage-600"
            : inProgress
              ? "text-ink"
              : "text-ink-muted"
        }`}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

export default React.memo(LoadingTaskRow);
