import React from "react";
import { ScrollView, View } from "react-native";
import { OptionButton } from "@/src/components/ui/OptionButton";
import { Text } from "@/src/components/ui/Text";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  V1LearningFormatEnum,
  V1ResponseModeEnum,
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";

interface DiscriminationOption {
  id: string;
  label: string;
  misconceptionCode?: string;
}

export function DiscriminationCategoryEngine({
  exercise,
  savedResponse,
  supportLevel,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const selectedOptionId = readString(saved?.selectedOptionId);
  const options = readOptions(content.options);
  const easierOptionIds = readStringArray(content.easierOptionIds);
  const acceptAnyOption = content.acceptAnyOption === true;
  const visibleOptions =
    supportLevel === V1SupportLevelEnum.Easier ||
    supportLevel === V1SupportLevelEnum.Worked
      ? options.filter(
          (option) =>
            easierOptionIds.length === 0 ||
            easierOptionIds.includes(option.id) ||
            option.id === selectedOptionId,
        )
      : options;
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
        supportLevel,
        isCorrect: acceptAnyOption || option.id === correctOptionId,
      },
      true,
    );
  };

  return (
    <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
      <Text variant="h2" color="ink" className="mb-3">
        {readString(content.title) ?? "Choose the closest match"}
      </Text>
      <Text variant="body" color="ink" className="mb-6">
        {readString(content.prompt) ?? "Pick the idea that fits best."}
      </Text>
      {supportLevel === V1SupportLevelEnum.Easier ? (
        <Text variant="caption" color="soft" className="mb-4">
          Body repair belongs with deep sleep.
        </Text>
      ) : null}

      <View className="gap-3 pb-12">
        {visibleOptions.map((option) => (
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
    </ScrollView>
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

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
