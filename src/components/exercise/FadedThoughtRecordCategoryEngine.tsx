import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  readRecordScreens,
  type RecordOption,
  type RecordRow,
  type RecordScreen,
  type RecordSlot,
} from "@/src/components/exercise/fadedThoughtRecordContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function FadedThoughtRecordCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const screens = readRecordScreens(content.screens);
  const screenIndex = readIndex(saved?.screenIndex) ?? 0;
  const screen = screens[screenIndex];
  const evidenceIndex = readIndex(saved?.selectedEvidenceIndex);
  const realisticIndex = readIndex(saved?.selectedRealisticIndex);
  const coachFeedback = readString(saved?.coachFeedback);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    },
    [],
  );

  const selectOption = (
    slot: RecordSlot,
    optionIndex: number,
    option: RecordOption,
  ) => {
    if (locked || !screen) return;
    if (!option.isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrongKey(`${slot}-${optionIndex}`);
      onInteraction(
        createResponse({ ...saved, coachFeedback: option.feedback }),
        false,
      );
      clearTimer.current = setTimeout(() => setWrongKey(null), 420);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const nextEvidenceIndex = slot === "evidence" ? optionIndex : evidenceIndex;
    const nextRealisticIndex =
      slot === "realistic" ? optionIndex : realisticIndex;
    const screenComplete =
      nextEvidenceIndex !== null &&
      (!screen.realisticOptions.length || nextRealisticIndex !== null);
    onInteraction(
      createResponse({
        ...saved,
        selectedEvidenceIndex: nextEvidenceIndex,
        selectedRealisticIndex: nextRealisticIndex,
        coachFeedback: option.feedback,
      }),
      screenComplete,
    );
  };

  if (!screen) return null;
  const activeOptions = getActiveOptions(screen, evidenceIndex, realisticIndex);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={screen.title}
        instruction={
          readString(content.instruction) ?? "Watch, then fill the open moves."
        }
      />

      <View className="mb-1.5 flex-row justify-center gap-1.5">
        {screens.map((_, index) => (
          <View
            key={index}
            className={
              index === screenIndex
                ? "h-2 w-[22px] rounded-full bg-[#7A8A5E]"
                : index < screenIndex
                  ? "h-2 w-2 rounded-full bg-[#7A8A5E]"
                  : "h-2 w-2 rounded-full bg-[#DCD3C4]"
            }
          />
        ))}
      </View>
      <Text className="happy-font-body-bold mb-2.5 text-center text-[10.5px] tracking-[0.6px] text-[#82796A]">
        {screen.label}
      </Text>

      <View className="gap-2">
        {screen.rows.map((row) => (
          <RecordRowCard
            key={row.label}
            row={row}
            text={resolveRowText(row, screen, evidenceIndex, realisticIndex)}
            complete={isRowComplete(row, evidenceIndex, realisticIndex, screen)}
          />
        ))}
      </View>

      {activeOptions ? (
      <View className="mt-3 gap-2">
          {activeOptions.options.map((option, index) => (
            <Pressable
              key={option.text}
              accessibilityRole="button"
              onPress={() => selectOption(activeOptions.slot, index, option)}
              className={
                wrongKey === `${activeOptions.slot}-${index}`
                  ? "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#C86D55] bg-[#FFF0EA] px-4 py-2.5"
                  : "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-2.5 active:translate-y-0.5 active:border-b-[1.5px]"
              }
            >
              <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#201E1D]">
                {option.text}
              </Text>
            </Pressable>
          ))}
      </View>
      ) : null}

      <Text className="happy-font-body mt-3 px-0.5 italic text-[13px] leading-[19px] text-[#696156]">
        {coachFeedback ?? screen.coach}
      </Text>
    </View>
  );
}

function RecordRowCard({
  row,
  text,
  complete,
}: {
  row: RecordRow;
  text: string;
  complete: boolean;
}) {
  const blank = Boolean(row.slot) && !complete;
  const cardClass = blank
    ? "rounded-[20px] border-[1.5px] border-dashed border-[#B9AFA0] bg-transparent px-[14px] py-3"
    : row.kind === "thought"
      ? "rounded-[20px] border-[1.5px] border-[#E4B68F] bg-[#FFF2EB] px-[14px] py-3"
      : complete && row.slot
        ? "rounded-[20px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-[14px] py-3"
        : "rounded-[20px] border border-[#DCD3C4] bg-[#F9F4ED] px-[14px] py-3";
  const labelClass =
    row.kind === "thought"
      ? "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#8C491A]"
      : row.kind === "against" || row.kind === "realistic"
        ? "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#56633F]"
        : "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#82796A]";
  return (
    <View className={cardClass}>
      <Text className={labelClass}>{row.label}</Text>
      <Text
        className={
          blank
            ? "happy-font-body mt-1 italic text-[13.5px] leading-5 text-[#82796A]"
            : "happy-font-body mt-1 text-[13.5px] leading-5 text-[#201E1D]"
        }
      >
        {text}
      </Text>
    </View>
  );
}

function getActiveOptions(
  screen: RecordScreen,
  evidenceIndex: number | null,
  realisticIndex: number | null,
) {
  if (screen.evidenceOptions.length && evidenceIndex === null) {
    return { slot: "evidence" as const, options: screen.evidenceOptions };
  }
  if (
    screen.realisticOptions.length &&
    evidenceIndex !== null &&
    realisticIndex === null
  ) {
    return { slot: "realistic" as const, options: screen.realisticOptions };
  }
  return null;
}

function resolveRowText(
  row: RecordRow,
  screen: RecordScreen,
  evidenceIndex: number | null,
  realisticIndex: number | null,
): string {
  if (row.slot === "evidence" && evidenceIndex !== null) {
    return screen.evidenceOptions[evidenceIndex]?.text ?? row.text;
  }
  if (row.slot === "realistic" && evidenceIndex !== null) {
    if (screen.realisticAfter) return screen.realisticAfter;
    if (realisticIndex !== null) {
      return screen.realisticOptions[realisticIndex]?.text ?? row.text;
    }
  }
  return row.text;
}

function isRowComplete(
  row: RecordRow,
  evidenceIndex: number | null,
  realisticIndex: number | null,
  screen: RecordScreen,
): boolean {
  if (!row.slot) return true;
  if (row.slot === "evidence") return evidenceIndex !== null;
  return (
    evidenceIndex !== null &&
    (Boolean(screen.realisticAfter) || realisticIndex !== null)
  );
}

function readIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.FadedThoughtRecord,
    phase: "practice",
    screenIndex: 0,
    selectedEvidenceIndex: null,
    selectedRealisticIndex: null,
    coachFeedback: null,
    isCorrect: true,
    ...extra,
  };
}
