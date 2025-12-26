import React from "react";
import { View, Text, Pressable } from "react-native";
import { HabitWithStatus } from "@/src/types/habits";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { format, parse } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { RepeatIcon } from "@hugeicons/core-free-icons";

interface HabitCardProps {
  habit: HabitWithStatus;
  onPress: () => void;
  onToggleComplete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onToggleComplete,
}) => {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(habit.isCompleted ? 1 : 0);

  // Update animation when completion status changes
  React.useEffect(() => {
    checkScale.value = withSpring(habit.isCompleted ? 1 : 0, {
      damping: 12,
      stiffness: 180,
    });
  }, [habit.isCompleted]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: checkScale.value }],
  }));

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleCheckboxPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  // Format time for display
  const formatTime = (time: string): string => {
    try {
      const parsed = parse(time, "HH:mm", new Date());
      return format(parsed, "h:mm a");
    } catch {
      return time;
    }
  };

  // Get repeat label
  const getRepeatLabel = (): string => {
    switch (habit.repeatPattern) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "never":
        return "Once";
      default:
        return "";
    }
  };

  return (
    <Animated.View style={cardAnimatedStyle}>
      <Pressable
        onPress={handleCardPress}
        className="mb-3 bg-white rounded-2xl border border-gray-100 px-4 py-4"
        style={({ pressed }) => ({
          opacity: pressed ? 0.95 : 1,
        })}
      >
        <View className="flex-row items-center">
          {/* Emoji Icon */}
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: habit.color + "15" }}
          >
            <Text style={{ fontSize: 20 }}>{habit.icon || "✓"}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Habit Name */}
            <Text
              className={`text-base font-semibold ${
                habit.isCompleted
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {habit.name}
            </Text>

            {/* Metadata Row */}
            <View className="flex-row items-center mt-1">
              {/* Repeat Badge */}
              <View className="flex-row items-center">
                <HugeiconsIcon icon={RepeatIcon} size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 ml-1">
                  {getRepeatLabel()}
                </Text>
              </View>

              {/* Time Badge */}
              {habit.scheduledTime && (
                <Text className="text-xs text-gray-400 ml-3">
                  {formatTime(habit.scheduledTime)}
                </Text>
              )}
            </View>
          </View>

          {/* Checkbox */}
          <Pressable
            onPress={handleCheckboxPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="ml-3"
          >
            <View
              className="w-7 h-7 rounded-full border-2 items-center justify-center"
              style={{
                borderColor: habit.isCompleted ? habit.color : "#E5E7EB",
                backgroundColor: habit.isCompleted
                  ? habit.color
                  : "transparent",
              }}
            >
              <Animated.Text
                className="text-white text-sm font-bold"
                style={checkmarkAnimatedStyle}
              >
                ✓
              </Animated.Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};
