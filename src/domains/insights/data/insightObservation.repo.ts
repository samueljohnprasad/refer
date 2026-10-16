import { supabase } from "@/src/network/auth/supabase";
import {
  COPING_PATH_INSIGHT_FAMILY,
  InsightObservationV1,
  InsightTimeContextV1,
} from "../model/insightObservation";

interface PracticeCompletionRow {
  practice_session_id: string;
  path_id: string | null;
  path_version: number | null;
  completed_at: string;
}

const COMPLETION_FIELDS =
  "practice_session_id,path_id,path_version,completed_at";

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function getLocalDate(timestamp: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function createObservationId(sourceId: string): string {
  return `${sourceId}:${COPING_PATH_INSIGHT_FAMILY}`;
}

async function getOrCreateTimeContext(
  userId: string,
  timezone: string,
): Promise<InsightTimeContextV1> {
  const { data } = await supabase
    .from("insight_time_contexts" as any)
    .select("user_id, timezone, timezone_epoch")
    .eq("user_id", userId)
    .maybeSingle();

  const existing = data as unknown as InsightTimeContextV1 | null;
  const timezoneEpoch = existing
    ? existing.timezone === timezone
      ? existing.timezone_epoch
      : existing.timezone_epoch + 1
    : 1;

  const context = { user_id: userId, timezone, timezone_epoch: timezoneEpoch };
  const { data: saved, error } = await supabase
    .from("insight_time_contexts" as any)
    .upsert(context as any)
    .select("user_id, timezone, timezone_epoch")
    .single();

  if (error) throw error;
  return saved as unknown as InsightTimeContextV1;
}

export async function projectCopingPathObservations(
  userId: string,
  timezone: string,
): Promise<InsightObservationV1[]> {
  if (!isValidTimezone(timezone)) return [];

  const context = await getOrCreateTimeContext(userId, timezone);
  const { data, error } = await supabase
    .from("practice_completions" as any)
    .select(COMPLETION_FIELDS)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) throw error;

  const rows = ((data as unknown as PracticeCompletionRow[] | null) ?? []).filter(
    (row) =>
      typeof row.practice_session_id === "string" &&
      typeof row.path_id === "string" &&
      typeof row.path_version === "number" &&
      typeof row.completed_at === "string",
  );

  const observations = rows.map((row): InsightObservationV1 => ({
    observation_id: createObservationId(row.practice_session_id),
    user_id: userId,
    source_type: "practice_completion",
    source_id: row.practice_session_id,
    practice_session_id: row.practice_session_id,
    insight_family: COPING_PATH_INSIGHT_FAMILY,
    evidence_key: `${COPING_PATH_INSIGHT_FAMILY}:${row.path_id}:${row.path_version}`,
    observed_at: row.completed_at,
    local_date: getLocalDate(row.completed_at, context.timezone),
    timezone: context.timezone,
    timezone_epoch: context.timezone_epoch,
    schema_version: 1,
    metrics: { path_id: row.path_id as string, path_version: row.path_version as number },
  }));

  if (observations.length > 0) {
    const { error: upsertError } = await supabase
      .from("insight_observations" as any)
      .upsert(observations as any, { onConflict: "user_id,source_id,insight_family" });
    if (upsertError) throw upsertError;
  }

  return observations;
}
