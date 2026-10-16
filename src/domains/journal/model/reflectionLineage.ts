// ponytail: minimal canonical types for CAP-3 reflection lineage and persistence contracts

export interface PracticeReference {
  source: string;
  id: string;
}

export interface ReflectionContextV1 {
  path_id: string;
  path_version: number;
  practice_session_id: string;
  practice_ref: PracticeReference;
  reflection_prompt_id: string;
  journal_record_id: number;
  source: "guided";
  schema_version: 1;
}

export interface CreateGuidedReflectionInput {
  userId: string;
  title: string;
  transcripts: string;
  inputType?: "text" | "voice" | "photo";
  selectedDate?: string;
  durationSeconds?: number;
  wordsCount?: number;
  pathId: string;
  pathVersion: number;
  practiceSessionId: string;
  practiceRef: PracticeReference;
  reflectionPromptId: string;
}

export function isPracticeReference(value: unknown): value is PracticeReference {
  const ref = value as Partial<PracticeReference> | null | undefined;
  return Boolean(ref && typeof ref.source === "string" && typeof ref.id === "string");
}

function hasStringFields(ctx: Partial<ReflectionContextV1>): boolean {
  return (
    typeof ctx.path_id === "string" &&
    typeof ctx.practice_session_id === "string" &&
    typeof ctx.reflection_prompt_id === "string"
  );
}

function hasNumericFields(ctx: Partial<ReflectionContextV1>): boolean {
  return (
    typeof ctx.path_version === "number" &&
    typeof ctx.journal_record_id === "number" &&
    ctx.schema_version === 1
  );
}

export function isReflectionContextV1(value: unknown): value is ReflectionContextV1 {
  const ctx = value as Partial<ReflectionContextV1> | null | undefined;
  if (!ctx || ctx.source !== "guided") return false;
  return (
    hasStringFields(ctx) &&
    hasNumericFields(ctx) &&
    isPracticeReference(ctx.practice_ref)
  );
}
