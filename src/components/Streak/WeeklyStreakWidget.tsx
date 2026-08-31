import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { useStreak } from "@/src/hooks/useStreak";
import { Card } from "@/src/components/ui/Card";
import { AnimatedFireIcon, GrayFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
  showDepth?: boolean;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
  showDepth = true,
}) => {
  const isDark = useColorScheme() === "dark";
  const { currentStreak, weeklyProgress, isLoading } = useStreak();
  const streakData = React.useMemo(
    () => ({ currentStreak, weeklyProgress }),
    [currentStreak, weeklyProgress]
  );

  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const strongText = isDark ? SEMANTIC_COLORS.selection.foreground : SEMANTIC_COLORS.brand.onSoft;
  const secondaryText = isDark ? SEMANTIC_COLORS.border.selected : SEMANTIC_COLORS.brand.pressed;

  return (
    <Card
      variant="tile"
      radius="lg"
      onPress={onPress}
      haptic="light"
      showDepth={showDepth}
      contentClassName="p-0"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
    >
      <View className="w-full flex-row items-center justify-between py-5 px-5">
        {/* Left Streak Number Box */}
        <View className="items-center justify-center pr-6 min-w-[75px]">
          <Text
            className="text-[46px] leading-tight tracking-tighter"
            style={{ fontFamily: APP_FONT_FAMILIES.bold, color: strongText, fontVariant: ["lining-nums"] }}
          >
            {isLoading ? "-" : currentStreak}
          </Text>
          <Text
            className="text-[12px] tracking-[1.5px] uppercase mt-1"
            style={{ fontFamily: APP_FONT_FAMILIES.bold, color: secondaryText }}
          >
            STREAK
          </Text>
        </View>

        {/* Right Weekly Grid */}
        <View className="flex-1 flex-row items-center justify-between">
          {streakData.weeklyProgress.days.map((isCompleted, i) => {
            return (
              <View key={i} className="flex-1 items-center relative py-1">
                {/* Center-aligned Connection Pill BGs removed per user request */}

                {/* Day Icon */}
                <View
                  className="w-8 h-8 items-center justify-center z-10"
                >
                  {isCompleted ? (
                    <AnimatedFireIcon width={28} height={28} />
                  ) : (
                    <GrayFireIcon width={24} height={24} />
                  )}
                </View>

                <Text
                  className="text-[12px] mt-2"
                  style={{
                    fontFamily: isCompleted
                      ? APP_FONT_FAMILIES.bold
                      : APP_FONT_FAMILIES.semiBold,
                    color: isCompleted ? strongText : secondaryText,
                  }}
                >
                  {labels[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
};
