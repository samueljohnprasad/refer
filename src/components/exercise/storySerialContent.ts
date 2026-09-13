import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export interface StoryBranch {
  choice: string;
  label: string;
  beats: string[];
}

export interface ReflectionOption {
  id: string;
  label: string;
  feedback: string;
}

export interface ComparisonData {
  start: string[];
  path1: string[];
  path2: string[];
}

// ponytail: minimal serialization helpers
export function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.StorySerial,
    phase: "story",
    ...extra,
  };
}

export function readBranches(value: unknown): StoryBranch[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const branch = readRecord(item);
    const choice = readString(branch?.choice);
    const label = readString(branch?.label);
    const beats = readStringArray(branch?.beats);
    return choice && label && beats.length ? [{ choice, label, beats }] : [];
  });
}

export function readComparison(value: unknown): ComparisonData {
  const comp = readRecord(value);
  return {
    start: readStringArray(comp?.start),
    path1: readStringArray(comp?.path1),
    path2: readStringArray(comp?.path2),
  };
}

export function readReflectionOptions(value: unknown): ReflectionOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const id = readString(option?.id);
    const label = readString(option?.label);
    const feedback = readString(option?.feedback);
    return id && label && feedback ? [{ id, label, feedback }] : [];
  });
}

export function readIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}
