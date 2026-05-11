import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { StressTiming } from "../types";
import { TIMING_OPTIONS } from "../constants";

interface QuizTimingStepProps {
  selected?: StressTiming;
  onSelect: (timing: StressTiming) => void;
  onAdvance: () => void;
}

const QuizTimingStep: React.FC<QuizTimingStepProps> = ({
  selected,
  onSelect,
  onAdvance,
}) => {
  const handleSelect = useCallback(
    (id: StressTiming) => {
      onSelect(id);
      setTimeout(onAdvance, 220);
    },
    [onSelect, onAdvance],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-8"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text className="text-xs font-semibold uppercase tracking-widest text-sage-500">
          Step 4 of 7
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          When does stress hit{" "}
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="italic text-sage-500"
          >
            hardest?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          We'll schedule your sessions at the right moment.
        </Text>
      </Animated.View>

      <View className="mt-6 gap-3">
        {TIMING_OPTIONS.map((option, index) => (
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
          "5 minutes felt fake at first. But I have ADHD — anything longer than
          10 minutes I'd quit. This actually works for my brain."
        </Text>
        <Text className="mt-1 text-[11px] text-ink-muted">— Dani, 28</Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(QuizTimingStep);
