// ponytail: dynamic staggered reflection prompts matching the Journal tab transition & auto-cycle
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { StaggeredText } from "@/src/components/staggered-text";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";
import { SAGE } from "@/src/theme/palette";

import type { QuickJournalPrompt } from "@/src/screens/DiscoveryScreen/QuickJournalSection";

interface FeaturedPromptCardProps {
  prompts: QuickJournalPrompt[];
  onPress: (prompt: QuickJournalPrompt) => void;
}

export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  prompts,
  onPress,
}) => {
  const { t } = useTranslation("home");
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle prompts every 4 seconds, matching Journal tab EmptyState
  useEffect(() => {
    if (prompts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % prompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [prompts.length, activeIndex]);

  const cyclePrompt = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveIndex((prev) => (prev + 1) % prompts.length);
  }, [prompts.length]);

  const promptTexts = useMemo(
    () => prompts.map((p) => String(t(`prompts.${p.id}` as any))),
    [prompts, t],
  );

  const currentPrompt = prompts[activeIndex];

  if (!currentPrompt || prompts.length === 0) return null;

  return (
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

      <View className="min-h-[58px] pr-12 justify-center">
        <StaggeredText
          texts={promptTexts}
          activeIndex={activeIndex}
          fontSize={25}
          fontFamily={APP_FONT_FAMILIES.extraBold}
          color="#1A201C"
          multiline={true}
          align="left"
          animationConfig={{
            duration: 240,
            characterDelay: 18,
          }}
        />
      </View>

      <View className="mt-3">
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
