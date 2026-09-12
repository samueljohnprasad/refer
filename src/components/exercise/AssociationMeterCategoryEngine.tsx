import React, { useEffect } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

interface AssociationChoice {
  id: string;
  label: string;
  targetPosition: number;
  caption: string;
  completesExercise: boolean;
}

export function AssociationMeterCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const position =
    readNumber(saved?.position) ?? readNumber(content.initialPosition) ?? 50;
  const phase = readString(saved?.phase) ?? "exploring";
  const selectedChoiceId = readString(saved?.selectedChoiceId);
  const isComplete = phase === "complete";
  const caption =
    readString(saved?.caption) ?? readString(content.initialCaption) ?? "";
  const choices = readChoices(content.choices);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.AssociationMeter,
          phase: "exploring",
          position: readNumber(content.initialPosition) ?? 50,
          caption: null,
          selectedChoiceId: null,
        },
        false,
      );
    }
  }, [onInteraction, saved, content.initialPosition]);

  const selectChoice = (choice: AssociationChoice) => {
    if (locked) return;
    Haptics.selectionAsync();

    // Animation approximately 300-450ms smooth
    if (!reduceMotion) {
      LayoutAnimation.configureNext({
        duration: 400,
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      });
    }

    const nextPhase = choice.completesExercise ? "complete" : "exploring";

    onInteraction(
      {
        format: CourseExerciseCategoryEnum.AssociationMeter,
        phase: nextPhase,
        position: choice.targetPosition,
        caption: choice.caption,
        selectedChoiceId: choice.id,
      },
      choice.completesExercise,
    );
  };

  return (
    <View className="px-2 pb-6 pt-1.5 flex-1">
      <CourseExerciseHeading
        title={readString(content.title) ?? "What gets the final vote?"}
        instruction={
          readString(content.instruction) ??
          "Try different ways of reading the alarm."
        }
      />

      {/* METER CARD - Visual Center */}
      <View className="rounded-[26px] border border-cream-300 bg-cream-50 px-5 py-5 shadow-sm shadow-black/5 z-10">
        <View className="flex-row justify-between gap-4">
          <Text className="font-semibold max-w-[45%] text-[11px] leading-4 tracking-wider text-forest-700">
            {readString(content.leftLabel) ?? "FEELING AS PROOF"}
          </Text>
          <Text className="font-semibold max-w-[45%] text-right text-[11px] leading-4 tracking-wider text-forest-700">
            {readString(content.rightLabel) ?? "CHECK THE WHOLE PICTURE"}
          </Text>
        </View>
        <View className="relative mt-5 h-6 justify-center">
          <View className="h-[7px] overflow-hidden rounded-full bg-cream-300">
            {/* The fill is intentionally removed or muted if we don't want a "progress" look, 
                but keeping a subtle tracking line. Let's just use a solid track. */}
          </View>
          {/* Non-draggable looking reasoning continuum marker */}
          <View
            className="absolute h-4 w-1.5 rounded-full bg-forest-700 shadow-sm shadow-black/20"
            style={{ left: `${position}%`, transform: [{ translateX: -3 }] }}
          />
        </View>
        {/* Caption Contrast increased */}
        <Text className="font-medium mt-4 text-[13.5px] leading-5 text-ink-primary">
          {caption}
        </Text>
      </View>

      {/* WAYS TO READ IT */}
      <View className="mt-3 gap-2">
        {choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          const isUnselectedInCompleteState = isComplete && !isSelected;

          return (
            <Pressable
              key={choice.id}
              accessibilityRole="button"
              disabled={locked}
              onPress={() => selectChoice(choice)}
              style={{ opacity: isUnselectedInCompleteState ? 0.4 : 1 }}
              className={`min-h-[52px] justify-center rounded-[20px] border px-4 py-3 active:bg-cream-100 ${
                isSelected
                  ? "border-sage-400 bg-sage-50"
                  : "border-cream-300 bg-white"
              }`}
            >
              <Text
                className={`font-medium text-[13.5px] leading-[19px] ${
                  isSelected ? "text-forest-900" : "text-ink-primary"
                }`}
              >
                {choice.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* FINAL RULE */}
      {isComplete ? (
        <View className="mt-4 rounded-[22px] bg-[#f8fbf6] p-5">
          <Text className="font-bold text-lg leading-6 text-forest-900 mb-2">
            {readString(content.rule)}
          </Text>
          <Text className="text-[14px] leading-[22px] text-forest-800">
            {readString(content.takeaway)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function readChoices(value: unknown): AssociationChoice[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const choice = readRecord(item);
    const label = readString(choice?.label);
    const targetPosition = readNumber(choice?.targetPosition);
    const caption = readString(choice?.caption);
    const completesExercise = choice?.completesExercise === true;
    const id = readString(choice?.id) ?? `choice-${index}`;
    return label && targetPosition !== null && caption
      ? [
          {
            id,
            label,
            targetPosition,
            caption,
            completesExercise: !!completesExercise,
          },
        ]
      : [];
  });
}
