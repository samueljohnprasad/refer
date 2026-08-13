import { readWorkedRewriteContent } from "@/src/components/exercise/workedRewriteContent";
import { hasSameWorkedRewriteResponse } from "@/src/components/exercise/workedRewriteResponse";
import { advanceWorkedRewrite, applyWorkedRewriteMove, createWorkedRewriteResponse, isWorkedRewriteReady } from "@/src/components/exercise/workedRewriteState";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getWorkedRewritePrimaryLabel(exercise: Exercise, saved: Record<string, unknown>): string {
  const content = readWorkedRewriteContent(exercise.content);
  if (!content) return "Choose one";
  const response = createWorkedRewriteResponse(content, saved);
  if (response.phase === "complete") return "Continue";
  if (response.phase === "active") return response.stageIndex < content.moves.length ? "Apply move" : "Choose one";
  if (!response.isCorrect) return "Try again";
  return response.stageIndex === content.moves.length - 1 ? "Try it yourself" : "Next move";
}

export function getNextWorkedRewriteState(exercise: Exercise, saved: Record<string, unknown>): CoursePrimaryTransition | undefined {
  const content = readWorkedRewriteContent(exercise.content);
  if (!content) return undefined;
  const response = createWorkedRewriteResponse(content, saved);
  if (!hasSameWorkedRewriteResponse(saved, response)) {
    return { kind: "response", ready: isWorkedRewriteReady(response, content.moves.length), response };
  }
  if (response.phase === "active" && response.stageIndex < content.moves.length) {
    const next = applyWorkedRewriteMove(content, response);
    return { kind: "response", ready: isWorkedRewriteReady(next, content.moves.length), response: next };
  }
  if (response.phase === "feedback") {
    const next = advanceWorkedRewrite(content, response);
    return { kind: "response", ready: isWorkedRewriteReady(next, content.moves.length), response: next };
  }
  return undefined;
}
