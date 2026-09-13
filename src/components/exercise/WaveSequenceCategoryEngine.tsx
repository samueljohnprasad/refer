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

// ponytail: clean explanatory timeline for panic wave arc
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
    <View className="flex-1 -mt-4 px-5 pb-8 pt-0">
      {/* Title & Subtitle */}
      <View className="mb-4">
        <Text className="happy-font-heading-bold text-[24px] leading-[30px] text-[#201E1D] tracking-tight">
          {readString(content.title) ?? "The anxiety wave"}
        </Text>
        <Text className="happy-font-body text-[14.5px] leading-[20px] text-[#7A7265] mt-1">
          {readString(content.instruction) ??
            "How an anxiety surge moves through your body."}
        </Text>
      </View>

      {/* Informational Cream Learning Surface */}
      <View className="rounded-[24px] border border-[#EDE6DA] bg-[#FAF6EF] px-5 py-5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <View key={step} className="flex-row items-start">
              {/* Timeline Node & Connector Column */}
              <View className="w-6 items-center">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-[#DCE7D8]">
                  <Text className="happy-font-body-bold text-[12px] text-[#244228]">
                    {index + 1}
                  </Text>
                </View>
                {!isLast ? (
                  <View className="my-1 h-3.5 w-[1.5px] bg-[#B9CBB4]" />
                ) : null}
              </View>

              {/* Step Text */}
              <View className={`flex-1 ml-3.5 ${!isLast ? "pb-2" : ""}`}>
                <Text className="happy-font-body-medium text-[15px] leading-[21px] text-[#201E1D] pt-0.5">
                  {step}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Quiet Divider */}
        <View className="mt-4 mb-3.5 border-t border-[#EAE3D6]" />

        {/* The Natural Arc Metadata & Explanation */}
        <View>
          <Text className="text-[11.5px] font-bold uppercase tracking-wider text-[#2D5A32] mb-1.5">
            {readString(content.rule) ?? "THE NATURAL ARC"}
          </Text>
          <Text className="happy-font-body text-[14px] leading-[21px] text-[#2C2825]">
            {readString(content.explanation) ??
              "No surge stays at peak indefinitely. Every wave has a chemical half-life and begins to settle on its own."}
          </Text>
        </View>
      </View>

      {/* Intentional whitespace before sticky/footer CTA */}
      <View className="h-32" />
    </View>
  );
}
