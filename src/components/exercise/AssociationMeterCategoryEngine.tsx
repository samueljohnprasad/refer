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
    <View className="flex-1 px-2 pb-6 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "What gets the final vote?"}
        instruction={
          readString(content.instruction) ??
          "Try different ways of reading the alarm."
        }
      />

      {/* METER CARD - Visual Center */}
      <View className="z-10 rounded-[26px] border border-[#DCD3C4] bg-[#F9F4ED] px-5 py-5 shadow-sm shadow-black/5">
        <View className="flex-row justify-between gap-4">
          <Text className="happy-font-body-bold max-w-[45%] text-[11px] leading-4 tracking-wider text-[#29452A]">
            {readString(content.leftLabel) ?? "FEELING AS PROOF"}
          </Text>
          <Text className="happy-font-body-bold max-w-[45%] text-right text-[11px] leading-4 tracking-wider text-[#29452A]">
            {readString(content.rightLabel) ?? "CHECK THE WHOLE PICTURE"}
          </Text>
        </View>
        <View className="relative mt-5 h-6 justify-center">
          <View className="h-[7px] overflow-hidden rounded-full bg-[#E7E0D4]" />
          {/* Non-draggable looking reasoning continuum marker */}
          <View
            className="absolute h-4 w-1.5 rounded-full bg-[#29452A] shadow-sm shadow-black/20"
            style={{ left: `${position}%`, transform: [{ translateX: -3 }] }}
          />
        </View>
        <Text className="happy-font-body-bold mt-4 text-[13.5px] leading-5 text-[#201E1D]">
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
              className={`min-h-[52px] justify-center rounded-[20px] border px-4 py-3 active:bg-[#F2F8EF] ${
                isSelected
                  ? "border-[#ABC0A2] bg-[#F2F8EF]"
                  : "border-[#DCD3C4] bg-white"
              }`}
            >
              <Text
                className={`happy-font-body-bold text-[13.5px] leading-[19px] ${
                  isSelected ? "text-[#29452A]" : "text-[#201E1D]"
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
        <View className="mt-4 rounded-[22px] bg-[#F2F8EF] p-5">
          <Text className="happy-font-heading-bold text-lg leading-6 text-[#29452A] mb-2">
            {readString(content.rule)}
          </Text>
          <Text className="happy-font-body text-[14px] leading-[22px] text-[#3F4A31]">
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
