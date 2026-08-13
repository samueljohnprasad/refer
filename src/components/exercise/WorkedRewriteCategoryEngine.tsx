import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import { ActivePrompt, ChoiceTray, ExerciseWorkspace, InlineFeedback, StageProgress } from "@/src/components/exercise/microlearning";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { readWorkedRewriteContent, type WorkedRewriteMove } from "./workedRewriteContent";
import { hasSameWorkedRewriteResponse } from "./workedRewriteResponse";
import { createWorkedRewriteResponse, getWorkedRewriteOption, isWorkedRewriteReady, selectWorkedRewriteOption } from "./workedRewriteState";
import { workedRewriteStyles as styles } from "./workedRewriteStyles";

export function WorkedRewriteCategoryEngine({ exercise, savedResponse, locked = false, onInteraction }: V1CategoryEngineProps) {
  const content = readWorkedRewriteContent(exercise.content);
  const saved = readRecord(savedResponse);
  const response = content ? createWorkedRewriteResponse(content, saved) : null;

  useEffect(() => {
    if (!content || !response || (saved && hasSameWorkedRewriteResponse(saved, response))) return;
    onInteraction(response, isWorkedRewriteReady(response, content.moves.length));
  }, [content, onInteraction, response, saved]);

  if (!content || !response) return null;
  const recognition = response.stageIndex === content.moves.length;
  const currentMove = recognition ? null : content.moves[response.stageIndex];
  const feedbackMove = response.phase === "feedback" && !recognition ? content.moves[response.stageIndex] : null;
  const selectedOption = getWorkedRewriteOption(content, response);
  const workingSentence = feedbackMove?.result ?? (currentMove
    ? precedingSentence(content.original, content.moves, response.stageIndex)
    : content.moves.at(-1)?.result ?? content.original);

  const selectOption = (optionId: string) => {
    if (locked || !recognition || response.phase !== "active") return;
    void Haptics.selectionAsync();
    const next = selectWorkedRewriteOption(content, response, optionId);
    onInteraction(next, isWorkedRewriteReady(next, content.moves.length));
  };

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading title={content.title} instruction={content.instruction} />
      <StageProgress stageIndex={response.stageIndex} stageCount={content.moves.length + 1} label="Move" />
      <ExerciseWorkspace accessibilityLabel="Worked rewrite notebook" transitionKey={`${response.phase}-${response.stageIndex}`}>
        <View style={styles.reference}>
          <Text style={styles.referenceLabel}>Original thought</Text>
          <Text style={styles.referenceText}>{content.original}</Text>
        </View>
        <CompletedSteps content={content.moves} completedIds={response.completedMoveIds} />
        <View style={styles.working}>
          <Text style={styles.workingLabel}>Working rewrite</Text>
          <HighlightedSentence sentence={workingSentence} phrase={feedbackMove?.changedPhrase ?? null} />
        </View>
        <View style={styles.activeRegion}>
          <ActivePrompt prompt={recognition ? content.recognition.prompt : currentMove?.stepLabel ?? ""} />
          {recognition && response.phase === "active" ? <ChoiceTray choices={content.recognition.options} disabled={locked} onSelect={selectOption} /> : null}
          <InlineFeedback
            message={feedbackMove?.rationale ?? selectedOption?.feedback ?? null}
            title={feedbackMove ? "Move applied" : selectedOption ? response.isCorrect ? "Balanced" : "Look again" : undefined}
            tone={response.isCorrect ? "supported" : "neutral"}
          />
        </View>
      </ExerciseWorkspace>
    </View>
  );
}

function CompletedSteps({ content, completedIds }: { content: WorkedRewriteMove[]; completedIds: string[] }) {
  const completed = content.filter((move) => completedIds.includes(move.id));
  if (!completed.length) return null;
  return <View style={styles.completedSteps}>{completed.map((move) => <Text key={move.id} style={styles.completedStep}>{move.stepLabel}</Text>)}</View>;
}

function HighlightedSentence({ sentence, phrase }: { sentence: string; phrase: string | null }) {
  if (!phrase) return <Text style={styles.workingText}>{sentence}</Text>;
  const [before, after] = sentence.split(phrase);
  return <Text style={styles.workingText}>{before}<Text style={styles.changedPhrase}>{phrase}</Text>{after}</Text>;
}

function precedingSentence(original: string, moves: WorkedRewriteMove[], stageIndex: number): string {
  return stageIndex > 0 ? moves[stageIndex - 1].result : original;
}
