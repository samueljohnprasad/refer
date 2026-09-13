import React, { useEffect } from "react";
import { Text, View } from "react-native";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

// ponytail: single-card reflection engine for why it matters wave takeaway
export function ConceptInsightCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: exercise.type,
          phase: "concept",
          isCorrect: true,
        },
        true,
      );
    }
  }, [exercise.type, onInteraction, saved]);

  const title = readString(content.title) ?? "Why it matters";
  const instruction =
    readString(content.instruction) ?? "Turn the wave model into one usable rule.";
  const message =
    readString(content.message) ?? "You do not need to fight the surge.";
  const explanation =
    readString(content.explanation) ??
    "When you realise adrenaline has a natural half-life, you stop trying to force the feeling to stop immediately. Giving the wave permission to crest takes away the fear that feeds it.";

  return (
    <View className="flex-1 -mt-12 px-5 pb-8 pt-0">
      {/* Title & Subtitle */}
      <View className="mb-4">
        <Text className="happy-font-heading-bold text-[24px] leading-[30px] text-[#201E1D] tracking-tight">
          {title}
        </Text>
        <Text className="happy-font-body text-[14.5px] leading-[20px] text-[#7A7265] mt-1">
          {instruction}
        </Text>
      </View>

      {/* Informational Learning Card */}
      <View className="rounded-[24px] border border-[#DFE8DC] bg-[#F3F8F2] px-6 py-6">
        {/* Muted Green Metadata Label */}
        <Text className="text-[11.5px] font-bold uppercase tracking-wider text-[#2D5A32] mb-3">
          WHY IT MATTERS TO YOU
        </Text>

        {/* Card Headline Hero */}
        <Text className="happy-font-heading-bold text-[22px] leading-[29px] text-[#201E1D]">
          {message}
        </Text>

        {/* Explanation Body with Comfortable Spacing & Line Height */}
        <Text className="happy-font-body text-[15px] leading-[23px] text-[#4A453E] mt-4.5">
          {explanation}
        </Text>
      </View>

      {/* Flexible intentional whitespace before bottom sticky CTA */}
      <View className="h-32" />
    </View>
  );
}
