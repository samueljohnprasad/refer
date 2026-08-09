import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";

export type RecordSlot = "evidence" | "realistic";

export interface RecordOption {
  text: string;
  feedback: string;
  isCorrect: boolean;
}

export interface RecordRow {
  kind: string;
  label: string;
  text: string;
  slot?: RecordSlot;
}

export interface RecordScreen {
  title: string;
  label: string;
  coach: string;
  rows: RecordRow[];
  evidenceOptions: RecordOption[];
  realisticOptions: RecordOption[];
  realisticAfter?: string;
}

export function readRecordScreens(value: unknown): RecordScreen[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const screen = readRecord(item);
    const title = readString(screen?.title);
    const label = readString(screen?.label);
    const coach = readString(screen?.coach);
    return title && label && coach
      ? [
          {
            title,
            label,
            coach,
            rows: readRows(screen?.rows),
            evidenceOptions: readOptions(screen?.evidenceOptions),
            realisticOptions: readOptions(screen?.realisticOptions),
            realisticAfter: readString(screen?.realisticAfter) ?? undefined,
          },
        ]
      : [];
  });
}

function readRows(value: unknown): RecordRow[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const row = readRecord(item);
    const kind = readString(row?.kind);
    const label = readString(row?.label);
    const text = readString(row?.text);
    const slot = readSlot(row?.slot);
    return kind && label && text ? [{ kind, label, text, slot }] : [];
  });
}

function readOptions(value: unknown): RecordOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const text = readString(option?.text);
    const feedback = readString(option?.feedback);
    return text && feedback
      ? [{ text, feedback, isCorrect: option?.isCorrect === true }]
      : [];
  });
}

function readSlot(value: unknown): RecordSlot | undefined {
  return value === "evidence" || value === "realistic" ? value : undefined;
}
