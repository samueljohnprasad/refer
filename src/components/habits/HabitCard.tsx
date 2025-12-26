import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HabitWithStatus } from "@/src/types/habits";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface HabitCardProps {
  habit: HabitWithStatus;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const progress = useSharedValue(habit.isCompleted ? 1 : 0);

  // Update animated values when prop changes
  React.useEffect(() => {
    progress.value = withTiming(habit.isCompleted ? 1 : 0, { duration: 300 });
  }, [habit.isCompleted]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#FFFFFF", "#F9FAFB"]
    );
    return {
      backgroundColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ["#111827", "#9CA3AF"]
    );
    return {
      color,
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="mb-3"
    >
      <Animated.View
        className="flex-row items-center p-4 rounded-2xl border border-gray-100"
        style={containerAnimatedStyle}
      >
        {/* Completion Indicator */}
        <View
          className="w-6 h-6 rounded-full border-2 items-center justify-center mr-4"
          style={{
            borderColor: habit.isCompleted ? habit.color : "#D1D5DB",
            backgroundColor: habit.isCompleted ? habit.color : "transparent",
          }}
        >
          {habit.isCompleted && (
            <Text className="text-white text-xs font-bold">✓</Text>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <Animated.Text
            className="text-base font-semibold mb-0.5"
            style={textAnimatedStyle}
          >
            {habit.name}
          </Animated.Text>

          {habit.description && (
            <Text className="text-xs text-gray-500 leading-4" numberOfLines={1}>
              {habit.description}
            </Text>
          )}

          {/* Show time if scheduled */}
          {habit.scheduledTime && (
            <Text className="text-xs text-[#7B61FF] mt-1">
              ⏰ {habit.scheduledTime}
            </Text>
          )}
        </View>

        {/* Icon */}
        <View className="ml-3 opacity-80">
          <Text style={{ fontSize: 20 }}>{habit.icon || "✓"}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
