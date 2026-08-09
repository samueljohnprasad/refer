import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function EvidenceBiteCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const confidenceOpen = saved?.confidenceOpen === true;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const toggleConfidence = () => {
    onInteraction(
      createResponse({ ...saved, confidenceOpen: !confidenceOpen }),
      true,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The science, in one breath"}
        instruction={readString(content.instruction) ?? "One finding."}
      />

      <View className="gap-3.5 rounded-[24px] bg-[#F9F4ED] px-[22px] py-6 shadow-md shadow-black/10">
        <Text className="happy-font-body-bold text-[11px] tracking-[0.55px] text-[#82796A]">
          THE SCIENCE, IN ONE BREATH
        </Text>
        <Text className="happy-font-heading-bold text-[21px] leading-[29px] text-[#201E1D]">
          {readString(content.finding)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: confidenceOpen }}
          onPress={toggleConfidence}
          className={
            confidenceOpen
              ? "min-h-10 self-start justify-center rounded-full border-[1.5px] border-[#93A876] bg-[#E1EECC] px-4 active:translate-y-0.5"
              : "min-h-10 self-start justify-center rounded-full border-[1.5px] border-[#93A876] bg-[#F0FAE1] px-4 active:translate-y-0.5"
          }
          style={{
            shadowColor: "#C9D9AF",
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Text className="happy-font-body-bold text-[13px] text-[#56633F]">
            How sure are we? · {readString(content.confidence)}
          </Text>
        </Pressable>
        {confidenceOpen ? (
          <Text className="happy-font-body text-[13.5px] leading-[21px] text-[#3F3A34]">
            {readString(content.confidenceWhy)}
          </Text>
        ) : null}
      </View>

      <Text className="happy-font-body mt-3 text-center text-[12.5px] text-[#82796A]">
        {readString(content.note)}
      </Text>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.EvidenceBite,
    phase: "evidence",
    confidenceOpen: false,
    isCorrect: true,
    ...extra,
  };
}
