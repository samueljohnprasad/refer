import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import {
  usePersonalEffectiveness,
  type EffectivenessScore,
} from "@/src/hooks/insights/usePersonalEffectiveness";
import { SAGE, INK_MUTED } from "@/lib/tokens";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";

const MEDALS = ["🥇", "🥈", "🥉"];

function EffectivenessRow({
  score,
  rank,
}: {
  score: EffectivenessScore;
  rank: number;
}) {
  const router = useRouter();
  const icon = getExerciseIcon(score.exerciseType);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/tabs/screens/exercise-flow",
          params: { type: score.exerciseType },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`${score.exerciseLabel}: average drop ${score.avgDrop}`}
      className="flex-row items-center py-3 active:opacity-70"
    >
      <Text className="text-lg w-8">{MEDALS[rank] ?? `${rank + 1}.`}</Text>
      {icon && (
        <View className="h-9 w-9 rounded-xl bg-sage-50 items-center justify-center mr-3">
          <HugeiconsIcon icon={icon} size={18} color={SAGE[600]} />
        </View>
      )}
      <View className="flex-1 min-w-0">
        <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
          {score.exerciseLabel}
        </Text>
        <Text className="text-[12px] text-ink-muted mt-0.5">
          {score.sampleSize} sessions
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-[15px] font-extrabold text-sage-600 mr-1">
          −{score.avgDrop}
        </Text>
        <Text className="text-[11px] text-ink-muted">per session</Text>
      </View>
    </Pressable>
  );
}

export function PersonalEffectivenessCard() {
  const { data, isLoading } = usePersonalEffectiveness();

  if (isLoading || !data || data.ranked.length === 0) return null;

  const top3 = data.ranked.slice(0, 3);

  return (
    <View className="happy-brand-card rounded-[24px] p-5">
      <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-3">
        Best Tools for You
      </Text>
      <Text className="text-[12px] text-ink-muted mb-3">
        Ranked by how much they reduce intensity
      </Text>

      {top3.map((score, i) => (
        <EffectivenessRow key={score.exerciseType} score={score} rank={i} />
      ))}
    </View>
  );
}

PersonalEffectivenessCard.displayName = "PersonalEffectivenessCard";
