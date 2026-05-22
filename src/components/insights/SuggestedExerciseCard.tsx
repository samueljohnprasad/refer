import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";
import { useExerciseRecommendation } from "@/src/hooks/insights/useExerciseRecommendation";

export const SuggestedExerciseCard: React.FC = React.memo(() => {
  const recommendation = useExerciseRecommendation();

  if (!recommendation) return null;

  const config = getExerciseConfig(recommendation.exerciseType);
  if (!config) return null;

  const icon = getExerciseIcon(recommendation.exerciseType);

  const handlePress = () => {
    router.push(
      `/tabs/screens/exercise-flow?type=${encodeURIComponent(recommendation.exerciseType)}` as never,
    );
  };

  return (
    <View className="mb-6">
      <Text className="happy-brand-eyebrow mb-3 px-1">Suggested for you</Text>
      <Pressable
        onPress={handlePress}
        className="rounded-2xl border-2 border-b-4 border-sage-200 border-b-sage-300 bg-sage-selected active:opacity-90"
        style={{ borderCurve: "continuous" }}
        accessibilityRole="button"
        accessibilityLabel={`Start ${config.title}. ${recommendation.reason}`}
      >
        <View className="flex-row items-center p-4">
          <View
            className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-warm-white"
            style={{ borderCurve: "continuous" }}
          >
            <HugeiconsIcon icon={icon} size={28} color="#3f5a3d" />
          </View>
          <View className="flex-1">
            <Text className="happy-font-body-bold text-[17px] text-ink">
              {config.title}
            </Text>
            <Text className="happy-font-body text-[13px] text-ink-soft mt-0.5 leading-snug">
              {recommendation.reason}
            </Text>
          </View>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-sage-500">
            <Text className="text-sm font-extrabold text-white">›</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
});

SuggestedExerciseCard.displayName = "SuggestedExerciseCard";
