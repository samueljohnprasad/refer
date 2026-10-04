import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback } from "react";
import { Text, View, ScrollView, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { MotivationAnswer, StressLevel } from "../types";
import { MOTIVATION_FOLLOWUP } from "../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

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
  onAdvance,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  const followup = MOTIVATION_FOLLOWUP[motivation];
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  const handleSelect = useCallback(
    (id: StressLevel) => {
      onSelect(id);
      // ponytail: 360ms lets user enjoy bouncy tactile feedback before smooth advance
      if (onAdvance) {
        setTimeout(onAdvance, 360);
      }
    },
    [onSelect, onAdvance],
  );

  const question = t(`motivation_followup.${motivation}.question`);
  const questionWithPunctuation = /[?؟？]$/.test(question) ? question : `${question}${t("quiz_stress_level.question_mark")}`;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.Text
        entering={FadeIn.duration(160).delay(80)}
        className="text-[11px] font-bold uppercase tracking-wider text-sage-600"
      >
        {t("quiz_stress_level.step_label")}
      </Animated.Text>

      <Animated.View entering={FadeIn.duration(180).delay(140)} className="mt-2">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-[28px] leading-[34px] text-ink happy-font-body-extrabold"
        >
          {questionWithPunctuation}
        </Text>
        <Text className="mt-2 text-[15px] leading-relaxed text-ink-soft happy-font-body-medium">
          {t(`motivation_followup.${motivation}.subtext`)}
        </Text>
      </Animated.View>

      <View className="mt-5 gap-3.5">
        {followup.options.map((option, index) => (
          <OptionCard
            key={option.id}
            option={{ ...option, title: t(`motivation_followup.${motivation}.options.${option.id}.title`), subtitle: t(`motivation_followup.${motivation}.options.${option.id}.subtitle`) }}
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
