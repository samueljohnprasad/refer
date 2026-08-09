import React from "react";
import { View } from "react-native";
import { OptionButton } from "@/src/components/ui/OptionButton";
import { Text } from "@/src/components/ui/Text";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  V1LearningFormatEnum,
  V1ResponseModeEnum,
} from "@/src/types/journeyLearning";

interface DiscriminationOption {
  id: string;
  label: string;
  misconceptionCode?: string;
}

export function DiscriminationCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const selectedOptionId = readString(saved?.selectedOptionId);
  const options = readOptions(content.options);
  const acceptAnyOption = content.acceptAnyOption === true;
  const correctOptionId = readString(content.correctOptionId);

  const chooseOption = (option: DiscriminationOption) => {
    if (locked) {
      return;
    }

    onInteraction(
      {
        format: V1LearningFormatEnum.CloseDiscrimination,
        responseMode: V1ResponseModeEnum.Choice,
        selectedOptionId: option.id,
        misconceptionCode: option.misconceptionCode,
        isCorrect: acceptAnyOption || option.id === correctOptionId,
      },
      true,
    );
  };

  return (
    <View className="px-6 pt-8">
      <Text variant="h2" color="ink" className="mb-3">
        {readString(content.title) ?? "Choose the closest match"}
      </Text>
      <Text variant="body" color="ink" className="mb-6">
        {readString(content.prompt) ?? "Pick the idea that fits best."}
      </Text>
      <View className={`gap-3 ${locked ? "pb-5" : "pb-12"}`}>
        {options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            isSelected={selectedOptionId === option.id}
            alignText="left"
            disabled={locked}
            onPress={() => chooseOption(option)}
          />
        ))}
      </View>
    </View>
  );
}

function readOptions(value: unknown): DiscriminationOption[] {
  return Array.isArray(value)
    ? value
        .map((option) => readRecord(option))
        .filter((option): option is Record<string, unknown> => Boolean(option))
        .map((option) => ({
          id: readString(option.id) ?? "",
          label: readString(option.label) ?? readString(option.text) ?? "",
          misconceptionCode: readString(option.misconceptionCode) ?? undefined,
        }))
        .filter((option) => option.id && option.label)
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
