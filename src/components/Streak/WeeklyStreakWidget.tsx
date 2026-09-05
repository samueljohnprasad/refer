import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useStreak } from "@/src/hooks/useStreak";
import { AnimatedFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
  showDepth?: boolean;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
}) => {
  const { currentStreak, weeklyProgress, isLoading } = useStreak();
  const streakData = React.useMemo(
    () => ({ currentStreak, weeklyProgress }),
    [currentStreak, weeklyProgress]
  );

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    // ponytail: compact lightweight streak strip replaces heavy card
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
      className="w-full flex-row items-center justify-between py-2 px-1"
    >
      {/* Left: Streak label */}
      <View className="flex-row items-center gap-1.5 pr-4">
        <AnimatedFireIcon width={22} height={22} />
        <Text
          className="text-[16px] text-ink"
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        >
          {isLoading ? "-" : currentStreak} day streak
        </Text>
      </View>

      {/* Right: Compact 7-day indicators */}
      <View className="flex-row items-center gap-2">
        {streakData.weeklyProgress.days.map((isCompleted, i) => (
          <View key={i} className="items-center gap-0.5">
            <View className="w-5 h-5 items-center justify-center">
              {isCompleted ? (
                <AnimatedFireIcon width={18} height={18} />
              ) : (
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: SEMANTIC_COLORS.border.default }}
                />
              )}
            </View>
            <Text
              className="text-[10px]"
              style={{
                fontFamily: isCompleted
                  ? APP_FONT_FAMILIES.bold
                  : APP_FONT_FAMILIES.medium,
                color: isCompleted
                  ? SEMANTIC_COLORS.brand.pressed
                  : SEMANTIC_COLORS.text.tertiary,
              }}
            >
              {labels[i]}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};
