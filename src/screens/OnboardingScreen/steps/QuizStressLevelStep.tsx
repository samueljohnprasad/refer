import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { MotivationAnswer, StressLevel } from "../types";
import { MOTIVATION_FOLLOWUP } from "../constants";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QuizStressLevelStepProps {
  selected?: StressLevel;
  motivation?: MotivationAnswer;
  onSelect: (level: StressLevel) => void;
  onAdvance: () => void;
}

const QuizStressLevelStep: React.FC<QuizStressLevelStepProps> = ({
  selected,
  motivation = "anxiety",
  onSelect,
  onAdvance,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const followup = MOTIVATION_FOLLOWUP[motivation];

  const handleSelect = useCallback(
    (id: StressLevel) => {
      onSelect(id);
      setTimeout(onAdvance, 220);
    },
    [onSelect, onAdvance],
  );

  const [questionMain, questionItalic] = followup.question.split(/(?=\s\w+$)/);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 24,
        paddingTop: headerHeight - insets.top,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text
          style={{ fontFamily: "FrauncesSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          {questionMain}
          <Text
            style={{ fontFamily: "FrauncesMedium" }}
            className="italic text-sage-500"
          >
            {questionItalic}?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {followup.subtext}
        </Text>
      </Animated.View>

      <View className="mt-6 gap-3">
        {followup.options.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selected === option.id}
            onSelect={() => handleSelect(option.id)}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(QuizStressLevelStep);
