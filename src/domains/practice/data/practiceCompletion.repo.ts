import { supabase } from "@/src/network/auth/supabase";

export interface PracticeCompletionV1 {
  practice_session_id: string;
  user_id: string;
  path_id: string | null;
  path_version: number | null;
  practice_ref: { source: string; id: string };
  source_kind: string;
  source_id: string;
  completion_kind: "submitted";
  completed_at: string;
  evidence_key: string;
  schema_version: 1;
}

interface AcknowledgePracticeCompletionInput {
  userId: string;
  practiceSessionId: string;
  pathId: string;
  pathVersion: number;
  practiceRef: { source: string; id: string };
  completedAt?: string;
}

export async function getLatestPracticeCompletion(
  userId: string,
): Promise<PracticeCompletionV1 | null> {
  const { data, error } = await supabase
    .from("practice_completions" as any)
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data || !isPracticeCompletion(data)) return null;
  return data;
}

function isPracticeCompletion(value: unknown): value is PracticeCompletionV1 {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<PracticeCompletionV1>;
  return (
    typeof row.practice_session_id === "string" &&
    typeof row.user_id === "string" &&
    typeof row.completed_at === "string" &&
    typeof row.source_id === "string" &&
    typeof row.source_kind === "string" &&
    row.completion_kind === "submitted"
  );
}

export async function acknowledgePracticeCompletion(
  input: AcknowledgePracticeCompletionInput,
): Promise<PracticeCompletionV1> {
  const completedAt = input.completedAt ?? new Date().toISOString();
  const row = {
    user_id: input.userId,
    practice_session_id: input.practiceSessionId,
    path_id: input.pathId,
    path_version: input.pathVersion,
    practice_ref: input.practiceRef,
    source_kind: input.practiceRef.source,
    source_id: input.practiceRef.id,
    completion_kind: "submitted",
    completed_at: completedAt,
    evidence_key: `practice:${input.pathId}:${input.pathVersion}`,
    schema_version: 1,
  };

  const { data, error } = await supabase
    .from("practice_completions" as any)
    .upsert(row as any, { onConflict: "user_id,practice_session_id" })
    .select()
    .single();

  if (error) throw error;
  return data as PracticeCompletionV1;
}
