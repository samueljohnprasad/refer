import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Mascot } from "@/src/components/ui/Mascot";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

type HomeHeaderProps = {
  displayName?: string;
  isLoading: boolean;
  streak: number;
  onStreakPress: () => void;
};

const getGreetingKey = (
  hour: number,
): "morning" | "afternoon" | "evening" | "windDown" => {
  if (hour >= 4 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "windDown";
};

export const HomeHeader = memo(function HomeHeader({
  displayName,
  isLoading,
  streak,
  onStreakPress,
}: HomeHeaderProps): React.JSX.Element {
  const { t } = useTranslation("home");
  const greeting = t(`greeting.${getGreetingKey(new Date().getHours())}`);
  const name = isLoading ? "..." : displayName ?? t("greeting.fallbackName");
  const streakLabel = t("streak.dayLabel");

  return (
    <View className="flex-row items-center justify-between">
      {/* ponytail: let the mascot carry the emotional identity cue */}
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <Mascot state="panda-happy" size={48} />
        </View>
        <View className="flex-1">
          <Text className="text-[13px] font-semibold text-ink-muted">
            {greeting}
          </Text>
          <Text
            className="text-[24px] font-bold tracking-tight text-ink"
            style={{ color: SEMANTIC_COLORS.text.primary }}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("streak.a11yLabel", { count: streak })}
        onPress={onStreakPress}
        className="ml-3 min-h-11 flex-shrink-0 flex-row items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 active:opacity-70"
      >
        <Text className="text-base">🔥</Text>
        <Text className="text-sm font-bold text-ink">{streak}</Text>
        <Text className="text-xs font-semibold text-ink-muted">{streakLabel}</Text>
      </Pressable>
    </View>
  );
});
