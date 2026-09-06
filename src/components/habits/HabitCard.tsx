import React from "react";
import { View, Text, Pressable } from "react-native";
import { HabitWithStatus } from "@/src/types/habits";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { StreakBadge } from "@/src/components/habits/StreakBadge";
import { Checkbox } from "@/src/components/check-box";
import * as Haptics from "expo-haptics";
import { format, parse } from "date-fns";
import { HabitIcon } from "@/src/utils/habitIconMapper";

interface HabitCardProps {
  habit: HabitWithStatus;
  onPress: () => void;
  onToggleComplete: () => void;
  isLast?: boolean;
}

// ponytail: only format time when timeOption is at_time
const formatTime = (time: string): string => {
  try {
    const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
    const parsed = parse(timeWithoutSeconds, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return time;
  }
};

// ponytail: only show non-daily repeat patterns (daily is noise on a daily habits screen)
const getRepeatLabel = (habit: HabitWithStatus): string => {
  switch (habit.repeatPattern) {
    case "weekly":
      if (habit.repeatDays && habit.repeatDays.length > 0) {
        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return habit.repeatDays.map((d) => daysMap[d]).join(" · ");
      }
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "never":
      return "Once";
    default:
      return ""; // daily → silent
  }
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onToggleComplete,
  isLast = false,
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const isFirstRender = React.useRef(true);

  // Trigger confetti on completion (not on first render)
  React.useEffect(() => {
    if (habit.isCompleted && !isFirstRender.current) {
      setShowConfetti(true);
    }
    isFirstRender.current = false;
  }, [habit.isCompleted]);

  const handleCardPress = (): void => {
    Haptics.selectionAsync();
    onPress();
  };

  const handleCheckboxPress = (e: { stopPropagation?: () => void }): void => {
    e?.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  const repeatLabel = getRepeatLabel(habit);
  // Only show scheduled time when user explicitly set at_time option
  const showTime = habit.timeOption === "at_time" && !!habit.scheduledTime && !habit.isCompleted;
  // Show metadata row only when there is something useful to show
  const hasMetadata = !!repeatLabel || showTime || (habit.currentStreak ?? 0) > 0;

  return (
    <View>
      <Pressable
        onPress={handleCardPress}
        className="py-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityRole="button"
        accessibilityLabel={`${habit.name}${habit.isCompleted ? ", completed" : ""}`}
      >
        <View className="flex-row items-center">
          {/* Icon */}
          <View className="mr-3 h-10 w-10 items-center justify-center">
            <HabitIcon
              icon={habit.icon}
              size={24}
              opacity={habit.isCompleted ? 0.4 : 1}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Habit Name — muted opacity on complete, no strikethrough */}
            <Text
              className={`happy-font-body-bold text-[17px] text-ink${
                habit.isCompleted ? " opacity-40" : ""
              }`}
            >
              {habit.name}
            </Text>

            {/* Metadata Row — only rendered when there's real content */}
            {hasMetadata && (
              <View className="flex-row items-center mt-0.5 gap-3">
                {/* Non-daily repeat label */}
                {!!repeatLabel && (
                  <Text className="happy-font-body-medium text-xs text-ink-muted">
                    {repeatLabel}
                  </Text>
                )}

                {/* Scheduled time — only real at_time values */}
                {showTime && (
                  <Text className="happy-font-body-medium text-xs text-ink-muted">
                    {formatTime(habit.scheduledTime!)}
                  </Text>
                )}

                {/* Streak */}
                <StreakBadge currentStreak={habit.currentStreak ?? 0} />
              </View>
            )}
          </View>

          {/* Checkbox — 44×44 tap target, 24pt visible square (down from 28) */}
          <Pressable
            onPress={handleCheckboxPress}
            className="ml-3 relative w-11 h-11 items-center justify-center"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: habit.isCompleted }}
            accessibilityLabel={`Mark ${habit.name} as ${habit.isCompleted ? "incomplete" : "complete"}`}
          >
            <View className="z-10">
              <Checkbox
                checked={habit.isCompleted}
                checkmarkColor="#5f7f58"
                size={24}
                showBorder={true}
                stroke={5}
              />
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
