import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

type LanguageMode = "identity" | "situation";

interface LanguageCard {
  identityText: string;
  situationText: string;
  identityWhy: string;
  situationWhy: string;
}

export function SituationLanguageCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const cards = readCards(content.cards);
  const modes = readModes(saved?.modes);
  const complete = modes[1] === "situation";

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const setMode = (cardIndex: number, mode: LanguageMode) => {
    if (locked) return;
    Haptics.selectionAsync();
    const nextModes = [...modes];
    nextModes[cardIndex] = mode;
    onInteraction(
      createResponse({ ...saved, modes: nextModes }),
      nextModes[1] === "situation",
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Same day. Two sentences."}
        instruction={readString(content.instruction) ?? "Flip each switch."}
      />

      <View className="gap-3">
        {cards.map((card, index) => {
          const mode = modes[index] ?? "identity";
          const situation = mode === "situation";
          return (
            <View
              key={card.identityText}
              className="items-center rounded-[24px] bg-[#F9F4ED] px-4 py-[18px] shadow-sm shadow-black/10"
            >
              <Text
                className={
                  situation
                    ? "happy-font-heading-bold min-h-[50px] text-center text-lg leading-[25px] text-[#29452A]"
                    : "happy-font-heading-bold min-h-[50px] text-center text-lg leading-[25px] text-[#29452A]"
                }
              >
                {situation ? card.situationText : card.identityText}
              </Text>

              <View className="my-2 flex-row overflow-hidden rounded-full border-[1.5px] border-[#DCD3C4]">
                <Segment
                  label="identity"
                  selected={!situation}
                  onPress={() => setMode(index, "identity")}
                />
                <Segment
                  label="situation"
                  selected={situation}
                  onPress={() => setMode(index, "situation")}
                />
              </View>

              <Text className="happy-font-body min-h-[38px] w-full text-left text-[12.5px] leading-[19px] text-[#3F3A34]">
                {modes[index] == null && index === 1
                  ? "Now flip this one yourself."
                  : situation
                    ? card.situationWhy
                    : card.identityWhy}
              </Text>
            </View>
          );
        })}
      </View>

      {complete ? (
        <View className="mt-3 rounded-[20px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-4 py-[14px]">
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

function Segment({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={
        selected
          ? "min-h-[38px] justify-center bg-[#5F7F58] px-4"
          : "min-h-[38px] justify-center bg-transparent px-4"
      }
    >
      <Text
        className={
          selected
            ? "happy-font-body-bold text-[12.5px] text-white"
            : "happy-font-body-bold text-[12.5px] text-[#82796A]"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

function readCards(value: unknown): LanguageCard[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const card = readRecord(item);
    const identityText = readString(card?.identityText);
    const situationText = readString(card?.situationText);
    const identityWhy = readString(card?.identityWhy);
    const situationWhy = readString(card?.situationWhy);
    return identityText && situationText && identityWhy && situationWhy
      ? [{ identityText, situationText, identityWhy, situationWhy }]
      : [];
  });
}

function readModes(value: unknown): LanguageMode[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (item === "situation" ? "situation" : "identity"));
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SituationLanguage,
    phase: "language",
    modes: [],
    isCorrect: true,
    ...extra,
  };
}
