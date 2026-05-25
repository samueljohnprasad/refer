import React from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { GOLD, SAGE } from "@/lib/tokens";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
}) => {
  const { streakData, isLoading } = useStreakTracker();

  const currentStreak = streakData.currentStreak || 0;

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <PressableScale
      onPress={onPress}
      scale={0.97}
      hapticStyle="light"
      className="happy-brand-raised-panel rounded-[32px]"
      accessibilityRole="button"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
    >
      <View className="w-full flex-row items-center justify-between p-5">
        {/* Left Streak Number Box */}
        <View className="items-center justify-center pr-5 min-w-[75px]">
          <Text className="happy-font-heading-bold text-[46px] leading-tight tracking-tighter text-ink">
            {isLoading ? "-" : currentStreak}
          </Text>
          <Text className="happy-brand-eyebrow mt-[-2px] text-[10px]">
            STREAK
          </Text>
        </View>

        {/* Right Weekly Grid */}
        <View className="flex-1 flex-row items-center justify-between pl-4 pr-1">
          {streakData.weeklyProgress.map((isCompleted, i) => {
            const isPrevCompleted = i > 0 && streakData.weeklyProgress[i - 1];
            const isNextCompleted = i < 6 && streakData.weeklyProgress[i + 1];

            return (
              <View key={i} className="flex-1 items-center relative py-1">
                {/* Connection Pill BGs */}
                {isCompleted && (
                  <View className="absolute top-1 bottom-1 flex-row w-full z-0 h-8 mt-[2px]">
                    <View
                      className={`flex-1 h-full ${
                        isPrevCompleted ? "bg-gold/15" : "bg-transparent"
                      }`}
                    />
                    <View
                      className={`flex-1 h-full ${
                        isNextCompleted ? "bg-gold/15" : "bg-transparent"
                      }`}
                    />
                  </View>
                )}

                {/* Day Circle */}
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center z-10 border ${
                    isCompleted
                      ? "bg-gold/15 border-gold/20"
                      : "border-sage-100 bg-sage-50"
                  }`}
                >
                  <HugeiconsIcon
                    icon={Fire02Icon}
                    size={16}
                    color={isCompleted ? GOLD : SAGE[200]}
                    fill={isCompleted ? GOLD : "none"}
                  />
                </View>

                <Text
                  className={`text-[10px] mt-2 ${
                    isCompleted
                      ? "happy-font-body-bold text-ink-soft"
                      : "happy-font-body-medium text-ink-muted"
                  }`}
                >
                  {labels[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </PressableScale>
  );
};
