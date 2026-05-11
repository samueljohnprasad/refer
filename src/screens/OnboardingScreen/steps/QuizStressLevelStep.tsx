import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { StressLevel } from "../types";
import { STRESS_LEVEL_OPTIONS } from "../constants";

interface QuizStressLevelStepProps {
  selected?: StressLevel;
  onSelect: (level: StressLevel) => void;
  onAdvance: () => void;
}

const QuizStressLevelStep: React.FC<QuizStressLevelStepProps> = ({
  selected,
  onSelect,
  onAdvance,
}) => {
  const handleSelect = useCallback(
    (id: StressLevel) => {
      onSelect(id);
      setTimeout(onAdvance, 400);
    },
    [onSelect, onAdvance],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      className="flex-1 px-6 pt-8"
    >
      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text className="text-xs font-semibold uppercase tracking-widest text-sage-500">
          Step 2 of 7
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          How heavy does stress feel{" "}
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="italic text-sage-500"
          >
            lately?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          This helps us calibrate the right pace for you.
        </Text>
      </Animated.View>

      <View className="mt-6 gap-3">
        {STRESS_LEVEL_OPTIONS.map((option, index) => (
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
