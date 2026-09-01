import React from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function IntuitionCheckCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const options = readCourseExerciseOptions(content.options);
  const selectedOptionId = readString(
    readRecord(savedResponse)?.selectedOptionId,
  );
  const bestOptionId = readString(content.bestOptionId);
  const isBestSelected = selectedOptionId === bestOptionId;
  const revealText = isBestSelected
    ? readString(content.reveal)
    : readString(content.alternateReveal);

  const chooseOption = (optionId: string) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.IntuitionCheck,
        selectedOptionId: optionId,
        isCorrect: true,
      },
      true,
    );
  };

  return (
    <View className="px-2 pb-5 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "What does your gut say?"}
        instruction={readString(content.instruction)}
        prompt={readString(content.prompt)}
      />

      <View className="gap-[10px] mt-2">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isBest = option.id === bestOptionId;
          const isOtherSelected = selectedOptionId && !isSelected;

          let buttonClass =
            "min-h-[64px] flex-row items-center justify-center px-5 py-[14px] rounded-[24px] border-[1.5px] border-[#DCD3C4] bg-white";
          let textClass =
            "happy-font-body-medium text-[16px] leading-[22px] text-[#3F4A31] text-center";

          if (isSelected) {
            if (isBest) {
              buttonClass =
                "min-h-[64px] flex-row items-center justify-center px-5 py-[14px] rounded-[24px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF]";
              textClass =
                "happy-font-body-bold text-[16.5px] leading-[22px] text-[#29452A] text-center";
            } else {
              buttonClass =
                "min-h-[64px] flex-row items-center justify-center px-5 py-[14px] rounded-[24px] border-[1.5px] border-[#C3C1BA] bg-[#F4F3F0]";
              textClass =
                "happy-font-body-bold text-[16.5px] leading-[22px] text-[#54524B] text-center";
            }
          } else if (isOtherSelected) {
            buttonClass =
              "min-h-[64px] flex-row items-center justify-center px-5 py-[14px] rounded-[24px] border-[1.5px] border-[#E8E1D7] bg-white opacity-50";
          }

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              disabled={locked}
              onPress={() => chooseOption(option.id)}
              className={buttonClass}
            >
              {isSelected && isBest ? (
                <Text className="happy-font-body-bold text-[#185A37] text-lg mr-[7px] leading-[22px]">
                  ✓
                </Text>
              ) : null}
              <Text className={textClass}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedOptionId ? (
        <View
          className={
            isBestSelected
              ? "mt-[18px] rounded-[22px] bg-[#F2F8EF] px-[22px] py-[20px]"
              : "mt-[18px] rounded-[22px] bg-[#F4F3F0] px-[22px] py-[20px]"
          }
        >
          <Text
            className={
              isBestSelected
                ? "happy-font-body-bold mb-[7px] text-[11.5px] tracking-[0.8px] text-[#29452A] uppercase"
                : "happy-font-body-bold mb-[7px] text-[11.5px] tracking-[0.8px] text-[#54524B] uppercase"
            }
          >
            {readString(content.revealTitle) ??
              (isBestSelected ? "THAT'S EXACTLY IT" : "YOU'RE NOT ALONE")}
          </Text>
          <Text
            className={
              isBestSelected
                ? "happy-font-body text-[15.5px] leading-[23px] text-[#29452A]"
                : "happy-font-body text-[15.5px] leading-[23px] text-[#54524B]"
            }
          >
            {revealText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
