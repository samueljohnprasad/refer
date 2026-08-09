import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockIcon } from "@hugeicons/core-free-icons";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseTeachingPanel } from "@/src/components/exercise/CourseExerciseTeachingPanel";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function IfThenPlanCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const cues = readStringArray(content.cues);
  const actions = readStringArray(content.actions);
  const cueIndex = readIndex(saved?.cueIndex);
  const actionIndex = readIndex(saved?.actionIndex);
  const showingFeedback = saved?.phase === "feedback";

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const select = (key: "cueIndex" | "actionIndex", index: number) => {
    if (locked || showingFeedback) return;
    Haptics.selectionAsync();
    const next = createResponse({ ...saved, [key]: index });
    onInteraction(
      next,
      readIndex(next.cueIndex) !== null && readIndex(next.actionIndex) !== null,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Build this week’s plan"}
        instruction={readString(content.instruction) ?? "One cue, one move."}
      />

      {!showingFeedback ? (
        <>
          <PlanChoiceGroup
            label="IF…"
            options={cues}
            selectedIndex={cueIndex}
            onSelect={(index) => select("cueIndex", index)}
          />
          <PlanChoiceGroup
            label="…THEN I WILL"
            options={actions}
            selectedIndex={actionIndex}
            onSelect={(index) => select("actionIndex", index)}
          />
          <View className="mt-3.5 rounded-[20px] bg-[#F9F4ED] px-[18px] py-4 shadow-sm shadow-black/10">
            <Text className="happy-font-heading-bold text-[17px] leading-[25px] text-[#201E1D]">
              {buildPlanSentence(
                cues[cueIndex ?? -1],
                actions[actionIndex ?? -1],
              )}
            </Text>
          </View>
          <View className="mt-3.5 flex-row items-center justify-center gap-1.5">
            <HugeiconsIcon icon={LockIcon} size={13} color="#82796A" />
            <Text className="happy-font-body text-[12.5px] text-[#82796A]">
              {readString(content.privacy)}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View className="rounded-[20px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-[18px] py-4">
            <Text className="happy-font-body-bold text-[10.5px] tracking-[0.5px] text-[#29452A]">
              YOUR PLAN
            </Text>
            <Text className="happy-font-heading-bold mt-1 text-[19px] leading-[27px] text-[#3F4A31]">
              {buildPlanSentence(
                cues[cueIndex ?? -1],
                actions[actionIndex ?? -1],
              )}
            </Text>
          </View>
          <CourseExerciseTeachingPanel
            title={readString(content.feedbackTitle) ?? "Saved. Now rehearse"}
            body={readString(content.feedback) ?? ""}
          />
        </>
      )}
    </View>
  );
}

function PlanChoiceGroup({
  label,
  options,
  selectedIndex,
  onSelect,
}: {
  label: string;
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <View className="mb-3.5">
      <Text className="happy-font-body-bold mb-2 text-[10.5px] tracking-[0.5px] text-[#82796A]">
        {label}
      </Text>
      <View className="gap-2">
        {options.map((option, index) => {
          const selected = selectedIndex === index;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onSelect(index)}
              className={
                selected
                  ? "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#7E9874] border-b-[3px] bg-[#F2F8EF] px-4 py-2.5"
                  : "min-h-[50px] justify-center rounded-[20px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-2.5 active:translate-y-0.5 active:border-b-[1.5px]"
              }
            >
              <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#201E1D]">
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function buildPlanSentence(cue?: string, action?: string): string {
  return `If ${cue ?? "[pick a moment]"}, then I will ${action ?? "[pick a move]"}.`;
}

function readIndex(value: unknown): number | null {
  return typeof value === "number" && value >= 0 ? value : null;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.IfThenPlan,
    phase: "building",
    cueIndex: null,
    actionIndex: null,
    isCorrect: true,
    ...extra,
  };
}
