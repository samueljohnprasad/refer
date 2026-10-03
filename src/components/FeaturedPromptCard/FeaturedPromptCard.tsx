import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { Card } from "@/src/components/ui/Card";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { useTranslation } from "react-i18next";

import type { QuickJournalPrompt } from "@/src/screens/DiscoveryScreen/QuickJournalSection";

interface FeaturedPromptCardProps {
  prompts: QuickJournalPrompt[];
  onPress: (prompt: QuickJournalPrompt) => void;
}

/**
 * Featured journaling prompt card for home screen — Hero treatment
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
    // ponytail: compact reflection card with tightened vertical rhythm and tactile lesson button
    <Card
      variant="tile"
      radius="lg"
      showDepth={false}
      haptic="none"
      contentClassName="p-3.5 pt-3 pb-3.5"
      faceStyle={{ borderWidth: 1 }}
    >
      <View className="absolute right-1 top-1 z-10">
        <TouchableOpacity
          onPress={cyclePrompt}
          className="h-12 w-12 items-center justify-center active:opacity-60"
          accessibilityLabel={t("actions.newPrompt")}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="refresh-cw" size={17} color={SEMANTIC_COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View className="min-h-[56px] pr-16 justify-center" key={currentPrompt.id}>
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.extraBold,
            color: SEMANTIC_COLORS.text.primary,
            fontSize: 24,
            letterSpacing: -0.4,
            lineHeight: 28,
          }}
        >
          {t(`prompts.${currentPrompt.id}` as any, { defaultValue: currentPrompt.description })}
        </Text>
      </View>

      {/* ponytail: exact 3D tactile button and styling from lesson screen footer */}
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
    </Card>
  );
};
