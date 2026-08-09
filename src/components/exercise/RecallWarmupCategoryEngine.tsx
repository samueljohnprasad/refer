import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readRecallCards } from "@/src/components/exercise/courseExerciseSixthBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function RecallWarmupCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const cards = readRecallCards(content.cards);
  const cardIndex = readNumber(saved?.cardIndex) ?? 0;
  const revealed = saved?.revealed === true;
  const card = cards[cardIndex];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "A 30-second warm-up"}
        instruction={readString(content.instruction) ?? "Recall, then flip."}
      />

      <View className="min-h-[250px] justify-center gap-3.5 rounded-[28px] bg-[#F9F4ED] px-6 py-[26px]">
        <Text className="happy-font-body-bold text-[11px] tracking-[0.5px] text-[#82796A]">
          RECALL {cardIndex + 1} OF {cards.length}
        </Text>
        <Text className="happy-font-heading-bold text-[23px] leading-[30px] text-[#201E1D]">
          {card?.question}
        </Text>
        {revealed ? (
          <View className="rounded-[20px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-4 py-3.5">
            <Text className="happy-font-body text-[14.5px] leading-[22px] text-[#56633F]">
              {card?.answer}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mt-3.5 flex-row justify-center gap-1.5">
        {cards.map((_, index) => (
          <View
            key={index}
            className={
              index === cardIndex
                ? "h-2 w-[22px] rounded-full bg-[#7A8A5E]"
                : "h-2 w-2 rounded-full bg-[#DCD3C4]"
            }
          />
        ))}
      </View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.RecallWarmup,
    phase: "recall",
    cardIndex: 0,
    revealed: false,
    isCorrect: true,
    ...extra,
  };
}
