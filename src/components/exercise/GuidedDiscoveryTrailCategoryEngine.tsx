import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import {
  ActivePrompt,
  ChoiceTray,
  CompactHistory,
  ExerciseWorkspace,
  InlineFeedback,
  StageProgress,
  readMicrolearningPhase,
  readStageIndex,
  sanitizeSelectedId,
} from "@/src/components/exercise/microlearning";
import { readGuidedDiscoveryTrailContent } from "@/src/components/exercise/guidedDiscoveryTrailContent";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function GuidedDiscoveryTrailCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const trail = readGuidedDiscoveryTrailContent(content);
  const saved = readRecord(savedResponse);
  const questions = trail?.questions ?? [];
  const phase = getPhase(saved, questions);
  const stageIndex = getStageIndex(saved, questions.length, phase);
  const question = questions[stageIndex];
  const selectedOptionId = sanitizeSelectedId(
    saved?.selectedOptionId,
    question?.options.map((option) => option.id) ?? [],
  );
  const selectedOption = question?.options.find(
    (option) => option.id === selectedOptionId,
  );
  const completedSummaries = questions
    .slice(0, phase === "complete" ? questions.length : stageIndex)
    .map((item) => item.summary);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  if (!trail || !question) return null;

  const selectOption = (optionId: string) => {
    if (locked || phase !== "active") return;
    const option = question.options.find((item) => item.id === optionId);
    if (!option) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        stageIndex,
        phase: "feedback",
        selectedOptionId: option.id,
        feedbackText: option.response,
        completedSummaries,
        isCorrect: true,
      }),
      true,
    );
  };

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Follow the evidence"}
        instruction={readString(content.instruction) ?? "Choose one clue at a time."}
      />
      <StageProgress stageIndex={stageIndex} stageCount={questions.length} label="Clue" />
      <ExerciseWorkspace transitionKey={`${phase}-${stageIndex}`}>
        {phase === "complete" ? (
          <View style={styles.conclusion} accessibilityLiveRegion="polite">
            <Text style={styles.conclusionLabel}>The pattern</Text>
            <Text style={styles.conclusionText}>{trail.stamp}</Text>
          </View>
        ) : (
          <>
            <CompactHistory
              items={completedSummaries.map((summary, index) => ({
                id: questions[index].id,
                value: summary,
              }))}
            />
            <ActivePrompt prompt={question.prompt} />
            {phase === "active" ? (
              <ChoiceTray
                choices={question.options}
                disabled={locked}
                onSelect={selectOption}
              />
            ) : null}
            <InlineFeedback
              message={phase === "feedback" ? (selectedOption?.response ?? null) : null}
              title={phase === "feedback" ? selectedOption?.label : undefined}
              tone="supported"
            />
          </>
        )}
      </ExerciseWorkspace>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
    phase: "active",
    stageIndex: 0,
    selectedOptionId: null,
    completedSummaries: [],
    feedbackText: null,
    isCorrect: true,
    ...extra,
  };
}

function getPhase(
  saved: Record<string, unknown> | null,
  questions: readonly { options: readonly { id: string }[] }[],
) {
  const phase = readMicrolearningPhase(saved?.phase);
  if (phase !== "feedback") return phase;
  const stageIndex = readStageIndex(saved?.stageIndex, questions.length);
  return sanitizeSelectedId(
    saved?.selectedOptionId,
    questions[stageIndex]?.options.map((option) => option.id) ?? [],
  )
    ? phase
    : "active";
}

function getStageIndex(
  saved: Record<string, unknown> | null,
  questionCount: number,
  phase: "active" | "feedback" | "complete",
): number {
  if (phase === "complete") return Math.max(questionCount - 1, 0);
  return readStageIndex(saved?.stageIndex, questionCount);
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16, paddingHorizontal: 10, paddingBottom: 12, paddingTop: 6 },
  conclusion: { flex: 1, justifyContent: "center", gap: 8 },
  conclusionLabel: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  conclusionText: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 28,
    lineHeight: 34,
  },
});
