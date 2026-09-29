import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { MotivationAnswer } from "../types";
import { MOTIVATION_OPTIONS } from "../constants";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STEP_LABEL_ENTER_DELAY_MS = 80;
const TITLE_ENTER_DELAY_MS = 140;
const DESCRIPTION_ENTER_DELAY_MS = 220;

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
      // ponytail: 360ms lets user enjoy bouncy tactile feedback before smooth advance
      setTimeout(onAdvance, 360);
    },
    [onSelect, onAdvance],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
        paddingTop: Math.max(headerHeight - insets.top, 16),
      }}
      className="flex-1 px-6"
    >
      <Animated.Text
        entering={FadeIn.duration(160).delay(STEP_LABEL_ENTER_DELAY_MS)}
        className="text-[11px] font-bold uppercase tracking-wider text-sage-600"
      >
        Start with what feels most true
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.duration(180).delay(TITLE_ENTER_DELAY_MS)}
        style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
        className="mt-2 text-[30px] leading-[36px] text-ink happy-font-body-extrabold"
      >
        What brings you here, friend?
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.duration(180).delay(DESCRIPTION_ENTER_DELAY_MS)}
        className="mt-2 text-[15px] leading-relaxed text-ink-soft happy-font-body-medium"
      >
        Pick the one that resonates most. No wrong answers.
      </Animated.Text>

      <View className="mt-6 gap-3.5">
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
    </ScrollView>
  );
};

export default React.memo(QuizMotivationStep);
