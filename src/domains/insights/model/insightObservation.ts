export const COPING_PATH_INSIGHT_FAMILY = "coping_path" as const;

export interface InsightObservationV1 {
  observation_id: string;
  user_id: string;
  source_type: "practice_completion";
  source_id: string;
  practice_session_id: string;
  insight_family: typeof COPING_PATH_INSIGHT_FAMILY;
  evidence_key: string;
  observed_at: string;
  local_date: string;
  timezone: string;
  timezone_epoch: number;
  schema_version: 1;
  metrics: {
    path_id: string;
    path_version: number;
  };
}

export interface InsightTimeContextV1 {
  user_id: string;
  timezone: string;
  timezone_epoch: number;
}

export type InsightReadinessState =
  | "insufficient-data"
  | "ready"
  | "invalid-timezone";

export interface DeterministicInsightResult {
  state: InsightReadinessState;
  activityCount: number;
  observationCount: number;
  activeDayCount: number;
  windowDays: 30;
  patternPathId: string | null;
}
