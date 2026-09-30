import { useEffect, useCallback } from "react";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REVIEW_LAST_REQUESTED_KEY = "app_review_last_requested_at";
const LEGACY_REVIEW_REQUESTED_KEY = "app_review_requested";
const REVIEW_MILESTONE_STREAK = 3;
// Apple allows max 3 prompts per 365 days; wait at least 120 days between requests
const MIN_DAYS_BETWEEN_REQUESTS = 120;

interface UseReviewPromptParams {
  currentStreak: number;
  previousStreak?: number;
  enabled?: boolean;
}

export type ReviewMilestone =
  | "streak_3"
  | "streak_7"
  | "streak_15"
  | "course_unit_completed"
  | "lesson_milestone_3";

// ponytail: standalone helper to request App Store review at emotional highs (course/unit completion)
export async function requestReviewForMilestone(
  milestone: ReviewMilestone,
): Promise<void> {
  try {
    const milestoneKey = `@happy/review_prompted_${milestone}`;
    const alreadyPrompted = await AsyncStorage.getItem(milestoneKey);
    if (alreadyPrompted === "true") return;

    const isAvailable = await StoreReview.isAvailableAsync();
    const hasAction = await StoreReview.hasAction();
    if (!isAvailable || !hasAction) return;

    await AsyncStorage.setItem(milestoneKey, "true");
    await StoreReview.requestReview();
  } catch (error) {
    console.warn("[review] request error:", error);
  }
}

// ponytail: native in-app review prompt triggered at Day 3 (2->3), Day 7, and Day 15 milestones per Apple HIG
export const useReviewPrompt = ({
  currentStreak,
  previousStreak,
  enabled = true,
}: UseReviewPromptParams) => {
  const isStreak3 =
    previousStreak !== undefined
      ? previousStreak === 2 && currentStreak === 3
      : currentStreak === 3;
  const isStreak7 = currentStreak === 7;
  const isStreak15 = currentStreak === 15;

  const currentMilestone: ReviewMilestone | null = isStreak3
    ? "streak_3"
    : isStreak7
      ? "streak_7"
      : isStreak15
        ? "streak_15"
        : null;

  const requestReview = useCallback(async () => {
    if (!currentMilestone) return;
    await requestReviewForMilestone(currentMilestone);
  }, [currentMilestone]);

  useEffect(() => {
    if (!enabled || !currentMilestone) return;

    // Delay so celebration animation completes and user enjoys the moment
    const timer = setTimeout(() => {
      requestReview();
    }, 1800);

    return () => clearTimeout(timer);
  }, [enabled, currentMilestone, requestReview]);

  return { requestReview };
};

