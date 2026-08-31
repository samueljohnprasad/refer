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
  const visibleOptions = variant?.options ?? [];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const selectOption = (option: ScenarioOption) => {
    if (locked || showingFeedback) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        phase: "feedback",
        selectedOptionId: option.id,
        isCorrect: option.isCorrect,
        attempts: option.isCorrect ? attempts : attempts + 1,
      }),
      true,
    );
  };

  if (!variant) return null;

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Put it to work"}
        instruction={
          readString(content.instruction) ?? "Pick what would actually help."
        }
      />

      <View className="mb-6 rounded-[24px] bg-brand-surface-soft p-5 border-2 border-border-default">
        <Text className="happy-font-body-bold text-[13px] text-brand-primary uppercase tracking-[1px] opacity-80 mb-2">
          {variant.sceneLabel}
        </Text>
        <Text className="happy-font-body text-[16px] leading-[24px] text-text-primary">
          {variant.scene}
        </Text>
      </View>

      <Text className="happy-font-body-bold mb-2.5 text-[16px] leading-[22px] text-[#201E1D]">
        {variant.prompt}
      </Text>
      <View className="gap-2.5">
        {visibleOptions.map((option) => {
          const selected = selectedOptionId === option.id;
          const selectedCorrect = selected && option.isCorrect;
          const selectedIncorrect = selected && !option.isCorrect;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: showingFeedback }}
              disabled={locked || showingFeedback}
              onPress={() => selectOption(option)}
              className={
                selectedCorrect
                  ? "min-h-[60px] flex-row items-center gap-3 rounded-[22px] border-2 border-selection-border border-b-[4px] bg-selection-surface px-5 py-3"
                  : selectedIncorrect
                    ? "min-h-[60px] flex-row items-center gap-3 rounded-[22px] border-2 border-error-border border-b-[4px] bg-error-surface px-5 py-3"
                  : showingFeedback
                    ? "min-h-[60px] flex-row items-center gap-3 rounded-[22px] border-2 border-border-default border-b-[4px] bg-surface-primary px-5 py-3"
                    : "min-h-[60px] flex-row items-center gap-3 rounded-[22px] border-2 border-border-default border-b-[4px] bg-surface-primary px-5 py-3 active:translate-y-[2px] active:border-b-2"
              }
            >
              <View
                className={
                  selectedCorrect
                    ? "h-5 w-5 items-center justify-center rounded-full border-2 border-[#5F7F58] bg-[#5F7F58]"
                    : selectedIncorrect
                      ? "h-5 w-5 items-center justify-center rounded-full border-2 border-[#A84432] bg-[#A84432]"
                    : "h-5 w-5 rounded-full border-2 border-[#B6AB9B]"
                }
              >
                {selected ? (
                  <Text className="happy-font-body-bold text-[11px] text-white">
                    {option.isCorrect ? "✓" : "✕"}
                  </Text>
                ) : null}
              </View>
              <Text className={`happy-font-body-bold flex-1 text-[13.5px] leading-[19px] ${
                selectedCorrect ? "text-selection-foreground" : selectedIncorrect ? "text-error-foreground" : showingFeedback ? "text-text-secondary" : "text-text-primary"
              }`}>
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
  return "Not quite";
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
