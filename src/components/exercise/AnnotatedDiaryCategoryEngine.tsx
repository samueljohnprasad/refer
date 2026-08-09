import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function AnnotatedDiaryCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};

  useEffect(() => {
    if (!readRecord(savedResponse)) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.AnnotatedDiary,
          phase: "concept",
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, savedResponse]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "A diary line, annotated"}
        instruction={readString(content.instruction) ?? "Just read."}
      />

      <View className="rounded-[24px] rounded-bl-md bg-[#F9F4ED] px-[22px] py-5 shadow-sm shadow-black/10">
        <Text className="happy-font-body-bold mb-1.5 text-[11px] tracking-[0.45px] text-[#82796A]">
          FROM A DIARY
        </Text>
        <Text className="happy-font-heading-bold text-xl leading-[27px] text-[#201E1D]">
          {readString(content.diary)}
        </Text>
      </View>

      <View className="ml-[26px] mt-2.5 rounded-[24px] rounded-tl-md border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-5 py-4">
        <Text className="happy-font-body-bold mb-[5px] text-[11px] tracking-[0.45px] text-[#56633F]">
          A THERAPIST’S NOTE
        </Text>
        <Text className="happy-font-body text-sm leading-[22px] text-[#3F4A31]">
          {readString(content.annotation)}
        </Text>
      </View>

      <Text className="happy-font-body mt-3.5 text-center text-[12.5px] leading-[18px] text-[#82796A]">
        {readString(content.note)}
      </Text>
    </View>
  );
}
