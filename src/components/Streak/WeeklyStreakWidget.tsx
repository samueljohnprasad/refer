import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStreak } from "@/src/hooks/useStreak";
import { AnimatedFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { useTranslation } from "react-i18next";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
}) => {
  const { t } = useTranslation("home");
  const { currentStreak, weeklyProgress, isLoading } = useStreak();
  const streakData = React.useMemo(
    () => ({ currentStreak, weeklyProgress }),
    [currentStreak, weeklyProgress]
  );

  const labels = t("streak.weekDays", { returnObjects: true }) as string[];

  return (
    // ponytail: keep reinforcement on the canvas instead of inside another card
    <Pressable
      className="flex-row items-center justify-between border-y border-black/[0.08] py-2 active:opacity-70"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("streak.a11yLabel", { count: currentStreak })}
    >
      {/* Left: Streak label */}
      <View className="flex-row items-center gap-2">
        <AnimatedFireIcon width={20} height={20} />
        <Text
          className="text-[15px] font-bold text-ink"
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        >
          {isLoading ? "-" : t("streak.streakCount", { count: currentStreak })}
        </Text>
      </View>

      {/* Right: 7-day indicators with shared baseline grid + chevron */}
      <View className="flex-row items-center gap-2.5">
        <View className="flex-row items-center gap-2">
          {streakData?.weeklyProgress?.days?.map((isCompleted: boolean, i: number) => (
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
    </Pressable>
  );
};
