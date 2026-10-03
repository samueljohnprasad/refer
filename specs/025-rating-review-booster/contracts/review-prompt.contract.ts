// specs/025-rating-review-booster/contracts/review-prompt.contract.ts
// Contract definition for in-app review booster system

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

/**
 * Triggers native App Store rating prompt if eligible under milestone and 90-day cooldown rules.
 * Safe to call from any component or hook — never throws exceptions.
 */
export type RequestReviewForMilestoneFn = (
  milestone: ReviewMilestone,
) => Promise<boolean>;

/**
 * Opens the external App Store product review composer for Happy.
 * Used exclusively for manual user button taps (e.g. in Settings).
 */
export type OpenAppStoreReviewFn = () => Promise<void>;
