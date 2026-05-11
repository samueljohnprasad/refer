import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { MotivationAnswer } from "../types";
import { MOTIVATION_OPTIONS } from "../constants";

interface QuizMotivationStepProps {
  selected?: MotivationAnswer;
  onSelect: (answer: MotivationAnswer) => void;
  onAdvance: () => void;
}

const QuizMotivationStep: React.FC<QuizMotivationStepProps> = ({
  selected,
  onSelect,
  onAdvance,
}) => {
  const handleSelect = useCallback(
    (id: MotivationAnswer) => {
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
          Step 1 of 7
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          What brings you here,{" "}
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="italic text-sage-500"
          >
            friend?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Pick the one that resonates most. No wrong answers.
        </Text>
      </Animated.View>

      <View className="mt-6 gap-3">
        {MOTIVATION_OPTIONS.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selected === option.id}
            onSelect={() => handleSelect(option.id)}
            index={index}
          />
        ))}
      </View>

      <View className="mt-5 rounded-[14px] border-l-[3px] border-gold bg-warm-white px-4 py-3">
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="text-[13px] italic leading-[1.4] text-ink"
        >
          "I'd downloaded 6 anxiety apps before this. Happy is the first one I
          actually opened on day 8."
        </Text>
        <Text className="mt-1 text-[11px] text-ink-muted">— Maya, 32</Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(QuizMotivationStep);
