import React from "react";
import { View, Text, Pressable } from "react-native";
import { HabitWithStatus } from "@/src/types/habits";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { StreakBadge } from "@/src/components/habits/StreakBadge";
import * as Haptics from "expo-haptics";
import { format, parse } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { RepeatIcon } from "@hugeicons/core-free-icons";
import { INK_MUTED, SAGE, TRANSPARENT } from "@/lib/tokens";

interface HabitCardProps {
  habit: HabitWithStatus;
  onPress: () => void;
  onToggleComplete: () => void;
  isLast?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onToggleComplete,
  isLast = false,
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const checkScale = useSharedValue(habit.isCompleted ? 1 : 0);
  const isFirstRender = React.useRef(true);

  // Update animation when completion status changes
  React.useEffect(() => {
    if (habit.isCompleted) {
      checkScale.value = withTiming(1, { duration: 200 });
      if (!isFirstRender.current) {
        setShowConfetti(true);
      }
    } else {
      checkScale.value = withTiming(0, { duration: 200 });
    }
    isFirstRender.current = false;
  }, [habit.isCompleted]);

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: checkScale.value }],
  }));

  const handleCardPress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  const handleCheckboxPress = (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  // Format time for display
  const formatTime = (time: string): string => {
    try {
      const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
      const parsed = parse(timeWithoutSeconds, "HH:mm", new Date());
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
        if (habit.repeatDays && habit.repeatDays.length > 0) {
          const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return `Weekly (${habit.repeatDays.map(d => daysMap[d]).join(", ")})`;
        }
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
    <View>
      <Pressable
        onPress={handleCardPress}
        className="py-3"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View className="flex-row items-center">
          {/* Emoji Icon */}
          <View className="mr-3 h-10 w-10 items-center justify-center">
            <Text style={{ fontSize: 22, opacity: habit.isCompleted ? 0.5 : 1 }}>{habit.icon || "✓"}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Habit Name */}
            <Text
              className={`happy-font-body-bold text-[17px] text-ink ${habit.isCompleted
                  ? "opacity-50 line-through"
                  : ""
                }`}
            >
              {habit.name}
            </Text>

            {/* Metadata Row */}
            <View className="flex-row items-center mt-0.5 gap-3 h-[16px]">
                  {/* Repeat Badge */}
                  <View className="flex-row items-center">
                    <HugeiconsIcon icon={RepeatIcon} size={12} color={INK_MUTED} />
                    <Text className="happy-font-body-medium ml-1 text-xs text-ink-muted">
                      {getRepeatLabel()}
                    </Text>
                  </View>

                  {/* Time Badge (hide if completed so streak takes focus) */}
                  {habit.scheduledTime && !habit.isCompleted && (
                    <Text className="happy-font-body-medium text-xs text-ink-muted">
                      {formatTime(habit.scheduledTime)}
                    </Text>
                  )}

              {/* Streak Badge */}
              <StreakBadge currentStreak={habit.currentStreak || 0} />
            </View>
          </View>

          {/* Checkbox */}
          <Pressable
            onPress={handleCheckboxPress}
            className="ml-3 relative w-11 h-11 items-center justify-center"
          >
            <View
              className="w-6 h-6 rounded-full border items-center justify-center z-10"
              style={{
                borderColor: habit.isCompleted ? SAGE[400] : SAGE[200],
                backgroundColor: habit.isCompleted
                  ? SAGE[50]
                  : TRANSPARENT,
              }}
            >
              <Animated.Text
                className="text-xs"
                style={[{ color: SAGE[600] }, checkmarkAnimatedStyle]}
              >
                ✓
              </Animated.Text>
            </View>

            <View
              className="absolute inset-0 items-center justify-center z-0"
              pointerEvents="none"
            >
              <ConfettiExplosion
                isVisible={showConfetti}
                onAnimationComplete={() => setShowConfetti(false)}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};
