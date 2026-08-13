import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { ExplorableModelControl } from "@/src/components/exercise/ExplorableModelControl";
import { MayaAlarmChart } from "@/src/components/exercise/MayaAlarmChart";
import { readExplorableModelContent } from "@/src/components/exercise/explorableModelContent";
import {
  createExplorableModelResponse,
  getExplorableBaselineValues,
  getExplorableControlValueLabel,
  hasSameExplorableModelResponse,
  openExplorableSandbox,
  resetExplorableSandbox,
  settleExplorableControl,
  type ExplorableModelResponse,
} from "@/src/components/exercise/explorableModelState";
import { explorableModelStyles as styles } from "@/src/components/exercise/explorableModelStyles";
import { getMayaAlarmDeltaText } from "@/src/components/exercise/mayaAlarmModel";
import {
  ActivePrompt,
  CompactHistory,
  ExerciseWorkspace,
  StageProgress,
} from "@/src/components/exercise/microlearning";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function ExplorableModelCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = readExplorableModelContent(exercise.content);
  const saved = readRecord(savedResponse);
  const response = content ? createExplorableModelResponse(content, saved) : null;
  const [sliderDraft, setSliderDraft] = useState<number | null>(null);

  useEffect(() => {
    if (!content || !response || (saved && hasSameExplorableModelResponse(saved, response))) return;
    onInteraction(response, isExplorableFooterReady(response));
  }, [content, onInteraction, response, saved]);

  useEffect(() => {
    setSliderDraft(null);
  }, [response?.sandboxOpen, response?.stageIndex]);

  if (!content || !response) return null;

  const visibleValues = sliderDraft === null
    ? response.values
    : { ...response.values, load: sliderDraft };
  const baselineValues = getExplorableBaselineValues(content, response);
  const deltaText = getMayaAlarmDeltaText(baselineValues, visibleValues);
  const currentStage = content.stages[response.stageIndex];
  const summaryCount = response.phase === "complete"
    ? content.stages.length
    : response.stageIndex;
  const summaries = content.stages.slice(0, summaryCount).map((stage) => ({
    id: stage.id,
    label: stage.summaryLabel,
    value: getExplorableControlValueLabel(stage.control, response.values),
  }));

  const settle = (stageId: string, value: number | boolean) => {
    if (locked) return;
    setSliderDraft(null);
    const next = settleExplorableControl(content, response, stageId, value);
    if (next === response) return;
    void Haptics.selectionAsync();
    onInteraction(next, isExplorableFooterReady(next));
  };

  const renderControl = (stage: (typeof content.stages)[number]) => (
    <ExplorableModelControl
      key={stage.id}
      control={stage.control}
      disabled={locked}
      value={visibleValues[stage.control.input]}
      onSliderDraft={setSliderDraft}
      onSliderSettle={(value) => settle(stage.id, value)}
      onToggle={() => settle(stage.id, !response.values[stage.control.input])}
    />
  );

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading title={content.title} instruction={content.instruction} />
      <StageProgress
        stageIndex={response.stageIndex}
        stageCount={content.stages.length}
        label="Lever"
      />
      <ExerciseWorkspace transitionKey="maya-alarm-model">
        <Text style={styles.setup}>{content.setup}</Text>
        <CompactHistory items={summaries} />
        <View style={styles.chart}>
          <MayaAlarmChart
            accessibilityLabel={content.chartAccessibilityLabel}
            {...visibleValues}
          />
        </View>
        <View
          accessible
          accessibilityLiveRegion="polite"
          style={styles.delta}
        >
          <Text style={styles.deltaText}>{deltaText}</Text>
        </View>
        {response.phase === "complete" ? (
          response.sandboxOpen ? (
            <View style={styles.sandbox}>
              <ActivePrompt context="Optional sandbox" prompt={content.sandboxPrompt} />
              <View style={styles.sandboxControls}>
                {content.stages.map(renderControl)}
              </View>
              <Pressable
                accessibilityRole="button"
                disabled={locked}
                onPress={() => {
                  setSliderDraft(null);
                  onInteraction(resetExplorableSandbox(content, response), true);
                }}
                style={({ pressed }) => [styles.reset, pressed && styles.pressed]}
              >
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
            </View>
          ) : (
            <View accessibilityLiveRegion="polite" style={styles.complete}>
              <Text style={styles.completeText}>You tested every lever.</Text>
              <Pressable
                accessibilityRole="button"
                disabled={locked}
                onPress={() => onInteraction(openExplorableSandbox(response), true)}
                style={({ pressed }) => [styles.inlineAction, pressed && styles.pressed]}
              >
                <Text style={styles.inlineActionText}>Explore freely</Text>
              </Pressable>
            </View>
          )
        ) : currentStage ? (
          <>
            <ActivePrompt prompt={currentStage.prompt} />
            {renderControl(currentStage)}
          </>
        ) : null}
      </ExerciseWorkspace>
    </View>
  );
}

export function isExplorableFooterReady(response: ExplorableModelResponse): boolean {
  return response.phase === "feedback" || response.phase === "complete";
}
