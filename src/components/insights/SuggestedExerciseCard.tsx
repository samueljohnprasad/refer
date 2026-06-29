import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";
import { useExerciseRecommendation } from "@/src/hooks/insights/useExerciseRecommendation";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SAGE } from "@/lib/tokens";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { getCategoryBadgeTheme } from "@/src/data/exerciseIconRegistry";

export const SuggestedExerciseCard: React.FC = React.memo(() => {
  const recommendation = useExerciseRecommendation();

  if (!recommendation) return null;

  const config = getExerciseConfig(recommendation.exerciseType);
  if (!config) return null;

  const icon = getExerciseIcon(recommendation.exerciseType);

  const badgeTheme = getCategoryBadgeTheme(config.category);
  const route = `/tabs/screens/exercise-flow?type=${encodeURIComponent(recommendation.exerciseType)}`;

  return (
    <View className="mb-6">
      <Text className="happy-brand-eyebrow mb-3 px-1">Suggested for you</Text>
      <CircularRevealWrapper href={route} color={badgeTheme.bg} duration={800}>
        <PressableScale
          scale={0.98}
          hapticStyle="light"
          className="rounded-[30px]"
          accessibilityRole="button"
          accessibilityLabel={`Start ${config.title}. ${recommendation.reason}`}
        >
          <View className="happy-brand-pressed-card-selected rounded-[30px] px-4 py-4">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-[18px] border border-sage-100 bg-warm-white">
                <HugeiconsIcon icon={icon} size={24} color={SAGE[600]} />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  className="happy-font-body-bold text-[17px] leading-5 text-ink"
                  numberOfLines={1}
                >
                  {config.title}
                </Text>
                <Text
                  className="happy-font-body-medium mt-1 text-[14px] leading-5 text-ink-soft"
                  numberOfLines={2}
                >
                  {recommendation.reason}
                </Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-sage-500">
                <Text className="happy-font-body-bold text-[18px] leading-5 text-brand-surface">
                  ›
                </Text>
              </View>
            </View>
          </View>
        </PressableScale>
      </CircularRevealWrapper>
    </View>
  );
});

SuggestedExerciseCard.displayName = "SuggestedExerciseCard";
