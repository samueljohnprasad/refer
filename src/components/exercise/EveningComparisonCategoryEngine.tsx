import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ComparisonColumn {
  heading: string;
  rows: string[];
  outcome: string;
}

export function EveningComparisonCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const columns = readColumns(content.columns);

  useEffect(() => {
    if (!readRecord(savedResponse)) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.EveningComparison,
          phase: "concept",
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, savedResponse]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Two evenings, one dip"}
        instruction={readString(content.instruction)}
      />

      <View className="flex-row items-stretch gap-2.5">
        {columns.map((column, index) => (
          <ComparisonColumnCard
            key={column.heading}
            column={column}
            tone={index === 0 ? "neutral" : "olive"}
          />
        ))}
      </View>

      {readString(content.explanation) && (
        <Text className="happy-font-body mt-3 text-center text-[13.5px] leading-5 text-[#3F3A34]">
          {readString(content.explanation)}
        </Text>
      )}
      {readString(content.note) && (
        <Text className="happy-font-body mt-3.5 text-center text-[12.5px] leading-[18px] text-[#82796A]">
          {readString(content.note)}
        </Text>
      )}
    </View>
  );
}

function ComparisonColumnCard({
  column,
  tone,
}: {
  column: ComparisonColumn;
  tone: "neutral" | "olive";
}) {
  const isOlive = tone === "olive";

  return (
    <View
      className={
        isOlive
          ? "flex-1 gap-2 rounded-[24px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-4 py-4"
          : "flex-1 gap-2 rounded-[24px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-4"
      }
    >
      <Text
        className={
          isOlive
            ? "happy-font-body-bold text-[11px] tracking-[0.45px] text-[#29452A]"
            : "happy-font-body-bold text-[11px] tracking-[0.45px] text-[#82796A]"
        }
      >
        {column.heading}
      </Text>
      {column.rows.map((row) => (
        <Text
          key={row}
          className="happy-font-body text-[13.5px] leading-[19px] text-[#201E1D]"
        >
          {row}
        </Text>
      ))}
      <Text
        className={
          isOlive
            ? "happy-font-body-bold mt-auto border-t-[1.5px] border-[#ABC0A2] pt-2 text-[12.5px] leading-[18px] text-[#3F4A31]"
            : "happy-font-body-bold mt-auto border-t-[1.5px] border-[#DCD3C4] pt-2 text-[12.5px] leading-[18px] text-[#5E574D]"
        }
      >
        {column.outcome}
      </Text>
    </View>
  );
}

function readColumns(value: unknown): ComparisonColumn[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const column = readRecord(item);
    const heading = readString(column?.heading);
    const outcome = readString(column?.outcome);
    if (!heading || !outcome) return [];
    return [{ heading, outcome, rows: readStringArray(column?.rows) }];
  });
}
