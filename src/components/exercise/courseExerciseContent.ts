export interface CourseExerciseOption {
  id: string;
  label: string;
  body?: string;
  detail?: string;
  next?: string;
  feedback?: string;
  isCorrect?: boolean;
}

export function readCourseExerciseOptions(
  value: unknown,
): CourseExerciseOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(readRecord)
    .filter((option): option is Record<string, unknown> => Boolean(option))
    .map((option) => ({
      id: readString(option.id) ?? "",
      label: readString(option.label) ?? readString(option.text) ?? "",
      body: readString(option.body) ?? undefined,
      detail: readString(option.detail ?? option.rule) ?? undefined,
      next: readString(option.next ?? option.fix) ?? undefined,
      feedback: readString(option.feedback ?? option.why ?? option.coach) ?? undefined,
      isCorrect: option.isCorrect === true || option.ok === true,
    }))
    .filter((option) => option.id.length > 0 && option.label.length > 0);
}

export function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
