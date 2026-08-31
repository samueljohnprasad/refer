import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
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
  const tools = readTools(content.tools);
  const moments = readMoments(content.moments);
  const selectedMomentIndex = readNullableNumber(saved?.selectedMomentIndex);
  const selectedMoment =
    selectedMomentIndex === null ? null : moments[selectedMomentIndex];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const selectMoment = (index: number) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({ ...saved, selectedMomentIndex: index }),
      true,
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Right tool, right moment"}
        instruction={readString(content.instruction) ?? "Tap a moment below."}
      />

      <View className="flex-row gap-2">
        {tools.map((tool, index) => {
          const selected = selectedMoment?.toolIndex === index;
          return (
            <View
              key={tool.label}
              className={
                selected
                  ? "min-h-[78px] flex-1 -translate-y-1 items-center justify-center rounded-[18px] border-[1.5px] border-[#7E9874] bg-[#F2F8EF] px-2 py-2.5 shadow-md shadow-[#ABC0A2]"
                  : "min-h-[78px] flex-1 items-center justify-center rounded-[18px] border border-[#DCD3C4] bg-[#F9F4ED] px-2 py-2.5"
              }
            >
              <Text
                className={
                  selected
                    ? "happy-font-heading-bold text-center text-[15px] leading-[18px] text-[#29452A]"
                    : "happy-font-heading-bold text-center text-[15px] leading-[18px] text-[#201E1D]"
                }
              >
                {tool.label}
              </Text>
              <Text className="happy-font-body mt-1 text-center text-[9.5px] leading-[13px] text-[#82796A]">
                {tool.use}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="mx-3 mt-2 h-[5px] rounded-full bg-[#B9A992]" />

      <Text className="happy-font-body-bold mb-2 mt-4 text-[10.5px] tracking-[0.7px] text-[#82796A]">
        PICK A MOMENT
      </Text>
      <View className="gap-2.5">
        {moments.map((moment, index) => {
          const selected = selectedMomentIndex === index;
          return (
            <Pressable
              key={moment.label}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              disabled={locked}
              onPress={() => selectMoment(index)}
              className={
                selected
                  ? "min-h-[54px] justify-center rounded-[21px] border-[1.5px] border-[#7E9874] border-b-[3px] bg-[#F2F8EF] px-4 py-3 active:translate-y-0.5"
                  : "min-h-[54px] justify-center rounded-[21px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-3 active:translate-y-0.5 active:border-b-[1.5px]"
              }
            >
              <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#201E1D]">
                {moment.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedMoment ? (
        <View className="mt-3 rounded-[21px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-4 py-[14px]">
          <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#29452A]">
            {selectedMoment.key}
          </Text>
          <Text className="happy-font-body mt-1 text-[13.5px] leading-5 text-[#3F4A31]">
            {selectedMoment.response}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-xs text-[#82796A]">
        {readString(content.note)}
      </Text>
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
    phase: "toolkit",
    selectedMomentIndex: null,
    isCorrect: true,
    ...extra,
  };
}
