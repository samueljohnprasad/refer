import React, { useEffect, useState } from "react";
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
  const targetCaption =
    readString(saved?.caption) ?? readString(content.initialCaption) ?? "";

  const choices = readChoices(content.choices);
  const reduceMotion = useReducedMotion();

  // Delay the caption cross-fade slightly after the marker starts moving
  const [displayCaption, setDisplayCaption] = useState(targetCaption);

  useEffect(() => {
    if (targetCaption !== displayCaption) {
      const timer = setTimeout(() => {
        if (!reduceMotion) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setDisplayCaption(targetCaption);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [targetCaption, displayCaption, reduceMotion]);

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
        duration: 350,
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
    <View className="w-full px-2 pb-4 pt-0 -mt-3">
      <CourseExerciseHeading
        title={readString(content.title) ?? "What gets the final vote?"}
        instruction={
          readString(content.instruction) ??
          "Try different ways of reading the alarm."
        }
      />

      {/* METER CARD - Visual Center */}
      <View className="z-10 rounded-[24px] border border-[#DCD3C4] bg-[#F9F4ED] px-5 py-4 shadow-sm shadow-black/5">
        <View className="flex-row justify-between gap-2">
          {/* Endpoint labels quieted to medium weight */}
          <Text className="happy-font-body max-w-[48%] text-[10px] leading-[14px] tracking-[0.5px] text-[#5F7F58] uppercase">
            {readString(content.leftLabel) ?? "FEELING AS PROOF"}
          </Text>
          <Text className="happy-font-body max-w-[48%] text-right text-[10px] leading-[14px] tracking-[0.5px] text-[#5F7F58] uppercase">
            {readString(content.rightLabel) ?? "CHECK THE WHOLE PICTURE"}
          </Text>
        </View>
        <View className="relative mt-4 h-6 justify-center">
          {/* Split track: warmer neutral left, subtle sage right */}
          <View className="h-[7px] w-full flex-row overflow-hidden rounded-full">
            <View className="flex-1 bg-[#E7E0D4]" />
            <View className="flex-1 bg-[#DCE5D8]" />
          </View>
          {/* Non-draggable looking reasoning continuum marker */}
          <View
            className="absolute h-4 w-1.5 rounded-full bg-[#29452A] shadow-sm shadow-black/20"
            style={{ left: `${position}%`, transform: [{ translateX: -3 }] }}
          />
        </View>
        {/* Caption Contrast fixed & un-bolded */}
        <Text className="happy-font-body mt-3 text-[14px] leading-[20px] text-[#29452A]">
          {displayCaption}
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
              style={{ opacity: isUnselectedInCompleteState ? 0.65 : 1 }}
              className={`min-h-[44px] justify-center rounded-[20px] border px-4 py-2 active:bg-[#F2F8EF] ${
                isSelected
                  ? "border-[#ABC0A2] bg-[#F2F8EF]"
                  : "border-[#DCD3C4] bg-white"
              }`}
            >
              {/* Text weight softened to medium/regular */}
              <Text
                className={`happy-font-body text-[14px] leading-[20px] ${
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
        <View className="mt-4 rounded-[22px] bg-[#F2F8EF] p-4">
          <Text className="happy-font-heading text-[16px] leading-[22px] text-[#29452A] mb-1.5">
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
