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
    // ponytail: aligned streak row with clean status dots
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
      className="w-full min-h-[44px] flex-row items-center justify-between py-2 px-1"
    >
      {/* Left: Streak label */}
      <View className="flex-row items-center gap-1.5 pr-4">
        <AnimatedFireIcon width={22} height={22} />
        <Text
          className="text-[16px] font-bold text-ink"
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        >
          {isLoading ? "-" : currentStreak} day streak
        </Text>
      </View>

      {/* Right: 7-day indicators with shared baseline grid */}
      {/* ponytail: aligned streak row with clean status dots */}
      <View className="flex-row items-center gap-3">
        {streakData.weeklyProgress.days.map((isCompleted: boolean, i: number) => (
          <View key={i} className="items-center gap-1.5">
            <Text className="text-[11px] font-bold text-ink-soft">
              {labels[i]}
            </Text>
            <View className="w-4 h-4 items-center justify-center">
              {isCompleted ? (
                <View className="w-2 h-2 rounded-full bg-brand-primary" />
              ) : (
                <View className="w-2 h-2 rounded-full border-[1.5px] border-border-default bg-transparent" />
              )}
            </View>
          </View>
        ))}
      </View>
    </Pressable>
  );
};
