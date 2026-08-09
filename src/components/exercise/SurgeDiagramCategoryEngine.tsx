import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function SurgeDiagramCategoryEngine({
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
          format: CourseExerciseCategoryEnum.SurgeDiagram,
          phase: "diagram",
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The surge, drawn"}
        instruction={readString(content.instruction) ?? "Just read."}
      />

      <View className="rounded-[28px] bg-[#F9F4ED] px-5 py-[22px]">
        <Text className="happy-font-body-bold mb-2.5 text-[14.5px] text-[#201E1D]">
          {readString(content.diagramTitle)}
        </Text>
        <View className="relative">
          <Svg
            width="100%"
            height={146}
            viewBox="0 0 300 130"
            accessibilityLabel="A curve that rises sharply, peaks, then fades slowly back to baseline"
          >
            <Line
              x1="12"
              y1="112"
              x2="292"
              y2="112"
              stroke="#DCD3C4"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M14,110 C40,108 48,24 74,20 C104,16 150,70 288,106"
              fill="none"
              stroke="#5F7F58"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Circle cx="74" cy="20" r="6" fill="#5F7F58" />
          </Svg>
          <Text className="happy-font-body-bold absolute left-[31%] top-[8%] text-[12px] text-[#29452A]">
            {readString(content.peakLabel)}
          </Text>
          <Text className="happy-font-body-bold absolute left-[56%] top-[47%] text-[12px] text-[#29452A]">
            {readString(content.fadeLabel)}
          </Text>
          <Text className="happy-font-body absolute bottom-0 right-[2%] text-[11px] text-[#82796A]">
            {readString(content.axisLabel)}
          </Text>
        </View>
        <Text className="happy-font-body mt-2.5 text-[13.5px] leading-5 text-[#201E1D]">
          {readString(content.explanation)}
        </Text>
      </View>

      <Text className="happy-font-body mt-3 text-center text-[12.5px] text-[#82796A]">
        {readString(content.note)}
      </Text>
    </View>
  );
}
