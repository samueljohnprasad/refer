import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CuriosityBetCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const options = readStringArray(content.options);
  const selectedOptionIndex = readNumber(saved?.selectedOptionIndex);
  const bestAnswerIndex = readNumber(content.bestAnswerIndex) ?? 0;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const chooseOption = (optionIndex: number) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(createResponse({ selectedOptionIndex: optionIndex }), true);
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Place a bet"}
        instruction={readString(content.instruction) ?? "Commit to a guess."}
      />

      <Text className="happy-font-body-bold mb-3 text-[17px] leading-[24px] text-[#201E1D]">
        {readString(content.question)}
      </Text>
      <View className="gap-2.5">
        {options.map((option, optionIndex) => {
          const selected = selectedOptionIndex === optionIndex;
          const best = optionIndex === bestAnswerIndex;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ disabled: locked, selected }}
              disabled={locked}
              onPress={() => chooseOption(optionIndex)}
              className={getOptionClassName({ best, locked, selected })}
            >
              <Text className="happy-font-body-semibold text-center text-[15.5px] leading-[21px] text-[#201E1D]">
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {locked ? (
        <View className="mt-3.5 gap-2 rounded-[24px] bg-[#F9F4ED] px-[22px] py-5 shadow-md shadow-black/10">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="happy-font-body-bold text-[11px] tracking-[0.45px] text-[#82796A]">
              YOUR BET
            </Text>
            <Text className="happy-font-body-semibold rounded-full border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-[13px] py-[5px] text-[13px] text-[#201E1D]">
              {selectedOptionIndex == null ? "" : options[selectedOptionIndex]}
            </Text>
          </View>
          <Text className="happy-font-body-bold text-[11px] tracking-[0.45px] text-[#29452A]">
            THE ANSWER
          </Text>
          <Text className="happy-font-heading-bold text-[26px] leading-[31px] text-[#29452A]">
            {readString(content.answer)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.CuriosityBet,
    phase: "bet",
    selectedOptionIndex: null,
    isCorrect: true,
    ...extra,
  };
}

function getOptionClassName({
  best,
  locked,
  selected,
}: {
  best: boolean;
  locked: boolean;
  selected: boolean;
}): string {
  if (locked && best) {
    return "min-h-14 justify-center rounded-[22px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] px-4 py-[13px] shadow-sm shadow-black/10";
  }
  if (locked && selected) {
    return "min-h-14 justify-center rounded-[22px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] px-4 py-[13px] shadow-sm shadow-black/10";
  }
  if (locked) {
    return "min-h-14 justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-[13px] opacity-50";
  }
  if (selected) {
    return "min-h-14 justify-center rounded-[22px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] px-4 py-[13px] shadow-sm shadow-black/10";
  }
  return "min-h-14 justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-[13px] shadow-sm shadow-black/10 active:translate-y-px active:shadow-none";
}
