import React from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import GoalCard from "../components/GoalCard";
import { DailyGoalMinutes, MotivationAnswer } from "../types";
import { DAILY_GOAL_CARDS } from "../constants";

interface DailyGoalStepProps {
  selected: DailyGoalMinutes;
  motivation?: MotivationAnswer;
  onSelect: (minutes: DailyGoalMinutes) => void;
}

const DailyGoalStep: React.FC<DailyGoalStepProps> = ({
  selected,
  motivation = "anxiety",
  onSelect,
}) => {
  const { t } = useTranslation("onboarding");
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const translatedHeadline = t(`daily_goal.${motivation}.headline`);
  const [translatedHeadlineMain, translatedHeadlineItalic] =
    translatedHeadline.split(/(?=\s\w+$)/);
  const translatedCards = DAILY_GOAL_CARDS.map((config) => ({
    ...config,
    tag: t(`daily_goal.cards.${config.tagVariant === "casual" ? "gentle" : config.tagVariant}.tag`),
    description: t(`daily_goal.cards.${config.tagVariant === "casual" ? "gentle" : config.tagVariant}.description`),
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 132,
        paddingTop: headerHeight - insets.top,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-8"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text className="happy-font-heading mt-2 text-3xl leading-tight text-ink">
          {translatedHeadlineMain}
          <Text className="happy-font-heading-italic italic text-sage-500">
            {translatedHeadlineItalic}
          </Text>
          ?
        </Text>
        <Text className="happy-font-body mt-3 text-base leading-relaxed text-ink-soft">
          {t(`daily_goal.${motivation}.subtext`)}
        </Text>
      </Animated.View>

      <View className="mt-5 gap-2.5">
        {translatedCards.map((config, index) => (
          <GoalCard
            key={config.minutes}
            config={config}
            isSelected={selected === config.minutes}
            onSelect={() => onSelect(config.minutes)}
            index={index}
          />
        ))}
      </View>

      <Animated.View
        entering={FadeIn.duration(180).delay(180)}
        className="mt-6 rounded-2xl border border-sage-200 bg-brand-surface-soft p-4.5"
      >
        <Text className="happy-font-body italic text-sm leading-relaxed text-ink-muted">
          {t(`daily_goal.${motivation}.testimonial.quote`)}
        </Text>
        <Text className="happy-font-body-bold mt-2.5 text-xs font-bold text-sage-600">
          {t(`daily_goal.${motivation}.testimonial.name`)}, {t(`daily_goal.${motivation}.testimonial.age`)}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(DailyGoalStep);
