import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

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

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "One useful idea"}
        instruction={readString(content.instruction) ?? "Just read."}
      />
      {exercise.type === CourseExerciseCategoryEnum.WaveFaq ? (
        <WaveFaqCard content={content} />
      ) : (
        <WhyItMattersCard content={content} />
      )}
    </View>
  );
}

function WhyItMattersCard({ content }: { content: Record<string, unknown> }) {
  return (
    <View className="gap-3 rounded-[24px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-6 py-[26px]">
      <Text className="happy-font-body-bold text-[11px] tracking-[0.55px] text-[#56633F]">
        WHY IT MATTERS TO YOU
      </Text>
      <Text className="happy-font-heading-bold text-[22px] leading-[28px] text-[#201E1D]">
        {readString(content.message)}
      </Text>
      <Text className="happy-font-body text-sm leading-[22px] text-[#3F4A31]">
        {readString(content.explanation)}
      </Text>
    </View>
  );
}

function WaveFaqCard({ content }: { content: Record<string, unknown> }) {
  return (
    <View className="gap-3 rounded-[24px] bg-[#F9F4ED] px-6 py-[26px] shadow-md shadow-black/10">
      <Text className="happy-font-body-bold text-[11px] tracking-[0.55px] text-[#82796A]">
        EVERYONE ASKS
      </Text>
      <Text className="happy-font-heading-bold text-[23px] leading-[29px] text-[#201E1D]">
        {readString(content.question)}
      </Text>
      <Text className="happy-font-body text-[14.5px] leading-[22.5px] text-[#3F3A34]">
        {readString(content.answer)}
      </Text>
    </View>
  );
}
