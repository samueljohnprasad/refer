import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import GoalCard from "../components/GoalCard";
import TestimonialCard from "../components/TestimonialCard";
import { DailyGoalMinutes } from "../types";
import { DAILY_GOAL_CARDS } from "../constants";

interface DailyGoalStepProps {
  selected: DailyGoalMinutes;
  onSelect: (minutes: DailyGoalMinutes) => void;
}

const DailyGoalStep: React.FC<DailyGoalStepProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-8"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text className="text-xs font-semibold uppercase tracking-widest text-sage-500">
          Step 6 of 6
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          How much time can you give{" "}
          <Text
            style={{ fontFamily: "FrauncesRegularItalic" }}
            className="italic text-sage-500"
          >
            yourself?
          </Text>
        </Text>
        <Text
          style={{ fontFamily: "GeistRegular" }}
          className="mt-3 text-[15px] leading-relaxed text-ink-soft"
        >
          5 minutes a day beats 30 minutes once a week. Pick something honest.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(180)} className="mt-5">
        <TestimonialCard
          initial="D"
          tone="lavender"
          quote={`"5 minutes felt fake at first. But I have ADHD — anything longer than 10 minutes I'd quit. This actually works for my brain. Day 142."`}
          name="Dani"
          age={28}
        />
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
    </ScrollView>
  );
};

export default React.memo(DailyGoalStep);
