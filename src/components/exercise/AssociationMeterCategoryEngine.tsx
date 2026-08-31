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
  label: string;
  delta: number;
  caption: string;
}

export function AssociationMeterCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const position = readNumber(saved?.position) ?? 50;
  const hasFlipped = saved?.hasFlipped === true;
  const caption =
    readString(saved?.caption) ?? readString(content.initialCaption) ?? "";
  const choices = readChoices(content.choices);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const runEvenings = (choice: AssociationChoice) => {
    if (locked) return;
    Haptics.selectionAsync();
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    const nextPosition = Math.min(95, Math.max(5, position + choice.delta));
    const nextFlipped = hasFlipped || nextPosition >= 70;
    onInteraction(
      createResponse({
        ...saved,
        position: nextPosition,
        caption: choice.caption,
        hasFlipped: nextFlipped,
      }),
      nextFlipped,
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "What is the phone for at 11pm?"}
        instruction={readString(content.instruction) ?? "Run a few evenings."}
      />

      <View className="rounded-[26px] border border-[#E4DACB] bg-[#F9F4ED] px-5 py-5 shadow-sm shadow-black/10">
        <View className="flex-row justify-between gap-4">
          <Text className="happy-font-body-bold max-w-[45%] text-[11.5px] leading-4 text-[#29452A]">
            {readString(content.leftLabel)}
          </Text>
          <Text className="happy-font-body-bold max-w-[45%] text-right text-[11.5px] leading-4 text-[#29452A]">
            {readString(content.rightLabel)}
          </Text>
        </View>
        <View className="relative mt-5 h-6 justify-center">
          <View className="h-[7px] overflow-hidden rounded-full bg-[#E7E0D4]">
            <View
              className="h-full rounded-full bg-[#5F7F58]"
              style={{ width: `${position}%` }}
            />
          </View>
          <View
            className="absolute h-[22px] w-[22px] rounded-full border-[3px] border-[#F9F4ED] bg-[#5F7F58] shadow-sm shadow-black/20"
            style={{ left: `${position}%`, transform: [{ translateX: -11 }] }}
          />
        </View>
        <Text className="happy-font-body mt-3 text-[12.5px] leading-[18px] text-[#82796A]">
          {caption}
        </Text>
      </View>

      <View className="mt-3 gap-2.5">
        {choices.map((choice) => (
          <Pressable
            key={choice.label}
            accessibilityRole="button"
            disabled={locked}
            onPress={() => runEvenings(choice)}
            className="min-h-[58px] justify-center rounded-[22px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-3 active:translate-y-0.5 active:border-b-[1.5px]"
          >
            <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#201E1D]">
              {choice.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {hasFlipped ? (
        <View className="mt-3 rounded-[22px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] p-4">
          <Text className="happy-font-heading-bold text-lg leading-[22px] text-[#3F4A31]">
            {readString(content.rule)}
          </Text>
          <Text className="happy-font-body mt-1.5 text-[13.5px] leading-5 text-[#3F4A31]">
            {readString(content.takeaway)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function readChoices(value: unknown): AssociationChoice[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const choice = readRecord(item);
    const label = readString(choice?.label);
    const delta = readNumber(choice?.delta);
    const caption = readString(choice?.caption);
    return label && delta !== null && caption
      ? [{ label, delta, caption }]
      : [];
  });
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.AssociationMeter,
    phase: "association",
    position: 50,
    caption: null,
    hasFlipped: false,
    isCorrect: true,
    ...extra,
  };
}
