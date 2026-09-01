import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { Card } from "@/src/components/ui/Card";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ToolkitTool {
  label: string;
  use: string;
}

interface ToolkitMoment {
  label: string;
  toolIndex: number;
  key: string;
  response: string;
}

export function ToolkitShelfCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const moments = readMoments(content.moments);

  const phase = readString(saved?.phase) === "review" ? "review" : "selecting_moment";
  const selectedMomentIndex = readNullableNumber(saved?.selectedMomentIndex);
  const selectedMoment =
    selectedMomentIndex === null ? null : moments[selectedMomentIndex];

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), false);
    }
  }, [onInteraction, saved]);

  const selectMoment = (index: number) => {
    if (locked) return;
    onInteraction(
      createResponse({ 
        ...saved,
        selectedMomentIndex: index,
        phase: "review",
      }),
      true // Ready for Continue
    );
  };

  return (
    <View className="px-2 pb-10">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Right tool, right moment"}
        instruction={readString(content.instruction) ?? "Tap a moment below."}
      />

      <View className="gap-2.5 mt-2">
        {moments.map((moment, index) => {
          const selected = selectedMomentIndex === index;
          return (
            <React.Fragment key={moment.label}>
              <Card
                variant={selected ? "answer-selected" : "answer"}
                onPress={() => selectMoment(index)}
                disabled={locked}
                contentClassName="flex-row items-center justify-center min-h-[48px] py-3 px-4"
              >
                <View className="flex-row items-center flex-1">
                  {selected && (
                    <View className="w-[22px] h-[22px] rounded-full bg-[#185A37] items-center justify-center absolute left-0 z-10">
                      <Text className="text-white text-[11px] font-bold">✓</Text>
                    </View>
                  )}
                  <Text
                    className={
                      selected
                        ? "happy-font-body-bold text-[17px] leading-[22px] text-selection-text text-center flex-1 px-7"
                        : "happy-font-body-medium text-[17px] leading-[22px] text-text-primary text-center flex-1"
                    }
                  >
                    {moment.label}
                  </Text>
                </View>
              </Card>

              {phase === "review" && selected ? (
                <View className="mb-2 mt-1 rounded-[21px] bg-[#F2F8EF] px-5 py-[16px]">
                  <Text className="happy-font-body-bold text-[11.5px] tracking-[0.8px] text-[#29452A] mb-1.5 uppercase">
                    {moment.key}
                  </Text>
                  <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F4A31]">
                    {moment.response}
                  </Text>
                </View>
              ) : null}
            </React.Fragment>
          );
        })}
      </View>

      {content.note ? (
        <Text className="happy-font-body mt-5 text-center text-xs text-[#82796A]">
          {readString(content.note)}
        </Text>
      ) : null}
    </View>
  );
}

function readTools(value: unknown): ToolkitTool[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const tool = readRecord(item);
    const label = readString(tool?.label);
    const use = readString(tool?.use);
    return label && use ? [{ label, use }] : [];
  });
}

function readMoments(value: unknown): ToolkitMoment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const moment = readRecord(item);
    const label = readString(moment?.label);
    const toolIndex = readNumber(moment?.toolIndex);
    const key = readString(moment?.key);
    const response = readString(moment?.response);
    return label && toolIndex !== null && key && response
      ? [{ label, toolIndex, key, response }]
      : [];
  });
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.ToolkitShelf,
    phase: "selecting_moment",
    selectedMomentIndex: null,
    isCorrect: true,
    ...extra,
  };
}
