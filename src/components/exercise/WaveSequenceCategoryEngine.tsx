import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function WaveSequenceCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const steps = readStringArray(content.steps);

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.WaveSequence,
          phase: "sequence",
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The anxiety wave"}
        instruction={readString(content.instruction) ?? "Just read."}
      />

      <View className="rounded-[24px] bg-[#F9F4ED] px-[22px] pb-[18px] pt-[22px] shadow-md shadow-black/10">
        {steps.map((step, index) => {
          const last = index === steps.length - 1;
          return (
            <View key={step}>
              <View className="min-h-10 flex-row items-center gap-3">
                <View
                  className={
                    last
                      ? "h-[26px] w-[26px] items-center justify-center rounded-full bg-[#5F7F58]"
                      : "h-[26px] w-[26px] items-center justify-center rounded-full bg-[#D3E0CD]"
                  }
                >
                  <Text
                    className={
                      last
                        ? "happy-font-body-bold text-[12.5px] text-white"
                        : "happy-font-body-bold text-[12.5px] text-[#29452A]"
                    }
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text className="happy-font-body-semibold flex-1 text-[15.5px] leading-[21px] text-[#201E1D]">
                  {step}
                </Text>
              </View>
              {!last ? (
                <View className="ml-3 h-3.5 w-0.5 rounded-full bg-[#ABC0A2]" />
              ) : null}
            </View>
          );
        })}

        <View className="mt-4 border-t-[1.5px] border-[#E7DFD2] pt-3.5">
          <Text className="happy-font-heading-bold mb-1 text-[19px] leading-6 text-[#29452A]">
            {readString(content.rule)}
          </Text>
          <Text className="happy-font-body text-[13.5px] leading-5 text-[#3F3A34]">
            {readString(content.explanation)}
          </Text>
        </View>
      </View>

      <Text className="happy-font-body mt-3 text-center text-[12.5px] text-[#82796A]">
        {readString(content.note)}
      </Text>
    </View>
  );
}
