import type { MicrolearningPhase } from "@/src/components/exercise/microlearning/microlearningTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { WorkedRewriteContent, WorkedRewriteOption } from "./workedRewriteContent";

const FORMAT = CourseExerciseCategoryEnum.WorkedRewrite;

export interface WorkedRewriteResponse extends Record<string, unknown> {
  format: CourseExerciseCategoryEnum.WorkedRewrite;
  phase: MicrolearningPhase;
  stageIndex: number;
  isCorrect: boolean;
  completedMoveIds: string[];
  selectedOptionId: string | null;
  attemptCount: number;
}

export function createWorkedRewriteResponse(content: WorkedRewriteContent, saved: Record<string, unknown> | null = null): WorkedRewriteResponse {
  const source = saved?.format === FORMAT ? saved : null;
  const completedMoveIds = readMovePrefix(source?.completedMoveIds, content);
  const moveCount = content.moves.length;
  const attemptCount = clampAttemptCount(source?.attemptCount);
  if (completedMoveIds.length < moveCount) {
    const feedbackIndex = completedMoveIds.length - 1;
    if (source?.phase === "feedback" && source.stageIndex === feedbackIndex && feedbackIndex >= 0) {
      return response("feedback", feedbackIndex, true, completedMoveIds, null, attemptCount);
    }
    return response("active", completedMoveIds.length, false, completedMoveIds, null, attemptCount);
  }
  if (source?.phase === "feedback" && source.stageIndex === moveCount - 1) {
    return response("feedback", moveCount - 1, true, completedMoveIds, null, attemptCount);
  }
  const selected = findOption(content, source?.selectedOptionId);
  if (source?.phase === "complete" && selected?.isSupported) {
    return response("complete", moveCount, true, completedMoveIds, selected.id, attemptCount);
  }
  if (source?.phase === "feedback" && selected && !selected.isSupported) {
    return response("feedback", moveCount, false, completedMoveIds, selected.id, attemptCount);
  }
  return response("active", moveCount, false, completedMoveIds, null, attemptCount);
}

export function applyWorkedRewriteMove(content: WorkedRewriteContent, value: WorkedRewriteResponse): WorkedRewriteResponse {
  if (value.phase !== "active" || value.stageIndex >= content.moves.length) return value;
  const move = content.moves[value.stageIndex];
  return response("feedback", value.stageIndex, true, [...value.completedMoveIds, move.id], null, value.attemptCount);
}

export function advanceWorkedRewrite(content: WorkedRewriteContent, value: WorkedRewriteResponse): WorkedRewriteResponse {
  if (value.phase !== "feedback") return value;
  if (!value.isCorrect && value.stageIndex === content.moves.length) {
    return response("active", value.stageIndex, false, value.completedMoveIds, null, value.attemptCount);
  }
  if (!value.isCorrect || value.stageIndex >= content.moves.length) return value;
  const stageIndex = value.stageIndex + 1;
  return response("active", stageIndex, false, value.completedMoveIds, null, value.attemptCount);
}

export function selectWorkedRewriteOption(content: WorkedRewriteContent, value: WorkedRewriteResponse, optionId: string): WorkedRewriteResponse {
  if (value.phase !== "active" || value.stageIndex !== content.moves.length) return value;
  const option = findOption(content, optionId);
  if (!option) return value;
  return response(option.isSupported ? "complete" : "feedback", content.moves.length, option.isSupported,
    value.completedMoveIds, option.id, value.attemptCount + (option.isSupported ? 0 : 1));
}

export function getWorkedRewriteOption(content: WorkedRewriteContent, value: WorkedRewriteResponse): WorkedRewriteOption | null {
  return findOption(content, value.selectedOptionId);
}

function readMovePrefix(value: unknown, content: WorkedRewriteContent): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const move of content.moves) {
    if (value[result.length] !== move.id) break;
    result.push(move.id);
  }
  return result;
}

function findOption(content: WorkedRewriteContent, value: unknown): WorkedRewriteOption | null {
  return typeof value === "string"
    ? content.recognition.options.find((option) => option.id === value) ?? null
    : null;
}

function response(phase: MicrolearningPhase, stageIndex: number, isCorrect: boolean, completedMoveIds: string[], selectedOptionId: string | null, attemptCount: number): WorkedRewriteResponse {
  return { format: FORMAT, phase, stageIndex, isCorrect, completedMoveIds, selectedOptionId, attemptCount };
}

function clampAttemptCount(value: unknown): number {
  return Number.isFinite(value) && Number.isInteger(value) ? Math.max(0, value as number) : 0;
}
