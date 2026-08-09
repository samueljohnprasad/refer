import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseTeachingPanel } from "@/src/components/exercise/CourseExerciseTeachingPanel";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ScenarioOption {
  id: string;
  label: string;
  feedback: string;
  isCorrect: boolean;
}

interface LeverScenario {
  sceneLabel: string;
  scene: string;
  prompt: string;
  clue: string;
  worked: string;
  options: ScenarioOption[];
}

export function LeverScenarioCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const variants = readVariants(content.variants);
  const variantIndex = (readNumber(saved?.variantIndex) ?? 0) % variants.length;
  const variant = variants[variantIndex];
  const selectedOptionId = readString(saved?.selectedOptionId);
  const selectedOption = variant?.options.find(
    (option) => option.id === selectedOptionId,
  );
  const attempts = readNumber(saved?.attempts) ?? 0;
  const showingFeedback = saved?.phase === "feedback";
  const visibleOptions =
    attempts >= 2
      ? (variant?.options.slice(0, 2) ?? [])
      : (variant?.options ?? []);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const selectOption = (option: ScenarioOption) => {
    if (locked || showingFeedback) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        selectedOptionId: option.id,
        isCorrect: option.isCorrect,
      }),
      true,
    );
  };

  if (!variant) return null;

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Put it to work"}
        instruction={
          readString(content.instruction) ?? "Pick what would actually help."
        }
      />

      <View className="mb-3.5 rounded-[24px] rounded-bl-md bg-[#F9F4ED] px-[18px] py-4 shadow-sm shadow-black/10">
        <Text className="happy-font-body-bold text-[10.5px] tracking-[0.6px] text-[#56633F]">
          {variant.sceneLabel}
        </Text>
        <Text className="happy-font-body mt-1 text-[14.5px] leading-[22px] text-[#201E1D]">
          {variant.scene}
        </Text>
      </View>

      <Text className="happy-font-body-bold mb-2.5 text-[16px] leading-[22px] text-[#201E1D]">
        {variant.prompt}
      </Text>
      <View className="gap-2.5">
        {visibleOptions.map((option) => {
          const selected = selectedOptionId === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: showingFeedback }}
              disabled={locked || showingFeedback}
              onPress={() => selectOption(option)}
              className={
                selected
                  ? "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#93A876] border-b-[3px] bg-[#F0FAE1] px-4 py-3"
                  : showingFeedback
                    ? "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 opacity-50"
                    : "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-3 active:translate-y-0.5 active:border-b-[1.5px]"
              }
            >
              <View
                className={
                  selected
                    ? "h-5 w-5 items-center justify-center rounded-full border-2 border-[#7A8A5E] bg-[#7A8A5E]"
                    : "h-5 w-5 rounded-full border-2 border-[#B6AB9B]"
                }
              >
                {selected ? (
                  <Text className="happy-font-body-bold text-[11px] text-white">
                    ✓
                  </Text>
                ) : null}
              </View>
              <Text className="happy-font-body-bold flex-1 text-[13.5px] leading-[19px] text-[#201E1D]">
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showingFeedback && selectedOption ? (
        <CourseExerciseTeachingPanel
          correct={selectedOption.isCorrect}
          title={getFeedbackTitle(selectedOption.isCorrect, attempts)}
          body={selectedOption.feedback}
          capability={
            selectedOption.isCorrect ? readString(content.capability) : null
          }
          workedExample={
            !selectedOption.isCorrect && attempts >= 3 ? variant.worked : null
          }
        />
      ) : attempts > 0 ? (
        <Text className="happy-font-body mt-3 text-center text-[12.5px] leading-[18px] text-[#82796A]">
          {variant.clue}
        </Text>
      ) : null}
    </View>
  );
}

function getFeedbackTitle(correct: boolean, attempts: number): string {
  if (correct) return "Why it fits";
  if (attempts >= 3) return "Here’s the thinking";
  return attempts >= 2
    ? "Let’s make it simpler"
    : "A tempting model — not this one";
}

function readVariants(value: unknown): LeverScenario[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const variant = readRecord(item);
    const sceneLabel = readString(variant?.sceneLabel);
    const scene = readString(variant?.scene);
    const prompt = readString(variant?.prompt);
    const clue = readString(variant?.clue);
    const worked = readString(variant?.worked);
    return sceneLabel && scene && prompt && clue && worked
      ? [
          {
            sceneLabel,
            scene,
            prompt,
            clue,
            worked,
            options: readOptions(variant?.options),
          },
        ]
      : [];
  });
}

function readOptions(value: unknown): ScenarioOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const id = readString(option?.id);
    const label = readString(option?.label);
    const feedback = readString(option?.feedback);
    return id && label && feedback
      ? [{ id, label, feedback, isCorrect: option?.isCorrect === true }]
      : [];
  });
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LeverScenario,
    phase: "selection",
    variantIndex: 0,
    selectedOptionId: null,
    attempts: 0,
    isCorrect: false,
    ...extra,
  };
}
