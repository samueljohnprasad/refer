import React, { useEffect } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ComparisonRow {
  question: string;
  left: string;
  right: string;
}

export function SameButDifferentCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const rows = readComparisonRows(content.rows);
  const openedIndexes = readNumberArray(saved?.openedRowIndexes);
  const reduceMotion = useReducedMotion();
  const allOpened = rows.length > 0 && openedIndexes.length >= rows.length;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const toggleRow = (index: number) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    const nextIndexes = openedIndexes.includes(index)
      ? openedIndexes.filter((openedIndex) => openedIndex !== index)
      : [...openedIndexes, index];
    onInteraction(
      createResponse({ ...saved, openedRowIndexes: nextIndexes }),
      nextIndexes.length >= rows.length,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Worry ≠ anxiety"}
        instruction={readString(content.instruction) ?? "Tap each row."}
      />

      <View className="mb-2.5 flex-row gap-2">
        <ComparisonHeading
          label={readString(content.leftHeading) ?? "Worry"}
          tone="orange"
        />
        <ComparisonHeading
          label={readString(content.rightHeading) ?? "Anxiety"}
          tone="olive"
        />
      </View>

      <View className="gap-[9px]">
        {rows.map((row, index) => {
          const open = openedIndexes.includes(index);
          return (
            <Pressable
              key={row.question}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => toggleRow(index)}
              className={
                open
                  ? "w-full rounded-[22px] border-[1.5px] border-[#ABC0A2] bg-[#F9F4ED] px-4 py-[13px] shadow-sm shadow-[#ABC0A2] active:translate-y-0.5"
                  : "w-full rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-[13px] shadow-sm shadow-black/10 active:translate-y-0.5"
              }
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text className="happy-font-body-bold flex-1 text-[13px] leading-[18px] text-[#82796A]">
                  {row.question}
                </Text>
                {!open ? (
                  <Text className="happy-font-body-bold text-sm text-[#82796A]">
                    ▾
                  </Text>
                ) : null}
              </View>
              {open ? (
                <View className="mt-2 flex-row gap-2.5">
                  <Text className="happy-font-body-bold flex-1 text-[13px] leading-[19px] text-[#29452A]">
                    {row.left}
                  </Text>
                  <Text className="happy-font-body-bold flex-1 text-[13px] leading-[19px] text-[#3F4A31]">
                    {row.right}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {allOpened ? (
        <View className="mt-3 rounded-[20px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-4 py-[14px]">
          <Text className="happy-font-body-bold mb-1 text-[10.5px] tracking-[0.5px] text-[#29452A]">
            THE TELL
          </Text>
          <Text className="happy-font-body text-[13.5px] leading-5 text-[#3F4A31]">
            {readString(content.tell)}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-[12.5px] text-[#82796A]">
        {allOpened
          ? "Definitions fade; tells survive."
          : `${openedIndexes.length} of ${rows.length} rows opened`}
      </Text>
    </View>
  );
}

function ComparisonHeading({
  label,
  tone,
}: {
  label: string;
  tone: "orange" | "olive";
}) {
  return (
    <View
      className={
        tone === "olive"
          ? "flex-1 items-center rounded-2xl border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-1.5 py-2.5"
          : "flex-1 items-center rounded-2xl border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-1.5 py-2.5"
      }
    >
      <Text
        className={
          tone === "olive"
            ? "happy-font-heading-bold text-base text-[#29452A]"
            : "happy-font-heading-bold text-base text-[#29452A]"
        }
      >
        {label}
      </Text>
    </View>
  );
}

function readComparisonRows(value: unknown): ComparisonRow[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const row = readRecord(item);
    const question = readString(row?.question);
    const left = readString(row?.left);
    const right = readString(row?.right);
    return question && left && right ? [{ question, left, right }] : [];
  });
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SameButDifferent,
    phase: "comparison",
    openedRowIndexes: [],
    isCorrect: true,
    ...extra,
  };
}
