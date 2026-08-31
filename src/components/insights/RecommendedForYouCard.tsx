import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { usePersonalEffectiveness } from "@/src/hooks/insights/usePersonalEffectiveness";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Card } from "@/src/components/ui/Card";

export function RecommendedForYouCard() {
  const router = useRouter();
  const { data } = usePersonalEffectiveness();

  if (!data?.bestOverall) return null;

  const best = data.bestOverall;

  return (
    <Card
      variant="answer-selected"
      radius="xl"
      onPress={() =>
        router.push({
          pathname: "/tabs/screens/exercise-flow",
          params: { type: best.exerciseType },
        })
      }
      haptic="light"
      className="mb-5"
      contentClassName="p-5"
      accessibilityLabel={`Recommended: ${best.exerciseLabel}. Average drop ${best.avgDrop} per session.`}
    >
      <Text className="text-[11px] font-bold text-sage-600 uppercase tracking-wider mb-3">
        Recommended for you
      </Text>

        <View className="flex-row items-center">
        <View className="h-12 w-12 rounded-icon-well bg-sage-50 items-center justify-center mr-3 border border-sage-100">
          <ExerciseIcon type={best.exerciseType} size={24} color={SEMANTIC_COLORS.brand.pressed} />
        </View>

        <View className="flex-1 min-w-0">
          <Text
            className="text-[17px] font-extrabold text-ink"
            numberOfLines={1}
          >
            {best.exerciseLabel}
          </Text>
          <Text className="text-[13px] text-sage-700 mt-1 leading-relaxed">
            Works best for you (−{best.avgDrop} avg per session)
          </Text>
        </View>

        <View className="h-9 w-9 rounded-full bg-sage-500 items-center justify-center">
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            color={SEMANTIC_COLORS.surface.primary}
          />
        </View>
      </View>
    </Card>
  );
}

RecommendedForYouCard.displayName = "RecommendedForYouCard";
