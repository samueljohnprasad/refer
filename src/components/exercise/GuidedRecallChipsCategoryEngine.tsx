import React, { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import {
  WaveOrderChip,
  WaveOrderSlot,
} from "@/src/components/exercise/WaveOrderComponents";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

// ponytail: tactile ordering engine with destination slots, 3D buttons, and zero-gap layout
export function GuidedRecallChipsCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const answer = readStringArray(content.answer);
  const chips = readStringArray(content.chips);
  const selectedChips = readStringArray(saved?.selectedChips);
  const isCorrect = saved?.isCorrect === true;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  // ponytail: success notification when correct order is reached
  useEffect(() => {
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isCorrect]);

  const availablePool = useMemo(() => {
    return chips.filter((chip) => !selectedChips.includes(chip));
  }, [chips, selectedChips]);

  const updateSelection = (nextChips: string[]) => {
    const complete = nextChips.length === answer.length;
    const correct = complete && arraysMatch(nextChips, answer);
    const correctPositions = nextChips.filter(
      (chip, index) => chip === answer[index],
    ).length;
    onInteraction(
      createResponse({
        ...saved,
        selectedChips: nextChips,
        isCorrect: correct,
        feedbackText:
          complete && !correct
            ? `${correctPositions} of ${answer.length} in the right place. Look at where the chain starts and ends.`
            : null,
      }),
      complete,
    );
  };

  const addChip = (chip: string) => {
    if (locked || isCorrect || selectedChips.includes(chip)) return;
    if (selectedChips.length >= answer.length) return;
    Haptics.selectionAsync();
    updateSelection([...selectedChips, chip]);
  };

  const removeChip = (index: number) => {
    if (locked || isCorrect) return;
    Haptics.selectionAsync();
    updateSelection(
      selectedChips.filter((_, chipIndex) => chipIndex !== index),
    );
  };

  const promptText = readString(content.prompt);

  return (
    <View className="flex-1 -mt-11 px-5 pb-8 pt-0">
      {/* Title & Subtitle */}
      <View className="mb-1">
        <Text className="happy-font-heading-bold text-[24px] leading-[30px] text-[#201E1D] tracking-tight">
          {readString(content.title) ?? "Rebuild the loop"}
        </Text>
        <Text className="happy-font-body text-[14.5px] leading-[20px] text-[#7A7265] mt-1">
          {readString(content.instruction) ?? "Tap the steps in order."}
        </Text>
      </View>

      {/* Question Prompt */}
      {promptText ? (
        <Text className="happy-font-body-medium text-[15px] leading-[22px] text-[#2C2825] mt-3.5 mb-3">
          {promptText}
        </Text>
      ) : null}

      {/* Destination Order Slots */}
      <View className="gap-2.5">
        {answer.map((_, index) => {
          const stage = selectedChips[index];
          return (
            <WaveOrderSlot
              key={index}
              index={index}
              stage={stage}
              mark={isCorrect ? true : undefined}
              phase={isCorrect ? "complete" : "entry"}
              locked={locked}
              onPress={() => removeChip(index)}
            />
          );
        })}
      </View>

      {/* Available Tappable Chips (collapsed once placed) */}
      {!isCorrect && availablePool.length > 0 ? (
        <View className="mt-4 w-full gap-2.5">
          <Text className="happy-font-body-bold text-[12px] uppercase tracking-wider text-[#82796A] mb-0.5">
            Available steps
          </Text>
          {availablePool.map((chip) => (
            <WaveOrderChip
              key={chip}
              stage={chip}
              disabled={locked || selectedChips.length >= answer.length}
              onPress={() => addChip(chip)}
            />
          ))}
        </View>
      ) : null}

      {/* Generous bottom spacing: guarantees no sticky CTA overlap */}
      <View className="h-44" />
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    category: CourseExerciseCategoryEnum.GuidedRecallChips,
    selectedChips: [],
    ...extra,
  };
}

function arraysMatch(a: string[], b: string[]) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
