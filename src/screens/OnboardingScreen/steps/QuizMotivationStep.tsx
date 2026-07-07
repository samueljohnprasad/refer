import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { StackedCarousel } from "../../../animations/stacked-carousel";
import { MotivationAnswer } from "../types";
import { MOTIVATION_OPTIONS } from "../constants";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STEP_LABEL_ENTER_DELAY_MS = 80;
const TITLE_ENTER_DELAY_MS = 140;
const DESCRIPTION_ENTER_DELAY_MS = 220;
const PROOF_ENTER_DELAY_MS = 360;

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
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback(
    (id: MotivationAnswer) => {
      onSelect(id);
      setTimeout(onAdvance, 400);
    },
    [onSelect, onAdvance],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 24,
        paddingTop: headerHeight - insets.top,
      }}
      className="flex-1 px-6"
    >
      <Animated.Text
        entering={FadeIn.duration(160).delay(STEP_LABEL_ENTER_DELAY_MS)}
        className="text-xs font-semibold uppercase tracking-widest text-sage-500"
      >
        Step 1 of 7
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.duration(180).delay(TITLE_ENTER_DELAY_MS)}
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
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.duration(180).delay(DESCRIPTION_ENTER_DELAY_MS)}
        className="mt-3 text-[15px] leading-relaxed text-ink-soft"
      >
        Pick the one that resonates most. No wrong answers.
      </Animated.Text>

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

      <Animated.View
        entering={FadeIn.duration(180).delay(PROOF_ENTER_DELAY_MS)}
        className="mt-5"
      >
        <StackedCarousel />
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(QuizMotivationStep);
