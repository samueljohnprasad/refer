import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { DAILY_XP_GOAL_OPTIONS, useDailyXPGoal } from "@/src/store/dailyGoalStore";

/**
 * Inline daily XP goal picker for the Settings "Preferences" section.
 * Mirrors the SettingsItem row layout, with a chip group instead of a chevron.
 */
export const DailyGoalPicker: React.FC<{ isLast?: boolean }> = ({ isLast = false }) => {
  const { t } = useTranslation("settings");
  const { goal, setGoal } = useDailyXPGoal();
  const iconColor = String(SEMANTIC_COLORS.brand.pressed);

  return (
    <View className="flex-row items-start px-4" testID="daily-goal-picker">
      <View className="mr-3.5 mt-4 h-7 w-7 items-center justify-center">
        <HugeiconsIcon icon={Target02Icon} size={22} color={iconColor} strokeWidth={1.75} />
      </View>
      <View
        className={`flex-1 py-3.5 pr-1 ${
          !isLast ? "border-b border-sage-100" : ""
        }`}
      >
        <Text className="text-[16px] font-semibold text-ink">{t("dailyGoal.title")}</Text>
        <Text className="mt-0.5 text-[14px] leading-snug text-ink-soft">
          {t("dailyGoal.summary", {
            goal,
            count: Math.max(1, Math.round(goal / 10)),
          })}
        </Text>
        <View className="mt-3 flex-row gap-2">
          {DAILY_XP_GOAL_OPTIONS.map((option) => {
            const selected = option === goal;
            return (
              <Pressable
                key={option}
                testID={`daily-goal-option-${option}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={t("dailyGoal.option", {
                  option,
                  label: t(`dailyGoal.labels.${option}`),
                })}
                onPress={() => {
                  if (selected) return;
                  Haptics.selectionAsync();
                  setGoal(option);
                }}
                className={`min-h-[48px] flex-1 items-center justify-center rounded-lg border py-2 active:opacity-70 ${
                  selected
                    ? "border-sage-600 bg-sage-600"
                    : "border-sage-200 bg-brand-surface"
                }`}
              >
                <View className="flex-row items-center gap-1">
                  <Text className={`text-[15px] font-extrabold ${selected ? "text-brand-surface" : "text-ink"}`}>
                    {option}
                  </Text>
                  {selected ? (
                    <HugeiconsIcon icon={Tick02Icon} size={14} color="#F8FBF6" strokeWidth={2} />
                  ) : null}
                </View>
                <Text
                  className={`text-[11px] font-semibold ${
                    selected ? "text-brand-surface" : "text-ink-soft"
                  }`}
                >
                  {t(`dailyGoal.labels.${option}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default DailyGoalPicker;
