import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  V1LearningFormatEnum,
  V1ResponseModeEnum,
} from "@/src/types/journeyLearning";

interface RecallChip {
  id: string;
  text: string;
}

export function RecallCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const chips = readChips(content.chips);
  const savedChipIds = readStringArray(
    readRecord(savedResponse)?.selectedChipIds,
  );
  const selectedChipIds = savedChipIds;
  const prompt = readString(content.prompt) ?? "Build the answer.";
  const answerChipIds = readStringArray(content.answerChipIds);

  const selectedChips = useMemo(
    () =>
      selectedChipIds
        .map((chipId) => chips.find((chip) => chip.id === chipId))
        .filter((chip): chip is RecallChip => Boolean(chip)),
    [chips, selectedChipIds],
  );

  const toggleChip = (chip: RecallChip) => {
    if (locked) {
      return;
    }

    const nextIds = selectedChipIds.includes(chip.id)
      ? selectedChipIds.filter((chipId) => chipId !== chip.id)
      : [...selectedChipIds, chip.id];

    onInteraction(
      {
        format: V1LearningFormatEnum.GuidedRecall,
        responseMode: V1ResponseModeEnum.WordBank,
        selectedChipIds: nextIds,
        isCorrect: sameOrderedIds(nextIds, answerChipIds),
      },
      nextIds.length > 0,
    );
  };

  return (
    <View className="px-6 pt-8">
      <Text variant="h2" color="ink" className="mb-3">
        {readString(exercise.content?.title) ?? "Practise the idea"}
      </Text>
      <Text variant="body" color="ink" className="mb-6">
        {prompt}
      </Text>
      <View
        className="min-h-[96px] rounded-2xl border px-4 py-4 mb-6"
        style={{ backgroundColor: SEMANTIC_COLORS.surface.primary, borderColor: SEMANTIC_COLORS.border.default }}
      >
        {selectedChips.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {selectedChips.map((chip) => (
              <Chip
                key={chip.id}
                label={chip.text}
                selected
                disabled={locked}
                onPress={() => toggleChip(chip)}
              />
            ))}
          </View>
        ) : (
          <Text variant="body" color="muted">
            Tap words below to build your answer.
          </Text>
        )}
      </View>

      <View
        className={`flex-row flex-wrap gap-2 ${locked ? "pb-5" : "pb-12"}`}
      >
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.text}
            selected={selectedChipIds.includes(chip.id)}
            disabled={locked}
            onPress={() => toggleChip(chip)}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      className="rounded-full px-4 py-3"
      style={{
        backgroundColor: selected ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.surface.primary,
        borderColor: selected ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
        borderWidth: 1,
      }}
    >
      <Text variant="label-bold" style={{ color: selected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.text.primary }}>
        {label}
      </Text>
    </Pressable>
  );
}

function readChips(value: unknown): RecallChip[] {
  return Array.isArray(value)
    ? value
        .map((chip) => readRecord(chip))
        .filter((chip): chip is Record<string, unknown> => Boolean(chip))
        .map((chip) => ({
          id: readString(chip.id) ?? "",
          text: readString(chip.text) ?? "",
        }))
        .filter((chip) => chip.id && chip.text)
    : [];
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function sameOrderedIds(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}
