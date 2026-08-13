import type { MicrolearningPhase } from "./microlearningTypes";

export function readMicrolearningPhase(value: unknown): MicrolearningPhase {
  return value === "feedback" || value === "complete" ? value : "active";
}

export function readStageIndex(value: unknown, stageCount: number): number {
  if (!Number.isInteger(value) || stageCount <= 0) return 0;
  return Math.max(0, Math.min(value as number, stageCount - 1));
}

export function isFinalMicrolearningResponse(value: unknown): boolean {
  return isRecord(value) && value.phase === "complete";
}

export function sanitizeSelectedId(
  value: unknown,
  validIds: readonly string[],
): string | null {
  return typeof value === "string" && validIds.includes(value) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
