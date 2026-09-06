import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStreak } from "@/src/hooks/useStreak";
import { AnimatedFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { Card } from "@/src/components/ui/Card";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
  showDepth?: boolean;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
  showDepth = false,
}) => {
  const { currentStreak, weeklyProgress, isLoading } = useStreak();
  const streakData = React.useMemo(
    () => ({ currentStreak, weeklyProgress }),
    [currentStreak, weeklyProgress]
  );

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    // ponytail: interactive card surface with chevron affordance
    <Card
      variant="tile"
      radius="lg"
      onPress={onPress}
      showDepth={showDepth}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`Current streak: ${currentStreak} days. Tap to view streak history.`}
      contentClassName="w-full flex-row items-center justify-between py-3 px-3.5"
    >
      {/* Left: Streak label */}
      <View className="flex-row items-center gap-2">
        <AnimatedFireIcon width={20} height={20} />
        <Text
          className="text-[15px] font-bold text-ink"
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        >
          {isLoading ? "-" : currentStreak} day streak
        </Text>
      </View>

      {/* Right: 7-day indicators with shared baseline grid + chevron */}
      <View className="flex-row items-center gap-2.5">
        <View className="flex-row items-center gap-2">
          {streakData.weeklyProgress.days.map((isCompleted: boolean, i: number) => (
            <View key={i} className="items-center gap-1.5">
              <Text className="text-[11px] font-bold text-ink-muted">
                {labels[i]}
              </Text>
              <View className="w-4 h-4 items-center justify-center">
                {isCompleted ? (
                  <View className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                ) : (
                  <View className="w-2.5 h-2.5 rounded-full border-[1.5px] border-border-default/80 bg-transparent" />
                )}
              </View>
            </View>
          ))}
        </View>

        <Feather
          name="chevron-right"
          size={16}
          color="#8E8E93"
        />
      </View>
    </Card>
  );
};
