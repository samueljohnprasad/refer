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

interface ScenarioOption {
  id: string;
  label: string;
}

export function ScenarioCategoryEngine({
  exercise,
  savedResponse,
  supportLevel,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const selectedSituationId = readString(saved?.selectedSituationId);
  const selectedReasonId = readString(saved?.selectedReasonId);
  const situationOptions = readOptions(content.situationOptions);
  const reasonOptions = readOptions(content.reasonOptions);
  const easierOptionIds = readStringArray(content.easierOptionIds);
  const visibleSituationOptions =
    supportLevel === V1SupportLevelEnum.Easier ||
    supportLevel === V1SupportLevelEnum.Worked
      ? situationOptions.filter((option) =>
          shouldShowEasierOption(option.id, easierOptionIds, selectedSituationId),
        )
      : situationOptions;
  const visibleReasonOptions =
    supportLevel === V1SupportLevelEnum.Easier ||
    supportLevel === V1SupportLevelEnum.Worked
      ? reasonOptions.filter((option) =>
          shouldShowEasierOption(option.id, easierOptionIds, selectedReasonId),
        )
      : reasonOptions;
  const correctSituationId = readString(content.correctSituationId);
  const correctReasonId = readString(content.correctReasonId);
  const selectedSituation = situationOptions.find(
    (option) => option.id === selectedSituationId,
  );
  const showingReasonStep = Boolean(selectedSituationId);

  const emit = (nextSituationId: string | null, nextReasonId: string | null) => {
    onInteraction(
      {
        format: V1LearningFormatEnum.ScenarioWhy,
        responseMode: V1ResponseModeEnum.Choice,
        selectedSituationId: nextSituationId,
        selectedReasonId: nextReasonId,
        supportLevel,
        isCorrect:
          nextSituationId === correctSituationId &&
          nextReasonId === correctReasonId,
      },
      Boolean(nextSituationId && nextReasonId),
    );
  };

  const chooseSituation = (id: string) => {
    if (locked) {
      return;
    }
    emit(id, selectedReasonId);
  };

  const chooseReason = (id: string) => {
    if (locked) {
      return;
    }
    emit(selectedSituationId, id);
  };

  return (
    <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
      <Text variant="h2" color="ink" className="mb-2">
        {readString(content.title) ?? "Try a new situation"}
      </Text>
      {!showingReasonStep ? (
        <Text variant="body" color="ink" className="mb-5">
          {readString(content.prompt) ?? "Choose what fits best."}
        </Text>
      ) : null}
      {supportLevel === V1SupportLevelEnum.Easier ? (
        <Text variant="caption" color="soft" className="mb-4">
          Look for the option that says this can be a normal sleep pattern.
        </Text>
      ) : null}

      {showingReasonStep ? (
        <>
          {selectedSituation ? (
            <View className="mb-5 rounded-xl border border-sage-200 bg-sage-50 px-3 py-2">
              <Text variant="label-bold" color="ink">
                {selectedSituation.label}
              </Text>
            </View>
          ) : null}

          <Text variant="label-bold" color="ink" className="mb-3">
            Why?
          </Text>
          <View className="gap-3 pb-12">
            {visibleReasonOptions.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                isSelected={selectedReasonId === option.id}
                alignText="left"
                disabled={locked}
                onPress={() => chooseReason(option.id)}
              />
            ))}
          </View>
        </>
      ) : (
        <>
          <Text variant="label-bold" color="ink" className="mb-3">
            What is happening here?
          </Text>
          <View className="gap-3 pb-12">
            {visibleSituationOptions.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                isSelected={selectedSituationId === option.id}
                alignText="left"
                disabled={locked}
                onPress={() => chooseSituation(option.id)}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function readOptions(value: unknown): ScenarioOption[] {
  return Array.isArray(value)
    ? value
        .map((option) => readRecord(option))
        .filter((option): option is Record<string, unknown> => Boolean(option))
        .map((option) => ({
          id: readString(option.id) ?? "",
          label: readString(option.label) ?? readString(option.text) ?? "",
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

function shouldShowEasierOption(
  optionId: string,
  easierOptionIds: string[],
  selectedOptionId: string | null,
): boolean {
  return (
    easierOptionIds.length === 0 ||
    easierOptionIds.includes(optionId) ||
    optionId === selectedOptionId
  );
}
