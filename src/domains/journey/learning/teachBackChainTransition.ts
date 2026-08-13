import {
  createTeachBackChainResponse,
  readTeachBackChainContent,
} from "@/src/components/exercise/teachBackChainContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getTeachBackChainPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const chain = readTeachBackChainContent(exercise.content);
  if (!chain) return "Choose one";
  const state = createTeachBackChainResponse(chain, response);
  if (state.mode === "chain") {
    return state.orderedStepIds.length === chain.steps.length
      ? "Try it yourself"
      : "Build the chain above";
  }
  if (state.phase === "complete") return "Continue";
  return state.phase === "feedback" ? "Try again" : "Choose one";
}

export function getNextTeachBackChainState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const chain = readTeachBackChainContent(exercise.content);
  if (!chain) return undefined;
  const state = createTeachBackChainResponse(chain, response);
  if (state.mode === "chain" && state.orderedStepIds.length === chain.steps.length) {
    return {
      kind: "response",
      ready: false,
      response: createTeachBackChainResponse(chain, { ...state, mode: "transfer" }),
    };
  }
  if (state.mode === "transfer" && state.phase === "feedback") {
    return {
      kind: "response",
      ready: false,
      response: createTeachBackChainResponse(chain, {
        ...state,
        selectedTransferOptionId: null,
        feedbackText: null,
      }),
    };
  }
  return undefined;
}
