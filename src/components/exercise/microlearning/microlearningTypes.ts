import type { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export type MicrolearningPhase = "active" | "feedback" | "complete";

export interface MicrolearningResponseBase {
  format: CourseExerciseCategoryEnum;
  phase: MicrolearningPhase;
  stageIndex: number;
  isCorrect: boolean;
}

export type ChoiceVisualState =
  | "idle"
  | "selected"
  | "supported"
  | "unsupported"
  | "disabled";

export interface MicrolearningChoice {
  id: string;
  label: string;
  accessibilityHint?: string;
}

export interface MicrolearningContentIssue {
  path: string;
  message: string;
}
