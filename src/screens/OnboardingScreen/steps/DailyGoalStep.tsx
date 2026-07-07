import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import GoalCard from "../components/GoalCard";
import { StackedCarousel } from "../../../animations/stacked-carousel";
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
        paddingBottom: 104,
        paddingTop: headerHeight - insets.top,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-8"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          {headlineMain}
          <Text
            style={{ fontFamily: "CormorantRegularItalic" }}
            className="italic text-sage-500"
          >
            {headlineItalic}?
          </Text>
        </Text>
        <Text
          style={{ fontFamily: "GeistRegular" }}
          className="mt-3 text-[15px] leading-relaxed text-ink-soft"
        >
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
      <Animated.View entering={FadeIn.duration(180).delay(180)}>
        <StackedCarousel />
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(DailyGoalStep);
