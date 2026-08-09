import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import {
  readTeachBackFollowUps,
  readTeachBackSteps,
  type TeachBackStep,
} from "@/src/components/exercise/courseExerciseSixthBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function TeachBackChainCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const steps = readTeachBackSteps(content.steps);
  const orderedSteps = [...steps].sort(
    (left, right) => left.order - right.order,
  );
  const followUps = readTeachBackFollowUps(content.followUpOptions);
  const slotHints = readStringArray(content.slotHints);
  const completedStepCount = readNumber(saved?.completedStepCount) ?? 0;
  const selectedFollowUpIndex = readNumber(saved?.selectedFollowUpIndex);
  const coachHint = readString(saved?.coachHint);
  const chainComplete = completedStepCount >= orderedSteps.length;
  const selectedFollowUp =
    selectedFollowUpIndex == null ? null : followUps[selectedFollowUpIndex];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const chooseStep = (step: TeachBackStep) => {
    if (locked || step.order <= completedStepCount) return;
    if (step.order !== completedStepCount + 1) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const previousStep = orderedSteps[completedStepCount - 1];
      const hint = previousStep
        ? `Almost — what happens right after “${previousStep.label}”?`
        : "Almost — what happens first?";
      onInteraction(createResponse({ ...saved, coachHint: hint }), false);
      return;
    }

    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        completedStepCount: completedStepCount + 1,
        coachHint: null,
      }),
      false,
    );
  };

  const chooseFollowUp = (optionIndex: number) => {
    if (locked || selectedFollowUp) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({ ...saved, selectedFollowUpIndex: optionIndex }),
      true,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Pip needs your help"}
        instruction={
          readString(content.instruction) ?? "Build the explanation."
        }
      />

      <PipMessage text={readString(content.message)} />

      <View className="gap-2">
        {slotHints.map((hint, index) => {
          const step = orderedSteps[index];
          const filled = index < completedStepCount;
          return (
            <View
              key={hint}
              className={
                filled
                  ? "min-h-12 flex-row items-center gap-2.5 rounded-[20px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-[13px] py-2.5"
                  : "min-h-12 flex-row items-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-[#82796A] px-[13px] py-2.5"
              }
            >
              <View
                className={
                  filled
                    ? "h-[22px] w-[22px] items-center justify-center rounded-full bg-[#7A8A5E]"
                    : "h-[22px] w-[22px] items-center justify-center rounded-full bg-[#EBDDC5]"
                }
              >
                <Text
                  className={
                    filled
                      ? "happy-font-body-bold text-[11.5px] text-white"
                      : "happy-font-body-bold text-[11.5px] text-[#201E1D]"
                  }
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                className={
                  filled
                    ? "happy-font-body-bold flex-1 text-[13.5px] leading-[19px] text-[#56633F]"
                    : "happy-font-body flex-1 text-[13.5px] italic leading-[19px] text-[#82796A]"
                }
              >
                {filled ? step?.label : hint}
              </Text>
            </View>
          );
        })}
      </View>

      {!chainComplete ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {steps.map((step) => {
            const used = step.order <= completedStepCount;
            return (
              <Pressable
                key={step.id}
                accessibilityRole="button"
                disabled={locked || used}
                onPress={() => chooseStep(step)}
                className={
                  used
                    ? "min-h-11 justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-2.5 opacity-30"
                    : "min-h-11 justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-2.5 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none"
                }
              >
                <Text className="happy-font-body-bold text-[13px] leading-[18px] text-[#201E1D]">
                  {step.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {coachHint && !chainComplete ? (
        <Text className="happy-font-body mt-2.5 px-0.5 text-[13px] italic leading-5 text-[#82796A]">
          {coachHint}
        </Text>
      ) : null}

      {chainComplete ? (
        <View className="mt-3.5 gap-2.5">
          <PipMessage text={readString(content.followUp)} />
          {followUps.map((option, index) => {
            const selected = selectedFollowUpIndex === index;
            return (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                disabled={locked || Boolean(selectedFollowUp)}
                onPress={() => chooseFollowUp(index)}
                className={getFollowUpClassName(
                  selected,
                  Boolean(selectedFollowUp),
                )}
              >
                <Text className="happy-font-body-bold text-[14.5px] leading-5 text-[#201E1D]">
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {selectedFollowUp ? (
        <View className="mt-3 gap-2.5">
          <PipMessage text={selectedFollowUp.reply} confirmed />
          <Text className="happy-font-body-bold text-center text-[13px] leading-[19px] text-[#56633F]">
            {selectedFollowUp.takeaway}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function PipMessage({
  text,
  confirmed = false,
}: {
  text: string | null;
  confirmed?: boolean;
}) {
  return (
    <View className="mb-3.5 flex-row items-start gap-2.5">
      <View
        className={
          confirmed
            ? "h-[42px] w-[42px] items-center justify-center rounded-full bg-[#7A8A5E]"
            : "h-[42px] w-[42px] items-center justify-center rounded-full bg-[#E1EECC]"
        }
      >
        <Text
          className={
            confirmed
              ? "happy-font-heading-bold text-[19px] text-white"
              : "happy-font-heading-bold text-[19px] text-[#56633F]"
          }
        >
          P
        </Text>
      </View>
      <View
        className={
          confirmed
            ? "flex-1 rounded-br-[20px] rounded-t-[20px] rounded-bl-md border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-3.5 py-[11px]"
            : "flex-1 rounded-br-[20px] rounded-t-[20px] rounded-bl-md border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-3.5 py-[11px]"
        }
      >
        <Text className="happy-font-body text-[14px] leading-[21px] text-[#201E1D]">
          {text}
        </Text>
      </View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.TeachBackChain,
    phase: "teach-back",
    completedStepCount: 0,
    selectedFollowUpIndex: null,
    coachHint: null,
    isCorrect: true,
    ...extra,
  };
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function getFollowUpClassName(selected: boolean, answered: boolean): string {
  if (selected) {
    return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#7A8A5E] bg-[#F0FAE1] px-4 py-3 shadow-sm shadow-black/10";
  }
  if (answered) {
    return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 opacity-50";
  }
  return "min-h-[52px] justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none";
}
