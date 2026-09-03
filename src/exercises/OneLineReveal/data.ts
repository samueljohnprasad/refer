import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface OneLineRevealOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string | null;
}

export interface OneLineRevealData {
  title: string;
  instruction: string;
  firstLine: string | null;
  secondLine: string | null; // Keep for backward compatibility
  why: string | null; // Keep for backward compatibility
  completionNote?: string;
  whyTitle?: string;
  options: OneLineRevealOption[];
}

export function readOneLineRevealData(exercise: Exercise): OneLineRevealData {
  const content = readRecord(exercise.content) ?? {};
  
  const rawOptions = Array.isArray(content.options) ? content.options : [];
  const options = rawOptions
    .map(readRecord)
    .filter((opt): opt is Record<string, unknown> => opt !== null)
    .map((opt) => ({
      id: readString(opt.id) ?? "",
      label: readString(opt.label) ?? "",
      isCorrect: opt.isCorrect === true,
      feedback: readString(opt.feedback),
    }))
    .filter((opt) => opt.id !== "" && opt.label !== "");

  return {
    title: readString(content.title) ?? "One idea",
    instruction: readString(content.instruction) ?? "Tap to reveal.",
    firstLine: readString(content.firstLine),
    secondLine: readString(content.secondLine),
    why: readString(content.why),
    completionNote: readString(content.completionNote) ?? undefined,
    whyTitle: readString(content.whyTitle) ?? undefined,
    options,
  };
}
