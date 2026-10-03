import React from "react";
import { View, Text, Pressable } from "react-native";
import { HabitWithStatus } from "@/src/types/habits";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { StreakBadge } from "@/src/components/habits/StreakBadge";
import { Checkbox } from "@/src/components/check-box";
import * as Haptics from "expo-haptics";
import { parse } from "date-fns";
import { HabitIcon } from "@/src/utils/habitIconMapper";
import { SAGE } from "@/src/theme/palette";
import { useTranslation } from "react-i18next";

interface HabitCardProps {
  habit: HabitWithStatus;
  onPress: () => void;
  onToggleComplete: () => void;
  isLast?: boolean;
}

// ponytail: only format time when timeOption is at_time
const formatTime = (time: string, language: string): string => {
  try {
    const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
    const parsed = parse(timeWithoutSeconds, "HH:mm", new Date());
    return new Intl.DateTimeFormat(language, { hour: "numeric", minute: "2-digit" }).format(parsed);
  } catch {
    return time;
  }
};

// ponytail: only show non-daily repeat patterns (daily is noise on a daily habits screen)
const getRepeatKey = (habit: HabitWithStatus): "weekly" | "monthly" | "once" | null => {
  switch (habit.repeatPattern) {
    case "weekly":
      if (habit.repeatDays && habit.repeatDays.length > 0) {
        return "weekly";
      }
      return "weekly";
    case "monthly":
      return "monthly";
    case "never":
      return "once";
    default:
      return null;
  }
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onToggleComplete,
}) => {
  const { i18n, t } = useTranslation("habits");
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
    void Haptics.selectionAsync();
    onPress();
  };

  const handleCheckboxPress = (e: { stopPropagation?: () => void }): void => {
    e?.stopPropagation?.();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  const repeatKey = getRepeatKey(habit);
  const repeatLabel = repeatKey === "weekly" && habit.repeatDays?.length
    ? habit.repeatDays.map((day) => new Intl.DateTimeFormat(i18n.language, { weekday: "short" }).format(new Date(2023, 0, 1 + day))).join(" · ")
    : repeatKey ? t(`repeat.${repeatKey}`) : "";
  // Only show scheduled time when user explicitly set at_time option
  const showTime =
    habit.timeOption === "at_time" &&
    !!habit.scheduledTime &&
    !habit.isCompleted;
  // Show metadata row only when there is something useful to show
  const hasMetadata =
    !!repeatLabel || showTime || (habit.currentStreak ?? 0) > 0;

  return (
    <View>
      <Pressable
        onPress={handleCardPress}
        className="py-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityRole="button"
        accessibilityLabel={habit.isCompleted ? t("accessibility.completed", { habit: habit.name }) : habit.name}
      >
        <View className="flex-row items-center">
          {/* Icon */}
          <View className="mr-3 h-10 w-10 items-center justify-center">
            <HabitIcon
              icon={habit.icon}
              size={24}
              opacity={habit.isCompleted ? 0.72 : 1}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Habit Name — muted opacity on complete, no strikethrough */}
            <Text
              className={`text-[17px] happy-font-body-bold ${habit.isCompleted ? "text-ink-soft" : "text-ink"}`}
            >
              {habit.name}
            </Text>

            {/* Metadata Row — only rendered when there's real content */}
            {hasMetadata && (
              <View className="flex-row items-center mt-0.5 gap-3">
                {/* Non-daily repeat label */}
                {!!repeatLabel && (
                  <Text className="text-xs text-ink-soft happy-font-body">
                    {repeatLabel}
                  </Text>
                )}

                {/* Scheduled time — only real at_time values */}
                {showTime && (
                  <Text className="text-xs text-ink-soft happy-font-body">
                  {formatTime(habit.scheduledTime!, i18n.language)}
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
            accessibilityLabel={t(habit.isCompleted ? "accessibility.markIncomplete" : "accessibility.markComplete", { habit: habit.name })}
          >
            <View className="z-10">
              <Checkbox
                checked={habit.isCompleted}
                checkmarkColor={SAGE[500]}
                size={24}
                showBorder={true}
                stroke={4}
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
