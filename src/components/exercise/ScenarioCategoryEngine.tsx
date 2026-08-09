import React from "react";
import { View } from "react-native";
import { OptionButton } from "@/src/components/ui/OptionButton";
import { Text } from "@/src/components/ui/Text";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  V1LearningFormatEnum,
  V1ResponseModeEnum,
} from "@/src/types/journeyLearning";

interface ScenarioOption {
  id: string;
  label: string;
}

export function ScenarioCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const selectedSituationId = readString(saved?.selectedSituationId);
  const selectedReasonId = readString(saved?.selectedReasonId);
  const situationOptions = readOptions(content.situationOptions);
  const reasonOptions = readOptions(content.reasonOptions);
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
    <View className="px-6 pt-6">
      <Text variant="h2" color="ink" className="mb-2">
        {readString(content.title) ?? "Try a new situation"}
      </Text>
      {!showingReasonStep ? (
        <Text variant="body" color="ink" className="mb-5">
          {readString(content.prompt) ?? "Choose what fits best."}
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
          <View className={`gap-3 ${locked ? "pb-5" : "pb-12"}`}>
            {reasonOptions.map((option) => (
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
          <View className={`gap-3 ${locked ? "pb-5" : "pb-12"}`}>
            {situationOptions.map((option) => (
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
    </View>
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
