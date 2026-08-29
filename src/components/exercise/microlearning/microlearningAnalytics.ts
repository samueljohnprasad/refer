import { logger } from "@/src/lib/logger";

const analyticsLogger = logger.extend("microlearning:analytics");

export type MicrolearningEventName =
  | "exercise_start"
  | "stage_view"
  | "opaque_scored_choice"
  | "feedback_shown"
  | "hint_shown"
  | "stage_complete"
  | "exercise_complete"
  | "exercise_skipped";

// ponytail: strictly bounded schema, explicitly disallows arbitrary string text properties
export interface MicrolearningTelemetryEvent {
  eventName: MicrolearningEventName;
  category: string;
  exerciseId: string;
  conceptId: string | null;
  stageIndex: number;
  correctness: boolean | null;
  attemptCount: number | null;
  elapsedSeconds: number;
  accessibilityFlags: Record<string, boolean>;
}

export function trackMicrolearningEvent(event: MicrolearningTelemetryEvent): void {
  // ponytail: log only, would wire to actual analytics endpoint here
  analyticsLogger.info(event.eventName, event);
}
