import { supabase } from "@/src/network/auth/supabase";
import type { StarterPathNextAction } from "../model/starterPath";
import type {
  StarterPathMutationResult,
  StarterPathProgressV1,
} from "../model/starterPathProgress";

const database = supabase as any;

type ProgressRow = {
  user_id: string;
  path_id: string;
  path_version: number;
  status: "active" | "completed";
  last_completed_step: string | null;
  last_idempotency_key: string | null;
  next_action: StarterPathNextAction;
  revision: number;
  updated_at: string;
};

const mapProgress = (row: ProgressRow): StarterPathProgressV1 => ({
  userId: row.user_id,
  pathId: row.path_id,
  pathVersion: row.path_version,
  status: row.status,
  lastCompletedStep: row.last_completed_step,
  lastIdempotencyKey: row.last_idempotency_key,
  nextAction: row.next_action,
  revision: row.revision,
  updatedAt: row.updated_at,
});

export async function loadActiveStarterPathId(
  userId: string,
): Promise<string | null> {
  const { data, error } = await database
    .from("user_preferences")
    .select("active_path_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.active_path_id ?? null;
}

export async function loadStarterPathProgress(
  userId: string,
  pathId: string,
  pathVersion: number,
): Promise<StarterPathProgressV1 | null> {
  const { data, error } = await database
    .from("user_starter_path_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("path_id", pathId)
    .eq("path_version", pathVersion)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProgress(data as ProgressRow) : null;
}

export async function saveStarterPathProgress(
  progress: StarterPathProgressV1,
): Promise<StarterPathProgressV1> {
  const { data, error } = await database
    .from("user_starter_path_progress")
    .upsert(
      {
        user_id: progress.userId,
        path_id: progress.pathId,
        path_version: progress.pathVersion,
        status: progress.status,
        last_completed_step: progress.lastCompletedStep,
        last_idempotency_key: null,
        next_action: progress.nextAction,
        revision: progress.revision,
      },
      { onConflict: "user_id,path_id,path_version" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapProgress(data as ProgressRow);
}

export async function switchStarterPath(
  userId: string,
  pathId: string,
  pathVersion: number,
  nextAction: StarterPathNextAction,
): Promise<StarterPathMutationResult> {
  const existingProgress = await loadStarterPathProgress(
    userId,
    pathId,
    pathVersion,
  );
  const progress =
    existingProgress ??
    (await saveStarterPathProgress({
      userId,
      pathId,
      pathVersion,
      status: "active",
      lastCompletedStep: null,
      lastIdempotencyKey: null,
      nextAction,
      revision: 0,
      updatedAt: new Date().toISOString(),
    }));

  const { error } = await database
    .from("user_preferences")
    .update({ active_path_id: pathId })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return { progress, conflict: false };
}

export async function setActiveStarterPath(
  userId: string,
  pathId: string,
): Promise<void> {
  const { error } = await database
    .from("user_preferences")
    .update({ active_path_id: pathId })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function completeStarterPathStep(
  progress: StarterPathProgressV1,
  stepId: string,
  nextAction: StarterPathNextAction,
  idempotencyKey: string,
): Promise<StarterPathMutationResult> {
  if (progress.lastIdempotencyKey === idempotencyKey) {
    return { progress, conflict: false };
  }
  const { data, error } = await database.rpc("complete_starter_path_step", {
    p_path_id: progress.pathId,
    p_path_version: progress.pathVersion,
    p_expected_revision: progress.revision,
    p_step_id: stepId,
    p_next_action: nextAction,
    p_idempotency_key: idempotencyKey,
  });

  if (error) {
    if (error.message?.includes("starter_path_revision_conflict")) {
      return { progress, conflict: true };
    }
    throw new Error(error.message);
  }
  if (!data) return { progress, conflict: true };
  return { progress: mapProgress(data as ProgressRow), conflict: false };
}
