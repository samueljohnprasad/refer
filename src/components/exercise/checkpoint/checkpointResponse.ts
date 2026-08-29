export interface CheckpointResponse {
  format: "checkpoint";
  phase: "intro" | "item" | "summary" | "complete";
  currentItemIndex: number;
  itemAttempts: Record<string, number>;
  itemOutcomes: Record<string, "solid" | "review_soon">;
  currentMatchSelection: { leftId: string | null; rightId: string | null };
  [key: string]: unknown;
}
