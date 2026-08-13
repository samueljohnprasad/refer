import type { WorkedRewriteResponse } from "./workedRewriteState";

const RESPONSE_KEYS = [
  "format", "phase", "stageIndex", "isCorrect", "completedMoveIds",
  "selectedOptionId", "attemptCount",
];

export function hasSameWorkedRewriteResponse(saved: Record<string, unknown>, response: WorkedRewriteResponse): boolean {
  return hasExactKeys(saved, RESPONSE_KEYS) && saved.format === response.format &&
    saved.phase === response.phase && saved.stageIndex === response.stageIndex &&
    saved.isCorrect === response.isCorrect && saved.selectedOptionId === response.selectedOptionId &&
    saved.attemptCount === response.attemptCount && Array.isArray(saved.completedMoveIds) &&
    saved.completedMoveIds.length === response.completedMoveIds.length &&
    saved.completedMoveIds.every((id, index) => id === response.completedMoveIds[index]);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
