import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface PrivateCheckData {
  title: string | null;
  instruction: string | null;
  items: string[];
  revealItems: string[];
  noneOptionLabel: string | null;
  privacyLabel: string | null;
  revealTitle: string | null;
  revealBody: string | null;
  noneRevealTitle: string | null;
  noneRevealBody: string | null;
}

export interface PrivateCheckResponse {
  selectedIndexes: number[];
  showingFeedback: boolean;
}

export function readPrivateCheckData(exercise: Exercise): PrivateCheckData {
  const content = exercise.content ?? {};
  const items = readStringArray(content.items);
  const revealItems = readStringArray(content.revealItems);

  return {
    title: readString(content.title),
    instruction: readString(content.instruction),
    items,
    revealItems: revealItems.length === items.length ? revealItems : items,
    noneOptionLabel: readString(content.noneOptionLabel),
    privacyLabel: readString(content.privacyLabel),
    revealTitle: readString(content.revealTitle),
    revealBody: readString(content.revealBody),
    noneRevealTitle: readString(content.noneRevealTitle),
    noneRevealBody: readString(content.noneRevealBody),
  };
}

export function readPrivateCheckResponse(response: unknown): PrivateCheckResponse {
  const saved = readRecord(response);
  return {
    selectedIndexes: readNumberArray(saved?.selectedItemIndexes),
    showingFeedback: saved?.phase === "feedback",
  };
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}
