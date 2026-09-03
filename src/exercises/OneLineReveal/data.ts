import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface OneLineRevealData {
  title: string;
  instruction: string;
  firstLine: string | null;
  secondLine: string | null;
  why: string | null;
  completionNote?: string;
  whyTitle?: string;
}

export function readOneLineRevealData(exercise: Exercise): OneLineRevealData {
  const content = readRecord(exercise.content) ?? {};

  return {
    title: readString(content.title) ?? "One idea",
    instruction: readString(content.instruction) ?? "Tap to reveal.",
    firstLine: readString(content.firstLine),
    secondLine: readString(content.secondLine),
    why: readString(content.why),
    completionNote: readString(content.completionNote) ?? undefined,
    whyTitle: readString(content.whyTitle) ?? undefined,
  };
}
