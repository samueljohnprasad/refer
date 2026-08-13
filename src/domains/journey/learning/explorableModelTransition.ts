import { readExplorableModelContent } from "@/src/components/exercise/explorableModelContent";
import {
  advanceExplorableStage,
  createExplorableModelResponse,
} from "@/src/components/exercise/explorableModelState";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getExplorableModelPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const content = readExplorableModelContent(exercise.content);
  if (!content) return "Try the lever";
  const state = createExplorableModelResponse(content, response);
  if (state.phase === "complete") return "Continue";
  return state.phase === "feedback" ? "Next lever" : "Try the lever";
}

export function getNextExplorableModelState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const content = readExplorableModelContent(exercise.content);
  if (!content) return undefined;
  const state = createExplorableModelResponse(content, response);
  if (state.phase !== "feedback") return undefined;
  const next = advanceExplorableStage(content, state);
  return {
    kind: "response",
    ready: next.phase === "complete",
    response: next,
  };
}
