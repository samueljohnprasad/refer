import React, { memo } from "react";
import { I18nManager, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SymbolView } from "expo-symbols";
import { Mascot } from "@/src/components/ui/Mascot";
import { ORANGE, SAGE } from "@/src/theme/palette";

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

const MASCOT_POSITION = I18nManager.isRTL ? { left: -10 } : { right: -10 };
const CONTENT_POSITION = { width: "64%" as const };
const CHEVRON_NAME = I18nManager.isRTL
  ? "chevron.left"
  : "chevron.right";

export const HomeHeader = memo(function HomeHeader({
  displayName,
  isLoading,
  streak,
  onStreakPress,
}: HomeHeaderProps): React.JSX.Element {
  const { t } = useTranslation("home");
  const greeting = t(`greeting.${getGreetingKey(new Date().getHours())}`);
  const name = isLoading ? "..." : displayName || t("greeting.fallbackName");
  const streakLabel = t("streak.dayLabel");

  return (
    <View className="relative min-h-[184px]">
      {/* ponytail: open composition lets the mascot feel illustrated, not boxed */}
      <View
        accessibilityElementsHidden
        className="absolute bottom-0 h-[174px] w-[168px] items-center justify-end"
        style={MASCOT_POSITION}
      >
        <View className="absolute bottom-0.5 h-[148px] w-[148px] rounded-full bg-sage-100" />
        <Mascot state="panda-plant" size={158} />
      </View>

      <View
        className="min-h-[184px] justify-start pt-6"
        style={CONTENT_POSITION}
      >
        <Text className="happy-font-body-medium text-[15px] font-semibold text-sage-600">
          {greeting}
        </Text>
        <Text
          className="happy-font-heading-bold mt-1 text-[42px] font-extrabold leading-[41px] tracking-tight text-ink"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {name}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("streak.a11yLabel", { count: streak })}
          onPress={onStreakPress}
          className="mt-6 min-h-11 flex-row items-center gap-2 self-start px-0.5 pt-1 active:opacity-60"
        >
          <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-gold-tint">
            <SymbolView
              name="flame.fill"
              size={17}
              tintColor={ORANGE.primary}
            />
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="happy-font-heading-bold text-[18px] font-extrabold tracking-tight text-ink">
              {streak}
            </Text>
            <Text className="happy-font-body-bold text-[13px] font-bold text-ink-soft">
              {streakLabel}
            </Text>
          </View>
          <SymbolView
            name={CHEVRON_NAME}
            size={12}
            tintColor={SAGE[500]}
            weight="bold"
          />
        </Pressable>
      </View>
    </View>
  );
});
