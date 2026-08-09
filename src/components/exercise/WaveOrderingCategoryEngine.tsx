import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readWaveOrderVariants } from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

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
  const attemptCount = readNumber(saved?.attemptCount) ?? 0;
  const tray = readStringList(saved?.tray);
  const marks = readBooleanList(saved?.marks);
  const pinnedCount = readNumber(saved?.pinnedCount) ?? 0;
  const phase = saved?.phase === "feedback" ? "feedback" : "entry";
  const correct = saved?.isCorrect === true;
  const supported = saved?.supported === true;
  const feedbackText = readString(saved?.feedbackText);
  const variant = variants[variantIndex] ?? variants[0];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const addStage = (stage: string) => {
    if (locked || phase !== "entry" || tray.includes(stage)) return;
    const nextTray = [...tray, stage];
    Haptics.selectionAsync();
    onInteraction(
      createResponse({ ...saved, tray: nextTray, marks: null }),
      nextTray.length === variant?.answer.length,
    );
  };

  const removeStage = (stageIndex: number) => {
    if (locked || phase !== "entry" || stageIndex < pinnedCount) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        tray: tray.filter((_, index) => index !== stageIndex),
        marks: null,
      }),
      false,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Order the wave"}
        instruction={readString(content.instruction) ?? "Build the order."}
      />

      <Text className="happy-font-body-bold mb-3 text-[15px] leading-[21px] text-[#201E1D]">
        {variant?.prompt}
      </Text>

      <View className="gap-2.5">
        {variant?.answer.map((_, stageIndex) => {
          const stage = tray[stageIndex];
          const mark = marks[stageIndex];
          const pinned = stageIndex < pinnedCount;
          return (
            <Pressable
              key={stageIndex}
              accessibilityRole="button"
              accessibilityState={{
                disabled: !stage || phase === "feedback" || pinned,
              }}
              disabled={!stage || phase === "feedback" || pinned}
              onPress={() => removeStage(stageIndex)}
              className={getSlotClassName({ mark, phase, stage })}
            >
              <View
                className={
                  stage
                    ? "h-6 w-6 items-center justify-center rounded-full bg-[#E1EECC]"
                    : "h-6 w-6 items-center justify-center rounded-full bg-[#EEE8DD]"
                }
              >
                <Text className="happy-font-body-bold text-xs text-[#56633F]">
                  {stageIndex + 1}
                </Text>
              </View>
              <Text
                className={
                  stage
                    ? "happy-font-body flex-1 text-[14.5px] leading-5 text-[#201E1D]"
                    : "happy-font-body flex-1 text-[14.5px] leading-5 text-[#82796A]"
                }
              >
                {stage ?? "Tap a chip to place it here"}
              </Text>
              {phase === "feedback" && mark ? (
                <Text className="happy-font-body-bold text-base text-[#56633F]">
                  ✓
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {phase === "entry" ? (
        <View className="mt-3.5 flex-row flex-wrap gap-2">
          {variant?.pool.map((stage) => {
            const used = tray.includes(stage);
            return (
              <Pressable
                key={stage}
                accessibilityRole="button"
                accessibilityState={{ disabled: used }}
                disabled={used}
                onPress={() => addStage(stage)}
                className={
                  used
                    ? "min-h-11 justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-2.5 opacity-30"
                    : "min-h-11 justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-2.5 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none"
                }
              >
                <Text className="happy-font-body-semibold text-[14px] leading-[18px] text-[#201E1D]">
                  {stage}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {phase === "entry" && attemptCount >= 1 ? (
        <View className="mt-3 flex-row items-start gap-2 rounded-[20px] bg-[#F9F4ED] px-4 py-3">
          <Text className="happy-font-body-bold text-[#C67139]">?</Text>
          <Text className="happy-font-body flex-1 text-[13.5px] leading-5 text-[#3F3A34]">
            <Text className="happy-font-body-bold">Clue: </Text>
            {variant?.clue}
          </Text>
        </View>
      ) : null}

      {phase === "feedback" ? (
        <WaveOrderFeedback
          capability={readString(content.capability)}
          correct={correct}
          feedbackText={feedbackText}
          supported={supported}
        />
      ) : null}
    </View>
  );
}

function WaveOrderFeedback({
  capability,
  correct,
  feedbackText,
  supported,
}: {
  capability: string | null;
  correct: boolean;
  feedbackText: string | null;
  supported: boolean;
}) {
  const positive = correct || supported;
  return (
    <View
      className={
        positive
          ? "mt-4 flex-row items-start gap-2.5 rounded-[24px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-[17px] py-[15px]"
          : "mt-4 rounded-[24px] border-[1.5px] border-[#C67139] bg-[#FFF2EB] px-[17px] py-[15px]"
      }
    >
      {positive ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#7A8A5E]">
          <Text className="happy-font-body-bold text-sm text-white">✓</Text>
        </View>
      ) : null}
      <View className="flex-1">
        <Text
          className={
            positive
              ? "happy-font-heading-bold text-base leading-5 text-[#56633F]"
              : "happy-font-heading-bold text-base leading-5 text-[#8C491A]"
          }
        >
          {supported
            ? "Here’s the thinking"
            : correct
              ? "Why it fits"
              : "Try the order again"}
        </Text>
        <Text className="happy-font-body mt-1.5 text-[13.5px] leading-5 text-[#201E1D]">
          {feedbackText}
        </Text>
        {correct && capability ? (
          <Text className="happy-font-body mt-2 text-[13px] leading-[18px] text-[#56633F]">
            <Text className="happy-font-body-bold">New capability: </Text>
            {capability}
          </Text>
        ) : null}
      </View>
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
    marks: null,
    pinnedCount: 0,
    feedbackText: null,
    isCorrect: false,
    supported: false,
    ...extra,
  };
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readBooleanList(value: unknown): boolean[] {
  return Array.isArray(value) ? value.map((item) => item === true) : [];
}

function getSlotClassName({
  mark,
  phase,
  stage,
}: {
  mark: boolean | undefined;
  phase: "entry" | "feedback";
  stage: string | undefined;
}): string {
  if (!stage) {
    return "min-h-[54px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-dashed border-[#82796A] px-3.5 py-2.5";
  }
  if (phase === "feedback" && mark) {
    return "min-h-[54px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-3.5 py-2.5 shadow-sm shadow-black/10";
  }
  if (phase === "feedback") {
    return "min-h-[54px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#C67139] bg-[#FFF2EB] px-3.5 py-2.5 shadow-sm shadow-black/10";
  }
  return "min-h-[54px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-3.5 py-2.5 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none";
}
