import { readFadedThoughtRecordContent } from "@/src/components/exercise/fadedThoughtRecordContent";
import {
  advanceFadedThoughtRecord,
  createFadedThoughtRecordResponse,
  getFadedThoughtRecordSteps,
  retryFadedThoughtRecord,
} from "@/src/components/exercise/fadedThoughtRecordState";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getFadedThoughtRecordPrimaryLabel(
  exercise: Exercise,
  saved: Record<string, unknown>,
): string {
  const content = readFadedThoughtRecordContent(exercise.content);
  if (!content) return "Choose one";
  const response = createFadedThoughtRecordResponse(content, saved);
  if (response.phase === "complete") return "Continue";
  if (response.phase === "active") return "Choose one";
  if (!response.isCorrect) return "Try again";
  const steps = getFadedThoughtRecordSteps(content);
  if (response.stageIndex === steps.length - 1) return "See the record";
  return response.exampleId === content.examples[0].id
    ? "Next example"
    : "Next field";
}

export function getNextFadedThoughtRecordState(
  exercise: Exercise,
  saved: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const content = readFadedThoughtRecordContent(exercise.content);
  if (!content) return undefined;
  const response = createFadedThoughtRecordResponse(content, saved);
  if (response.phase !== "feedback") return undefined;
  const next = response.isCorrect
    ? advanceFadedThoughtRecord(content, response)
    : retryFadedThoughtRecord(content, response);
  return {
    kind: "response",
    ready: next.phase === "feedback" || next.phase === "complete",
    response: next,
  };
}
