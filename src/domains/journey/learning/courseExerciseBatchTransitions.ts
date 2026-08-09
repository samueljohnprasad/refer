import {
  getFifthBatchPrimaryLabel,
  getFifthBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseFifthBatchTransition";
import {
  getEleventhBatchPrimaryLabel,
  getEleventhBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseEleventhBatchTransition";
import {
  getFinalBatchPrimaryLabel,
  getFinalBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseFinalBatchTransition";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import {
  getSixthBatchPrimaryLabel,
  getSixthBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseSixthBatchTransition";
import {
  getSeventhBatchPrimaryLabel,
  getSeventhBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseSeventhBatchTransition";
import {
  getNinthBatchPrimaryLabel,
  getNinthBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseNinthBatchTransition";
import {
  getTenthBatchPrimaryLabel,
  getTenthBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseTenthBatchTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  return (
    getFinalBatchPrimaryLabel(exercise, response) ??
    getEleventhBatchPrimaryLabel(exercise, response) ??
    getTenthBatchPrimaryLabel(exercise, response) ??
    getNinthBatchPrimaryLabel(exercise, response) ??
    getSeventhBatchPrimaryLabel(exercise, response) ??
    getSixthBatchPrimaryLabel(exercise, response) ??
    getFifthBatchPrimaryLabel(exercise, response)
  );
}

export function getBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  return (
    getFinalBatchPrimaryTransition(exercise, response) ??
    getEleventhBatchPrimaryTransition(exercise, response) ??
    getTenthBatchPrimaryTransition(exercise, response) ??
    getNinthBatchPrimaryTransition(exercise, response) ??
    getSeventhBatchPrimaryTransition(exercise, response) ??
    getSixthBatchPrimaryTransition(exercise, response) ??
    getFifthBatchPrimaryTransition(exercise, response)
  );
}
