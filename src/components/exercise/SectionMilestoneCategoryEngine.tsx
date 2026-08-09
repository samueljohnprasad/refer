import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Medal01Icon } from "@hugeicons/core-free-icons";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function SectionMilestoneCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const opened = saved?.opened === true;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  useEffect(() => {
    if (opened)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [opened]);

  return (
    <View className="flex-1 items-center px-6 pb-3 pt-7 text-center">
      <View
        className={
          opened
            ? "h-[132px] w-[132px] items-center justify-center rounded-full bg-[#D3E0CD] shadow-md shadow-black/10"
            : "h-[132px] w-[132px] items-center justify-center rounded-full bg-[#EBDDC5] shadow-md shadow-black/10"
        }
      >
        <HugeiconsIcon
          icon={Medal01Icon}
          size={54}
          color={opened ? "#29452A" : "#82796A"}
        />
      </View>

      {!opened ? (
        <>
          <Text className="happy-font-heading-bold mt-5 text-2xl leading-[29px] text-[#201E1D]">
            {readString(content.closedTitle)}
          </Text>
          <Text className="happy-font-body mt-2 max-w-[290px] text-center text-[14.5px] leading-[22px] text-[#82796A]">
            {readString(content.closedBody)}
          </Text>
        </>
      ) : (
        <>
          <View className="mt-4 rounded-full bg-[#D3E0CD] px-3.5 py-2">
            <Text className="happy-font-body-bold text-[12px] text-[#29452A]">
              {readString(content.badge)}
            </Text>
          </View>
          <Text className="happy-font-heading-bold mt-3 text-[23px] leading-[27px] text-[#201E1D]">
            {readString(content.openTitle)}
          </Text>
          <Text className="happy-font-body mt-2 max-w-[300px] text-center text-[14.5px] leading-[22px] text-[#3F3A34]">
            {readString(content.openBody)}
          </Text>
          <View className="mt-4 max-w-[310px] rounded-[20px] bg-[#F9F4ED] px-[18px] py-[14px] shadow-sm shadow-black/10">
            <Text className="happy-font-body text-center text-[13.5px] leading-5 text-[#3F3A34]">
              {readString(content.nextLabel)}{" "}
              <Text className="happy-font-body-bold">
                {readString(content.nextTitle)}
              </Text>{" "}
              {readString(content.nextBody)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

function createResponse() {
  return {
    format: CourseExerciseCategoryEnum.SectionMilestone,
    opened: false,
    isCorrect: true,
  };
}
