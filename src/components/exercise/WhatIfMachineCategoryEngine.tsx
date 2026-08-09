import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  readCourseExerciseOptions,
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { whatIfMachineStyles as styles } from "@/src/components/exercise/whatIfMachineStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const STEP_DELAY_MS = 500;

export function WhatIfMachineCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const options = readCourseExerciseOptions(content.options);
  const steps = readStringArray(content.steps);
  const selectedOptionId = readString(saved?.selectedOptionId);
  const visibleStepCount = readNumber(saved?.visibleStepCount) ?? 0;
  const running = saved?.running === true;
  const complete = running && visibleStepCount >= steps.length;
  const selectedLabel = options.find(
    (option) => option.id === selectedOptionId,
  )?.label;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  useEffect(() => {
    if (!running || complete) return;
    const timer = setTimeout(() => {
      const nextCount = visibleStepCount + 1;
      onInteraction(
        createResponse({
          ...saved,
          running: true,
          visibleStepCount: nextCount,
        }),
        nextCount >= steps.length,
      );
    }, STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [complete, onInteraction, running, saved, steps.length, visibleStepCount]);

  const chooseOption = (optionId: string) => {
    if (locked || running) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({ ...saved, selectedOptionId: optionId }),
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "What if?"}
        instruction={readString(content.instruction) ?? "Predict, then run it."}
      />

      {!running ? (
        <View style={styles.prediction}>
          {options.map((option) => (
            <CourseExerciseOptionButton
              key={option.id}
              label={option.label}
              selected={selectedOptionId === option.id}
              align="center"
              showConfirmationIcon={false}
              disabled={locked}
              onPress={() => chooseOption(option.id)}
            />
          ))}
          <Text style={styles.helper}>
            Being surprised is what makes the answer stick.
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.betRow}>
            <Text style={styles.betLabel}>YOUR BET</Text>
            <View style={styles.betPill}>
              <Text style={styles.betText}>{selectedLabel}</Text>
            </View>
          </View>
          <View style={styles.stepList}>
            {steps.slice(0, visibleStepCount).map((step, index) => (
              <View key={`${index}-${step}`} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberLabel}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          {complete ? (
            <View style={styles.revealCard}>
              <Text style={styles.rule}>{readString(content.rule)}</Text>
              <Text style={styles.takeaway}>
                {readString(content.takeaway)}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WhatIfMachine,
    phase: "experiment",
    selectedOptionId: null,
    running: false,
    visibleStepCount: 0,
    isCorrect: true,
    ...extra,
  };
}
