import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseTeachingPanel } from "@/src/components/exercise/CourseExerciseTeachingPanel";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ReframeTray {
  label: string;
  options: string[];
}

export function ReframeBuilderCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const trays = readTrays(content.trays);
  const selectedIndexes = readNumberArray(saved?.selectedIndexes);
  const showingFeedback = saved?.phase === "feedback";
  const picks = trays.map(
    (tray, index) => tray.options[selectedIndexes[index]],
  );
  const ready = trays.length > 0 && picks.every(Boolean);
  const fairerThought = buildFairerThought(picks);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const selectLine = (trayIndex: number, optionIndex: number) => {
    if (locked || showingFeedback) return;
    Haptics.selectionAsync();
    const nextIndexes = [...selectedIndexes];
    while (nextIndexes.length < trays.length) nextIndexes.push(-1);
    nextIndexes[trayIndex] = optionIndex;
    onInteraction(
      createResponse({ ...saved, selectedIndexes: nextIndexes }),
      nextIndexes.every((index) => index >= 0),
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Build a fairer thought"}
        instruction={
          readString(content.instruction) ?? "Take one line from each tray."
        }
      />

      <View className="mb-3 rounded-[24px] rounded-bl-md bg-[#F9F4ED] px-[17px] py-[14px] shadow-sm shadow-black/10">
        <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#56633F]">
          {readString(content.sceneLabel)}
        </Text>
        <Text className="happy-font-body mt-1 text-[14px] leading-[21px] text-[#201E1D]">
          {readString(content.scene)}
        </Text>
      </View>

      <View
        className={
          showingFeedback
            ? "mb-3 w-[72%] rounded-[20px] border-[1.5px] border-[#E4B68F] bg-[#FFF2EB] px-[14px] py-2.5 opacity-75"
            : "mb-3 rounded-[22px] border-[1.5px] border-[#E4B68F] bg-[#FFF2EB] px-[18px] py-4"
        }
      >
        <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#8C491A]">
          THE HOT THOUGHT
        </Text>
        <Text
          className={
            showingFeedback
              ? "happy-font-heading-bold mt-1 text-[14px] leading-[19px] text-[#8C491A]"
              : "happy-font-heading-bold mt-1 text-xl leading-[27px] text-[#8C491A]"
          }
        >
          {readString(content.hotThought)}
        </Text>
      </View>

      <View className="rounded-[22px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-[18px] py-4">
        <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#56633F]">
          THE FAIRER THOUGHT
        </Text>
        <Text
          className={
            showingFeedback
              ? "happy-font-heading-bold mt-1 text-[21px] leading-[29px] text-[#3F4A31]"
              : ready
                ? "happy-font-heading-bold mt-1 text-[17px] leading-6 text-[#3F4A31]"
                : "happy-font-heading-bold mt-1 text-[17px] leading-6 text-[#82796A]"
          }
        >
          {fairerThought}
        </Text>
      </View>

      {!showingFeedback ? (
        <View className="mt-3.5 gap-3.5">
          {trays.map((tray, trayIndex) => (
            <View key={tray.label}>
              <Text className="happy-font-body-bold mb-2 text-[10.5px] tracking-[0.5px] text-[#82796A]">
                {tray.label}
              </Text>
              <View className="gap-2">
                {tray.options.map((option, optionIndex) => {
                  const selected = selectedIndexes[trayIndex] === optionIndex;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => selectLine(trayIndex, optionIndex)}
                      className={
                        selected
                          ? "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#93A876] border-b-[3px] bg-[#F0FAE1] px-4 py-2.5"
                          : "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-2.5 active:translate-y-0.5 active:border-b-[1.5px]"
                      }
                    >
                      <Text className="happy-font-body text-[14px] leading-5 text-[#201E1D]">
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <CourseExerciseTeachingPanel
          title={readString(content.feedbackTitle) ?? "More of the picture"}
          body={readString(content.feedback) ?? ""}
        />
      )}
    </View>
  );
}

function buildFairerThought(picks: Array<string | undefined>): string {
  if (!picks.every(Boolean)) return "…";
  const [evidence, perspective, coach] = picks as string[];
  return `${evidence.charAt(0).toUpperCase()}${evidence.slice(1)}. ${perspective}. ${coach}.`;
}

function readTrays(value: unknown): ReframeTray[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const tray = readRecord(item);
    const label = readString(tray?.label);
    const options = readStringList(tray?.options);
    return label && options.length ? [{ label, options }] : [];
  });
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.ReframeBuilder,
    phase: "building",
    selectedIndexes: [],
    isCorrect: true,
    ...extra,
  };
}
