import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readDiscoveryQuestions } from "@/src/components/exercise/courseExerciseSixthBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function GuidedDiscoveryTrailCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const questions = readDiscoveryQuestions(content.questions);
  const selectedOptionIndexes = readNumberArray(saved?.selectedOptionIndexes);
  const solvedCount = selectedOptionIndexes.length;
  const visibleQuestions = questions.slice(
    0,
    Math.min(solvedCount + 1, questions.length),
  );
  const complete = solvedCount >= questions.length;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const answerQuestion = (questionIndex: number, optionIndex: number) => {
    if (locked || questionIndex !== solvedCount) return;
    Haptics.selectionAsync();
    const nextSelectedIndexes = [...selectedOptionIndexes, optionIndex];
    onInteraction(
      createResponse({ selectedOptionIndexes: nextSelectedIndexes }),
      nextSelectedIndexes.length >= questions.length,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The relief riddle"}
        instruction={readString(content.instruction) ?? "Solve the loop."}
      />

      <View className="gap-2.5">
        {visibleQuestions.map((question, questionIndex) => {
          const selectedOptionIndex = selectedOptionIndexes[questionIndex];
          const answered = selectedOptionIndex !== undefined;
          return (
            <View key={question.coach} className="gap-2.5">
              <View className="rounded-br-[20px] rounded-t-[20px] rounded-bl-md border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-[15px] py-[13px]">
                <Text className="happy-font-body text-[14px] leading-[21px] text-[#201E1D]">
                  {question.coach}
                </Text>
              </View>

              {question.options.map((option, optionIndex) => {
                const selected = selectedOptionIndex === optionIndex;
                return (
                  <Pressable
                    key={option.label}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: answered, selected }}
                    disabled={locked || answered}
                    onPress={() => answerQuestion(questionIndex, optionIndex)}
                    className={getOptionClassName({ answered, selected })}
                  >
                    <Text className="happy-font-body-bold text-[14.5px] leading-5 text-[#201E1D]">
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}

              {answered ? (
                <View className="rounded-br-[20px] rounded-t-[20px] rounded-bl-md border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-[15px] py-[13px]">
                  <Text className="happy-font-body text-[14px] leading-[21px] text-[#56633F]">
                    {question.options[selectedOptionIndex]?.reply}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {complete ? (
        <View className="mt-2.5 rounded-[20px] border-[1.5px] border-dashed border-[#7A8A5E] px-[18px] py-4">
          <Text className="happy-font-heading-bold text-center text-[18px] leading-[25px] text-[#56633F]">
            {readString(content.stamp)}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-[12.5px] text-[#82796A]">
        {complete
          ? "Conclusions you reach yourself are the ones you keep."
          : `${solvedCount} of ${questions.length} solved`}
      </Text>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
    phase: "discovery",
    selectedOptionIndexes: [],
    isCorrect: true,
    ...extra,
  };
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is number =>
          typeof item === "number" && Number.isInteger(item),
      )
    : [];
}

function getOptionClassName({
  answered,
  selected,
}: {
  answered: boolean;
  selected: boolean;
}): string {
  if (selected) {
    return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-4 py-3 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none";
  }
  if (answered) {
    return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 opacity-50";
  }
  return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none";
}
