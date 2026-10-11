import React from "react";
import { Text, View } from "react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";
import type { DailyGoalMinutes } from "../types";

interface OnboardingHandoffSummaryProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
}

interface HandoffRowProps {
  icon: SymbolViewProps["name"];
  title: string;
  subtitle: string;
  status: string;
  isLast: boolean;
}

const HandoffRow: React.FC<HandoffRowProps> = ({
  icon,
  title,
  subtitle,
  status,
  isLast,
}) => (
  <View
    className={`flex-row items-center gap-3 py-4 ${
      isLast ? "" : "border-b border-sage-200/70"
    }`}
  >
    <View className="w-7 items-center">
      <SymbolView
        name={icon}
        size={20}
        tintColor="#5F7F58"
        type="hierarchical"
      />
    </View>
    <View className="min-w-0 flex-1">
      <Text
        numberOfLines={2}
        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        className="text-[16px] leading-tight text-ink"
      >
        {title}
      </Text>
      <Text
        numberOfLines={2}
        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
        className="mt-1 text-[13px] leading-snug text-ink-soft"
      >
        {subtitle}
      </Text>
    </View>
    <Text
      numberOfLines={1}
      style={{ fontFamily: APP_FONT_FAMILIES.bold }}
      className="max-w-[84px] text-right text-[11px] uppercase tracking-[0.8px] text-sage-700"
    >
      {status}
    </Text>
  </View>
);

const OnboardingHandoffSummary: React.FC<OnboardingHandoffSummaryProps> = ({
  planName,
  dailyGoal,
}) => {
  const { t } = useTranslation("onboarding");

  return (
    <View className="mt-7">
      <HandoffRow
        icon="book.closed.fill"
        title={planName}
        subtitle={t("welcome_to_happy.course_card.daily_label", {
          minutes: dailyGoal,
        })}
        status={t("welcome_to_happy.course_card.ready_badge")}
        isLast={false}
      />
      <HandoffRow
        icon="flame.fill"
        title={t("welcome_to_happy.streak_card.title")}
        subtitle={t("welcome_to_happy.streak_card.subtitle")}
        status={t("welcome_to_happy.streak_card.day_1_badge")}
        isLast={false}
      />
      <HandoffRow
        icon="lock.fill"
        title={t("welcome_to_happy.reflections_card.title")}
        subtitle={t("welcome_to_happy.reflections_card.subtitle")}
        status={t("welcome_to_happy.reflections_card.encrypted_badge")}
        isLast
      />
    </View>
  );
};

export default React.memo(OnboardingHandoffSummary);
