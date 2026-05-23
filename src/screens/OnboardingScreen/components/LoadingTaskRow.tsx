import React, { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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

  useEffect(() => {
    rowOpacity.value = withTiming(completed || inProgress ? 1 : 0.55, {
      duration: 180,
    });
  }, [completed, inProgress]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(80 + index * 50).duration(180)}
      style={rowStyle}
      className="flex-row items-center gap-3 rounded-xl border border-sage-100 bg-warm-white px-4 py-3.5"
    >
      <View className="h-[18px] w-[18px] items-center justify-center">
        {completed ? (
          <Animated.View
            entering={FadeIn.duration(160)}
            className="h-[18px] w-[18px] items-center justify-center rounded-full bg-sage-500"
          >
            <Text className="text-[11px] font-extrabold text-white">✓</Text>
          </Animated.View>
        ) : inProgress ? (
          <ActivityIndicator size="small" color="#5F7F58" />
        ) : (
          <View className="h-[18px] w-[18px] rounded-full border-2 border-sage-200" />
        )}
      </View>
      <Text
        className={`happy-font-body-medium flex-1 text-sm font-medium ${
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
