import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export interface LeverPair {
  id: string;
  left: string;
  right: string;
}

export function readPairs(value: unknown): LeverPair[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const pair = readRecord(item);
    const id = readString(pair?.id);
    const left = readString(pair?.left);
    const right = readString(pair?.right);
    return id && left && right ? [{ id, left, right }] : [];
  });
}

export function readCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LeverMatch,
    phase: "matching",
    matchedIds: [] as string[],
    selectedLeftId: null as string | null,
    selectedRightId: null as string | null,
    mismatchCount: 0,
    isCorrect: true,
    ...extra,
  };
}
