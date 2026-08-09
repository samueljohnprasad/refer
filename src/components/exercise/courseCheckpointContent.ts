import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";

export interface CheckpointOption {
  label: string;
  feedback: string;
  isCorrect: boolean;
}

export interface CheckpointItem {
  concept: string;
  context?: string;
  prompt: string;
  clue: string;
  worked: string;
  options: CheckpointOption[];
}

export function readCheckpointItems(value: unknown): CheckpointItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((itemValue) => {
    const item = readRecord(itemValue);
    const concept = readString(item?.concept);
    const prompt = readString(item?.prompt);
    const clue = readString(item?.clue);
    const worked = readString(item?.worked);
    if (!concept || !prompt || !clue || !worked) return [];
    return [
      {
        concept,
        context: readString(item?.context) ?? undefined,
        prompt,
        clue,
        worked,
        options: readCheckpointOptions(item?.options),
      },
    ];
  });
}

function readCheckpointOptions(value: unknown): CheckpointOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((optionValue) => {
    const option = readRecord(optionValue);
    const label = readString(option?.label);
    const feedback = readString(option?.feedback);
    return label && feedback
      ? [{ label, feedback, isCorrect: option?.isCorrect === true }]
      : [];
  });
}

export function readBooleanResults(value: unknown): boolean[] {
  return Array.isArray(value)
    ? value.filter((item): item is boolean => typeof item === "boolean")
    : [];
}

export function readResponseIndex(value: unknown): number | null {
  return typeof value === "number" && value >= 0 ? value : null;
}
