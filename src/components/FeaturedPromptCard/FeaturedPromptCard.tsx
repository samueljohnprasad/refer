import React, { useState, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { useTranslation } from "react-i18next";
import { SAGE } from "@/src/theme/palette";

import type { QuickJournalPrompt } from "@/src/screens/DiscoveryScreen/QuickJournalSection";

interface FeaturedPromptCardProps {
  prompts: QuickJournalPrompt[];
  onPress: (prompt: QuickJournalPrompt) => void;
}

/**
 * Featured journaling prompt for the open home-screen treatment.
 * Accessible, scalable typography, high contrast focus
 */
export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  prompts,
  onPress,
}) => {
  const { t } = useTranslation("home");
  const [activeIndex, setActiveIndex] = useState(0);

  const cyclePrompt = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % prompts.length);
  }, [prompts.length]);

  const currentPrompt = prompts[activeIndex];

  if (!currentPrompt || prompts.length === 0) return null;

  return (
    // ponytail: keep the prompt open; only the primary action gets a surface
    <View className="relative">
      <View className="absolute right-0 top-0 z-10">
        <Pressable
          onPress={cyclePrompt}
          className="h-10 w-10 items-center justify-center active:opacity-60"
          accessibilityLabel={t("actions.newPrompt")}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SymbolView
            name="arrow.triangle.2.circlepath"
            size={17}
            tintColor={SAGE[600]}
            weight="semibold"
          />
        </Pressable>
      </View>

      <View className="min-h-[56px] pr-12 justify-center" key={currentPrompt.id}>
        <Text className="happy-font-heading-bold text-[25px] font-extrabold leading-7 tracking-tight text-ink">
          {String(t(`prompts.${currentPrompt.id}` as any))}
        </Text>
      </View>

      {/* ponytail: preserve the established tactile reflection button */}
      <View className="mt-2.5">
        <CourseExercisePrimaryButton
          label={t("actions.startReflection")}
          height={52}
          fontSize={17}
          pressDepth={5}
          leftIcon={
            <SymbolView
              name="mic"
              size={18}
              tintColor="#FFFFFF"
              weight="medium"
              style={{ width: 18, height: 18 }}
            />
          }
          onPress={() => onPress(currentPrompt)}
        />
      </View>
    </View>
  );
};
