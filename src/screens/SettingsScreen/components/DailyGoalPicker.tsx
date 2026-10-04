import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { DAILY_XP_GOAL_OPTIONS, useDailyXPGoal } from "@/src/store/dailyGoalStore";

/**
 * Inline daily XP goal picker for the Settings "Preferences" section.
 * Mirrors the SettingsItem row layout, with a chip group instead of a chevron.
 */
export const DailyGoalPicker: React.FC<{ isLast?: boolean }> = ({ isLast = false }) => {
  const { t } = useTranslation("settings");
  const { goal, setGoal } = useDailyXPGoal();
  const iconColor = String(SEMANTIC_COLORS.text.primary ?? "#243323");

  return (
    <View className="flex-row items-start px-4" testID="daily-goal-picker">
      <View className="w-7 h-7 items-center justify-center mr-3.5 mt-4">
        <HugeiconsIcon icon={Target02Icon} size={22} color={iconColor} strokeWidth={1.75} />
      </View>
      <View
        className={`flex-1 py-3.5 pr-1 ${
          !isLast ? "border-b border-black/[0.04] dark:border-white/[0.06]" : ""
        }`}
      >
        <Text className="text-[16px] font-semibold text-ink">{t("dailyGoal.title")}</Text>
        <Text className="text-[14px] text-ink-muted mt-0.5 leading-snug">
          {t("dailyGoal.summary", {
            goal,
            count: Math.max(1, Math.round(goal / 10)),
          })}
        </Text>
        <View className="flex-row gap-2 mt-3">
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
                className={`flex-1 items-center rounded-2xl border-2 py-2 min-h-[48px] justify-center ${
                  selected
                    ? "bg-amber-100 border-amber-400 dark:bg-amber-900/40 dark:border-amber-500"
                    : "bg-black/[0.03] border-transparent dark:bg-white/[0.05]"
                }`}
              >
                <Text
                  className={`text-[15px] font-extrabold ${
                    selected ? "text-amber-800 dark:text-amber-200" : "text-ink"
                  }`}
                >
                  {option}
                </Text>
                <Text
                  className={`text-[11px] font-semibold ${
                    selected ? "text-amber-700 dark:text-amber-300" : "text-ink-muted"
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
