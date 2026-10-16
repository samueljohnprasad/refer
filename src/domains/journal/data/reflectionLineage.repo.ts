// ponytail: atomic persistence and retrieval for CAP-3 guided reflection lineage
import { supabase } from "@/src/network/auth/supabase";
import {
  CreateGuidedReflectionInput,
  ReflectionContextV1,
  isReflectionContextV1,
} from "../model/reflectionLineage";

export interface GuidedReflectionSaveResult {
  journalRecordId: number;
  lineage: ReflectionContextV1;
}

interface RawLineageRow {
  journal_record_id: number;
  user_id: string;
  path_id: string;
  path_version: number;
  practice_session_id: string;
  practice_ref: { source: string; id: string };
  reflection_prompt_id: string;
  source: "guided";
  schema_version: 1;
}

function parseRpcLineage(
  rpcData: unknown,
  input: CreateGuidedReflectionInput,
): GuidedReflectionSaveResult | null {
  if (!rpcData || typeof rpcData !== "object") return null;
  const parsed = rpcData as Record<string, unknown>;
  const journalRecordId = Number(parsed.journal_record_id);
  const lineage: ReflectionContextV1 = {
    path_id: String(parsed.path_id),
    path_version: Number(parsed.path_version),
    practice_session_id: String(parsed.practice_session_id),
    practice_ref: input.practiceRef,
    reflection_prompt_id: String(parsed.reflection_prompt_id),
    journal_record_id: journalRecordId,
    source: "guided",
    schema_version: 1,
  };
  return { journalRecordId, lineage };
}

async function executeRpcSave(
  input: CreateGuidedReflectionInput,
  selectedDate: string,
  wordsCount: number,
): Promise<GuidedReflectionSaveResult | null> {
  const { data, error } = await supabase.rpc(
    "create_guided_reflection_atomic" as any,
    {
      p_title: input.title,
      p_transcripts: input.transcripts,
      p_input_type: input.inputType ?? "text",
      p_selected_date: selectedDate,
      p_duration_seconds: input.durationSeconds ?? 0,
      p_words_count: wordsCount,
      p_path_id: input.pathId,
      p_path_version: input.pathVersion,
      p_practice_session_id: input.practiceSessionId,
      p_practice_ref: input.practiceRef,
      p_reflection_prompt_id: input.reflectionPromptId,
    } as any,
  );

  return error ? null : parseRpcLineage(data, input);
}

async function executeClientFallbackSave(
  input: CreateGuidedReflectionInput,
  selectedDate: string,
  wordsCount: number,
): Promise<GuidedReflectionSaveResult> {
  const { data: journalRow, error: journalError } = await supabase
    .from("journal_records")
    .insert({
      user_id: input.userId,
      title: input.title,
      transcripts: input.transcripts,
      input_type: input.inputType ?? "text",
      selected_date: selectedDate,
      duration_seconds: input.durationSeconds ?? 0,
      words_count: wordsCount,
    } as any)
    .select("id")
    .single();

  if (journalError || !journalRow) {
    throw new Error(journalError?.message ?? "Failed to save journal record");
  }

  const journalRecordId = Number(journalRow.id);

  const lineageRow: RawLineageRow = {
    journal_record_id: journalRecordId,
    user_id: input.userId,
    path_id: input.pathId,
    path_version: input.pathVersion,
    practice_session_id: input.practiceSessionId,
    practice_ref: input.practiceRef,
    reflection_prompt_id: input.reflectionPromptId,
    source: "guided",
    schema_version: 1,
  };

  const { error: lineageError } = await supabase
    .from("journal_reflection_lineage" as any)
    .insert(lineageRow as any);

  if (lineageError) {
    // ponytail: atomic rollback on lineage failure
    await supabase.from("journal_records").delete().eq("id", journalRecordId);
    throw new Error(lineageError.message);
  }

  const lineage: ReflectionContextV1 = {
    path_id: input.pathId,
    path_version: input.pathVersion,
    practice_session_id: input.practiceSessionId,
    practice_ref: input.practiceRef,
    reflection_prompt_id: input.reflectionPromptId,
    journal_record_id: journalRecordId,
    source: "guided",
    schema_version: 1,
  };

  return { journalRecordId, lineage };
}

export async function saveGuidedReflection(
  input: CreateGuidedReflectionInput,
): Promise<GuidedReflectionSaveResult> {
  const selectedDate = input.selectedDate ?? new Date().toISOString();
  const wordsCount =
    input.wordsCount ??
    input.transcripts.trim().split(/\s+/).filter(Boolean).length;

  const rpcResult = await executeRpcSave(input, selectedDate, wordsCount);
  if (rpcResult) return rpcResult;

  return executeClientFallbackSave(input, selectedDate, wordsCount);
}

export async function getReflectionLineageByJournalId(
  journalRecordId: number,
  userId: string,
): Promise<ReflectionContextV1 | null> {
  const { data, error } = await supabase
    .from("journal_reflection_lineage" as any)
    .select("*")
    .eq("journal_record_id", journalRecordId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return isReflectionContextV1(data) ? data : null;
}

export async function isGuidedReflectionRecord(
  journalRecordId: number,
  userId: string,
): Promise<boolean> {
  const lineage = await getReflectionLineageByJournalId(journalRecordId, userId);
  return lineage !== null;
}

export async function deleteGuidedReflection(
  journalRecordId: number,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("journal_records")
    .delete()
    .eq("id", journalRecordId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
