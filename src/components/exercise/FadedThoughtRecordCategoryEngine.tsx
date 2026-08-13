import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import {
  readFadedThoughtRecordContent,
  type ThoughtRecordExample,
  type ThoughtRecordField,
} from "@/src/components/exercise/fadedThoughtRecordContent";
import {
  createFadedThoughtRecordResponse,
  getFadedThoughtRecordSelectedOption,
  getFadedThoughtRecordSteps,
  selectFadedThoughtRecordOption,
  type FadedThoughtRecordResponse,
  type FadedThoughtRecordStep,
} from "@/src/components/exercise/fadedThoughtRecordState";
import { hasSameFadedThoughtRecordResponse } from "@/src/components/exercise/fadedThoughtRecordResponse";
import { fadedThoughtRecordStyles as styles } from "@/src/components/exercise/fadedThoughtRecordStyles";
import {
  ActivePrompt,
  ChoiceTray,
  CompactHistory,
  ExerciseWorkspace,
  InlineFeedback,
  StageProgress,
} from "@/src/components/exercise/microlearning";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function FadedThoughtRecordCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = readFadedThoughtRecordContent(exercise.content);
  const saved = readRecord(savedResponse);
  const response = content ? createFadedThoughtRecordResponse(content, saved) : null;

  useEffect(() => {
    if (!content || !response || (saved && hasSameFadedThoughtRecordResponse(saved, response))) {
      return;
    }
    onInteraction(response, isFadedThoughtRecordFooterReady(response));
  }, [content, onInteraction, response, saved]);

  if (!content || !response) return null;
  const steps = getFadedThoughtRecordSteps(content);
  const currentStep = response.phase === "complete" ? null : steps[response.stageIndex];
  const example = currentStep?.example ?? content.examples[1];
  const selectedOption = getFadedThoughtRecordSelectedOption(content, response);
  const showCompletedExample = example.id === content.examples[1].id;

  const selectOption = (optionId: string) => {
    if (locked || response.phase !== "active" || !currentStep) return;
    const option = currentStep.task.options.find((item) => item.id === optionId);
    if (!option) return;
    if (option.isSupported) void Haptics.selectionAsync();
    const next = selectFadedThoughtRecordOption(content, response, option.id);
    onInteraction(next, isFadedThoughtRecordFooterReady(next));
  };

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading title={content.title} instruction={content.instruction} />
      <StageProgress stageIndex={response.stageIndex} stageCount={steps.length} label="Field" />
      <ExerciseWorkspace
        accessibilityLabel="Thought record notebook"
        transitionKey="faded-thought-record-notebook"
      >
        {showCompletedExample ? (
          <CompactHistory
            items={[{
              id: content.examples[0].id,
              label: content.examples[0].label,
              value: "Record completed",
            }]}
          />
        ) : null}
        <View style={styles.exampleHeader}>
          <Text style={styles.exampleLabel}>{example.label}</Text>
          <Text style={styles.context}>{example.context}</Text>
        </View>
        <View accessibilityLabel={`${example.label} notebook`} style={styles.notebook}>
          {content.fields.map((field) => (
            <ThoughtRecordFieldRow
              key={field.id}
              example={example}
              field={field}
              response={response}
            />
          ))}
          {response.phase === "complete" ? (
            <Text accessibilityLiveRegion="polite" style={styles.insight}>
              {content.completionInsight}
            </Text>
          ) : null}
        </View>
        {currentStep ? (
          <View style={styles.activeRegion}>
            <ActivePrompt prompt={currentStep.task.prompt} />
            {response.phase === "active" ? (
              <ChoiceTray
                choices={currentStep.task.options}
                disabled={locked}
                onSelect={selectOption}
              />
            ) : null}
            <InlineFeedback
              message={getFeedbackMessage(currentStep, selectedOption?.feedback, response)}
              title={response.phase === "feedback"
                ? response.isCorrect ? "Field complete" : "A clue"
                : undefined}
              tone={response.isCorrect ? "supported" : "neutral"}
            />
          </View>
        ) : null}
      </ExerciseWorkspace>
    </View>
  );
}

function ThoughtRecordFieldRow({
  example,
  field,
  response,
}: {
  example: ThoughtRecordExample;
  field: ThoughtRecordField;
  response: FadedThoughtRecordResponse;
}) {
  const value = getFieldValue(example, field.id, response);
  const active = response.phase !== "complete" && response.activeFieldId === field.id;
  const future = !value && !active && example.activeFieldOrder.includes(field.id);
  const displayValue = value ?? (future ? "Your turn next" : "Choose below");
  return (
    <View
      accessible
      accessibilityLabel={`${field.label}: ${displayValue}`}
      style={[styles.fieldRow, active && styles.activeField]}
    >
      <Text style={[styles.fieldLabel, active && styles.activeFieldLabel]}>
        {field.label}
      </Text>
      <Text style={[styles.fieldValue, (active || future) && styles.pendingValue]}>
        {displayValue}
      </Text>
    </View>
  );
}

function getFieldValue(
  example: ThoughtRecordExample,
  fieldId: string,
  response: FadedThoughtRecordResponse,
): string | null {
  const prefill = example.prefills.find((item) => item.fieldId === fieldId);
  if (prefill) return prefill.value;
  const optionId = response.answersByExampleId[example.id]?.[fieldId];
  const task = example.tasks.find((item) => item.fieldId === fieldId);
  return task?.options.find((option) => option.id === optionId)?.label ?? null;
}

function getFeedbackMessage(
  step: FadedThoughtRecordStep,
  feedback: string | undefined,
  response: FadedThoughtRecordResponse,
): string | null {
  if (response.phase !== "feedback" || !feedback) return null;
  return response.isCorrect ? feedback : `${feedback} ${step.task.clue}`;
}

export function isFadedThoughtRecordFooterReady(
  response: FadedThoughtRecordResponse,
): boolean {
  return response.phase === "feedback" || response.phase === "complete";
}
