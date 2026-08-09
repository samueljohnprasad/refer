import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import GoalCard from "../components/GoalCard";
import { DailyGoalMinutes, MotivationAnswer } from "../types";
import { DAILY_GOAL_CARDS, DAILY_GOAL_CONTEXT } from "../constants";

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
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const ctx = DAILY_GOAL_CONTEXT[motivation];
  const [headlineMain, headlineItalic] = ctx.headline.split(/(?=\s\w+$)/);

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
          {headlineMain}
          <Text className="happy-font-heading-italic italic text-sage-500">
            {headlineItalic}
          </Text>
          ?
        </Text>
        <Text className="happy-font-body mt-3 text-base leading-relaxed text-ink-soft">
          {ctx.subtext}
        </Text>
      </Animated.View>

      <View className="mt-5 gap-2.5">
        {DAILY_GOAL_CARDS.map((config, index) => (
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
          {ctx.testimonial.quote}
        </Text>
        <Text className="happy-font-body-bold mt-2.5 text-xs font-bold text-sage-600">
          {ctx.testimonial.name}, {ctx.testimonial.age}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(DailyGoalStep);
