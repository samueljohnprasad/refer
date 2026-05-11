import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import GoalCard from "../components/GoalCard";
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
          Step 5 of 7
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          How much time can you{" "}
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="italic text-sage-500"
          >
            commit?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Start small. You can always do more.
        </Text>
      </Animated.View>

      <View className="mt-6 gap-2.5">
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
