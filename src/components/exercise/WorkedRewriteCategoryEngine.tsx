import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface RewriteRow {
  tone: "orange" | "neutral" | "olive";
  label: string;
  text: string;
  coach: string;
}

export function WorkedRewriteCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const rows = readRows(content.rows);
  const cardIndex = readNumber(saved?.cardIndex) ?? 0;
  const complete = rows.length > 0 && cardIndex >= rows.length - 1;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Autopsy of a 2am thought"}
        instruction={readString(content.instruction) ?? "Watch four moves."}
      />

      <View className="gap-[9px]">
        {rows.slice(0, cardIndex + 1).map((row) => (
          <RewriteCard key={row.label} row={row} />
        ))}
      </View>
      <Text className="happy-font-body mt-3 text-center text-[12.5px] leading-[18px] text-[#82796A]">
        {complete
          ? readString(content.finalNote)
          : `Move ${cardIndex + 1} of ${rows.length}`}
      </Text>
    </View>
  );
}

function RewriteCard({ row }: { row: RewriteRow }) {
  const cardClass =
    row.tone === "orange"
      ? "rounded-[20px] border-[1.5px] border-[#E4B68F] bg-[#FFF2EB] px-[15px] py-[13px]"
      : row.tone === "olive"
        ? "rounded-[20px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-[15px] py-[13px]"
        : "rounded-[20px] border border-[#DCD3C4] bg-[#F9F4ED] px-[15px] py-[13px]";
  const labelClass =
    row.tone === "orange"
      ? "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#8C491A]"
      : row.tone === "olive"
        ? "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#56633F]"
        : "happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#82796A]";
  return (
    <View className={cardClass}>
      <Text className={labelClass}>{row.label}</Text>
      <Text className="happy-font-body mt-1 text-[14px] leading-[21px] text-[#201E1D]">
        {row.text}
      </Text>
      <View className="mt-1.5 border-t border-dashed border-[#DCD3C4] pt-1.5">
        <Text className="happy-font-body italic text-xs leading-[18px] text-[#82796A]">
          {row.coach}
        </Text>
      </View>
    </View>
  );
}

function readRows(value: unknown): RewriteRow[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const row = readRecord(item);
    const label = readString(row?.label);
    const text = readString(row?.text);
    const coach = readString(row?.coach);
    const tone = readTone(row?.tone);
    return label && text && coach ? [{ label, text, coach, tone }] : [];
  });
}

function readTone(value: unknown): RewriteRow["tone"] {
  return value === "orange" || value === "olive" ? value : "neutral";
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WorkedRewrite,
    phase: "rewrite",
    cardIndex: 0,
    isCorrect: true,
    ...extra,
  };
}
