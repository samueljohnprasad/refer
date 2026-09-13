import React, { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readWaveOrderVariants } from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import {
  WaveOrderChip,
  WaveOrderClueCard,
  WaveOrderFeedbackCard,
  WaveOrderSlot,
} from "@/src/components/exercise/WaveOrderComponents";

// ponytail: slot + chip tap-to-place ordering engine with collapsed used chips
export function WaveOrderingCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const variants = readWaveOrderVariants(content.variants);
  const variantIndex = readNumber(saved?.variantIndex) ?? 0;
  const variant = variants[variantIndex] ?? variants[0];

  const tray = readStringList(saved?.tray ?? saved?.order);
  const marks = readBooleanList(saved?.marks);
  const attemptCount = readNumber(saved?.attemptCount) ?? 0;
  const phase =
    saved?.phase === "feedback"
      ? "feedback"
      : saved?.phase === "complete"
        ? "complete"
        : "entry";
  const isCorrect = saved?.isCorrect === true || phase === "complete";
  const rightCount = marks ? marks.filter(Boolean).length : 0;
  const totalStages = variant?.answer?.length ?? 4;

  const availablePool = useMemo(() => {
    if (!variant?.pool) return [];
    return variant.pool.filter((stage) => !tray.includes(stage));
  }, [variant, tray]);

  // ponytail: ensure initial response is recorded on mount
  useEffect(() => {
    if (!saved) {
      onInteraction(
        createResponse({
          tray: [],
          order: [],
          marks: null,
          phase: "entry",
          evaluated: false,
          canCheck: false,
        }),
        false,
      );
    }
  }, [saved, onInteraction]);

  // ponytail: light success haptic once complete
  useEffect(() => {
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isCorrect]);

  const addStage = (stage: string) => {
    if (locked || isCorrect || tray.includes(stage) || tray.length >= totalStages) return;
    Haptics.selectionAsync();
    const nextTray = [...tray, stage];
    const isFilled = nextTray.length === totalStages;
    onInteraction(
      createResponse({
        ...saved,
        tray: nextTray,
        order: nextTray,
        marks: null,
        phase: "entry",
        evaluated: false,
        canCheck: isFilled,
      }),
      isFilled,
    );
  };

  const removeStage = (stageIndex: number) => {
    if (locked || isCorrect) return;
    Haptics.selectionAsync();
    const nextTray = tray.filter((_, index) => index !== stageIndex);
    onInteraction(
      createResponse({
        ...saved,
        tray: nextTray,
        order: nextTray,
        marks: null,
        phase: "entry",
        evaluated: false,
        canCheck: false,
      }),
      false,
    );
  };

  const promptText =
    readString(variant?.prompt) ??
    "Arrange what happens as an anxiety surge runs its course:";

  return (
    <View className="flex-1 -mt-11 px-5 pb-8 pt-0">
      {/* Title & Subtitle */}
      <View className="mb-1">
        <Text className="happy-font-heading-bold text-[24px] leading-[30px] text-[#201E1D] tracking-tight">
          {readString(content.title) ?? "Order the panic wave"}
        </Text>
        <Text className="happy-font-body text-[14.5px] leading-[20px] text-[#7A7265] mt-1">
          {readString(content.instruction) ??
            "Put the phases of a surge in chronological order."}
        </Text>
      </View>

      {/* Additional Instruction Prompt */}
      {promptText ? (
        <Text className="happy-font-body-medium text-[14.5px] leading-[21px] text-[#2C2825] mt-4 mb-2.5">
          {promptText}
        </Text>
      ) : null}

      {/* Destination Slots */}
      <View className="gap-2.5">
        {variant?.answer.map((_, stageIndex) => {
          const stage = tray[stageIndex];
          const mark = marks ? marks[stageIndex] : undefined;
          return (
            <WaveOrderSlot
              key={stageIndex}
              index={stageIndex}
              stage={stage}
              mark={mark}
              phase={phase}
              locked={locked}
              onPress={() => removeStage(stageIndex)}
            />
          );
        })}
      </View>

      {/* Available Tappable Chips (collapsed when placed) */}
      {phase === "entry" && !isCorrect && availablePool.length > 0 ? (
        <View className="mt-4 w-full gap-2.5">
          {availablePool.map((stage) => (
            <WaveOrderChip
              key={stage}
              stage={stage}
              disabled={locked}
              onPress={() => addStage(stage)}
            />
          ))}
        </View>
      ) : null}

      {/* Clue Card (revealed on attempts >= 1) */}
      {attemptCount >= 1 && variant?.clue && !isCorrect ? (
        <View className="mt-4">
          <WaveOrderClueCard clue={variant.clue} />
        </View>
      ) : null}

      {/* Feedback Card (evaluates correct pattern or gentle retry) */}
      {phase === "feedback" || isCorrect ? (
        <View className="mt-4">
          <WaveOrderFeedbackCard
            isCorrect={isCorrect}
            feedbackText={readString(saved?.feedbackText)}
            rightCount={rightCount}
            total={totalStages}
          />
        </View>
      ) : null}

      {/* Generous bottom spacing: guarantees no sticky CTA overlap */}
      <View className="h-44" />
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WaveOrdering,
    phase: "entry",
    variantIndex: 0,
    attemptCount: 0,
    tray: [],
    order: [],
    marks: null,
    isCorrect: false,
    evaluated: false,
    canCheck: false,
    ...extra,
  };
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readBooleanList(value: unknown): boolean[] | null {
  return Array.isArray(value) ? value.map((item) => item === true) : null;
}
