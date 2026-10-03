// ponytail: type definitions for in-app review booster system
export type ReviewMilestone =
  | "first_exercise_completed"
  | "first_journal_saved"
  | "streak_3"
  | "streak_7"
  | "streak_15"
  | "course_unit_completed";

export interface UseReviewPromptParams {
  currentStreak: number;
  previousStreak?: number;
  enabled?: boolean;
}

export interface UseReviewPromptResult {
  requestReview: () => Promise<void>;
}
