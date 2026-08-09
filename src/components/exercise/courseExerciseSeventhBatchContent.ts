import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";

export interface WaveOrderVariant {
  answer: string[];
  clue: string;
  correctFeedback: string;
  pool: string[];
  prompt: string;
  workedExample: string;
}

export interface ScrubberPhase {
  body: string;
  label: string;
  tone: "neutral" | "orange" | "olive";
  until: number;
}

export function readWaveOrderVariants(value: unknown): WaveOrderVariant[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const variant = readRecord(item);
    const prompt = readString(variant?.prompt);
    const clue = readString(variant?.clue);
    const correctFeedback = readString(variant?.correctFeedback);
    const workedExample = readString(variant?.workedExample);
    const answer = readStringArray(variant?.answer);
    const pool = readStringArray(variant?.pool);
    return prompt && clue && correctFeedback && workedExample && answer.length
      ? [{ prompt, clue, correctFeedback, workedExample, answer, pool }]
      : [];
  });
}

export function readScrubberPhases(value: unknown): ScrubberPhase[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const phase = readRecord(item);
    const label = readString(phase?.label);
    const body = readString(phase?.body);
    const tone = readTone(phase?.tone);
    const until = readFiniteNumber(phase?.until);
    return label && body && tone && until != null
      ? [{ label, body, tone, until }]
      : [];
  });
}

function readTone(value: unknown): ScrubberPhase["tone"] | null {
  return value === "neutral" || value === "orange" || value === "olive"
    ? value
    : null;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
