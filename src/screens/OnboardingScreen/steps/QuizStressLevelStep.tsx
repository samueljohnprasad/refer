import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback } from "react";
import { Text, View, ScrollView, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { MotivationAnswer, StressLevel } from "../types";
import { MOTIVATION_FOLLOWUP } from "../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QuizStressLevelStepProps {
  selected?: StressLevel;
  motivation?: MotivationAnswer;
  onSelect: (level: StressLevel) => void;
  onAdvance?: () => void;
}

const QuizStressLevelStep: React.FC<QuizStressLevelStepProps> = ({
  selected,
  motivation = "anxiety",
  onSelect,
}) => {
  const insets = useSafeAreaInsets();
  const followup = MOTIVATION_FOLLOWUP[motivation];
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  const handleSelect = useCallback(
    (id: StressLevel) => {
      onSelect(id);
    },
    [onSelect],
  );

  const cleanQuestion = followup.question.replace(/\?$/, "");
  const [questionMain, questionItalic] = cleanQuestion.split(/(?=\s\w+$)/);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.Text
        entering={FadeIn.duration(160).delay(80)}
        className="text-xs font-semibold text-sage-600"
      >
        Set the pace
      </Animated.Text>

      <Animated.View entering={FadeIn.duration(180).delay(140)} className="mt-1.5">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[26px] leading-[1.18] text-ink"
        >
          {questionMain}
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="italic text-sage-500"
          >
            {questionItalic}?
          </Text>
        </Text>
        <Text className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {followup.subtext}
        </Text>
      </Animated.View>

      <View className="mt-5 gap-2.5">
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
