import React, { useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import { JournalExperience } from "../types";
import { EXPERIENCE_OPTIONS } from "../constants";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QuizExperienceStepProps {
  selected?: JournalExperience;
  onSelect: (exp: JournalExperience) => void;
  onAdvance: () => void;
}

const QuizExperienceStep: React.FC<QuizExperienceStepProps> = ({
  selected,
  onSelect,
  onAdvance,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const handleSelect = useCallback(
    (id: JournalExperience) => {
      onSelect(id);
      setTimeout(onAdvance, 220);
    },
    [onSelect, onAdvance],
  );

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
        <Text className="text-xs font-semibold uppercase tracking-widest text-sage-500">
          Step 3 of 7
        </Text>
        <Text
          style={{ fontFamily: "FrauncesSemiBold" }}
          className="mt-2 text-[30px] leading-[1.1] text-ink"
        >
          Have you journaled{" "}
          <Text
            style={{ fontFamily: "FrauncesMedium" }}
            className="italic text-sage-500"
          >
            before?
          </Text>
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          We'll match the experience to where you are.
        </Text>
      </Animated.View>

      <View className="mt-6 gap-3">
        {EXPERIENCE_OPTIONS.map((option, index) => (
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

export default React.memo(QuizExperienceStep);
