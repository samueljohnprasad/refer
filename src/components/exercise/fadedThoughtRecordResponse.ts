import type { FadedThoughtRecordResponse } from "@/src/components/exercise/fadedThoughtRecordState";

const RESPONSE_KEYS = [
  "format",
  "phase",
  "stageIndex",
  "isCorrect",
  "exampleId",
  "activeFieldId",
  "answersByExampleId",
  "selectedOptionId",
  "attemptCount",
];

export function hasSameFadedThoughtRecordResponse(
  saved: Record<string, unknown>,
  response: FadedThoughtRecordResponse,
): boolean {
  if (!hasExactKeys(saved, RESPONSE_KEYS)) return false;
  return saved.format === response.format && saved.phase === response.phase &&
    saved.stageIndex === response.stageIndex && saved.isCorrect === response.isCorrect &&
    saved.exampleId === response.exampleId && saved.activeFieldId === response.activeFieldId &&
    saved.selectedOptionId === response.selectedOptionId &&
    saved.attemptCount === response.attemptCount &&
    hasSameAnswers(saved.answersByExampleId, response.answersByExampleId);
}

function hasSameAnswers(
  value: unknown,
  expected: Record<string, Record<string, string>>,
): boolean {
  if (!isRecord(value) || Object.keys(value).length !== Object.keys(expected).length) return false;
  return Object.entries(expected).every(([exampleId, answers]) => {
    const saved = value[exampleId];
    return isRecord(saved) && Object.keys(saved).length === Object.keys(answers).length &&
      Object.entries(answers).every(([fieldId, optionId]) => saved[fieldId] === optionId);
  });
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => keys.includes(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
