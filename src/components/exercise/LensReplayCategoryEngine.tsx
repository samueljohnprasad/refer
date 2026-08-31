import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface LensSegment {
  text: string;
  key?: string;
  response?: string;
}

export function LensReplayCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const segments = readSegments(content.segments);
  const highlightIndexes = segments.flatMap((segment, index) =>
    segment.key ? [index] : [],
  );
  const seenIndexes = readNumberArray(saved?.seenSegmentIndexes);
  const activeIndex = readNullableNumber(saved?.activeSegmentIndex);
  const activeSegment = activeIndex === null ? null : segments[activeIndex];
  const allSeen =
    highlightIndexes.length > 0 &&
    seenIndexes.length >= highlightIndexes.length;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const openHighlight = (index: number) => {
    if (locked) return;
    Haptics.selectionAsync();
    const nextSeen = seenIndexes.includes(index)
      ? seenIndexes
      : [...seenIndexes, index];
    onInteraction(
      createResponse({
        ...saved,
        seenSegmentIndexes: nextSeen,
        activeSegmentIndex: index,
      }),
      nextSeen.length >= highlightIndexes.length,
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The same three lines"}
        instruction={readString(content.instruction) ?? "Tap the highlights."}
      />

      <View className="rounded-[26px] border border-[#E4DACB] bg-[#F9F4ED] px-5 py-5 shadow-sm shadow-black/10">
        <Text className="happy-font-body-bold mb-3 text-[10px] tracking-[0.8px] text-[#82796A]">
          {readString(content.diaryLabel)}
        </Text>
        <Text className="happy-font-body text-[18px] leading-[30px] text-[#201E1D]">
          {segments.map((segment, index) => {
            if (!segment.key) {
              return (
                <Text key={`${index}-${segment.text}`}>{segment.text}</Text>
              );
            }
            const seen = seenIndexes.includes(index);
            const active = activeIndex === index;
            return (
              <Text
                key={`${index}-${segment.text}`}
                accessibilityRole="button"
                onPress={() => openHighlight(index)}
                className={
                  active
                    ? "happy-font-body-bold rounded bg-[#D3E0CD] text-[#3F4A31]"
                    : seen
                      ? "happy-font-body-bold rounded bg-[#E5EDE1] text-[#29452A]"
                      : "happy-font-body-bold rounded bg-[#F2F8EF] text-[#29452A]"
                }
              >
                {segment.text}
              </Text>
            );
          })}
        </Text>
      </View>

      {activeSegment?.key ? (
        <View className="mt-3 rounded-[21px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-4 py-[14px]">
          <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#29452A]">
            {activeSegment.key}
          </Text>
          <Text className="happy-font-body mt-1 text-[13.5px] leading-5 text-[#3F4A31]">
            {activeSegment.response}
          </Text>
        </View>
      ) : null}

      {allSeen ? (
        <View className="mt-3 rounded-[21px] border border-[#DCD3C4] bg-[#EEE8DD] px-4 py-[14px]">
          <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#82796A]">
            THE IDEA
          </Text>
          <Text className="happy-font-body mt-1 text-[13.5px] leading-5 text-[#201E1D]">
            {readString(content.insight)}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-xs text-[#82796A]">
        {allSeen
          ? "Same lines. New eyes."
          : `${seenIndexes.length} of ${highlightIndexes.length} highlights`}
      </Text>
    </View>
  );
}

function readSegments(value: unknown): LensSegment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const segment = readRecord(item);
    const text = readString(segment?.text);
    return text
      ? [
          {
            text,
            key: readString(segment?.key) ?? undefined,
            response: readString(segment?.response) ?? undefined,
          },
        ]
      : [];
  });
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LensReplay,
    phase: "replay",
    seenSegmentIndexes: [],
    activeSegmentIndex: null,
    isCorrect: true,
    ...extra,
  };
}
