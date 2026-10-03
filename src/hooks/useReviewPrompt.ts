import { useEffect, useCallback } from "react";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ReviewMilestone,
  UseReviewPromptParams,
} from "@/src/types/reviewPrompt.types";

export type { ReviewMilestone, UseReviewPromptParams } from "@/src/types/reviewPrompt.types";

const LAST_PROMPTED_KEY = "@happy/review_last_prompted_at";
const COMPLETED_MILESTONES_KEY = "@happy/review_milestones_completed";
// ponytail: 90 days cooldown prevents prompt fatigue and stays well within Apple's 3-per-year OS quota
const MIN_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;

// ponytail: check eligibility against 90-day cooldown and recorded milestone history
export async function requestReviewForMilestone(
  milestone: ReviewMilestone,
): Promise<boolean> {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();
    const hasAction = await StoreReview.hasAction();
    if (!isAvailable || !hasAction) return false;

    // Check completed milestones
    const completedRaw = await AsyncStorage.getItem(COMPLETED_MILESTONES_KEY);
    const completed: string[] = completedRaw ? JSON.parse(completedRaw) : [];
    if (completed.includes(milestone)) return false;

    // Check global 90-day cooldown
    const lastPromptedRaw = await AsyncStorage.getItem(LAST_PROMPTED_KEY);
    if (lastPromptedRaw) {
      const lastPromptedAt = parseInt(lastPromptedRaw, 10);
      if (Date.now() - lastPromptedAt < MIN_COOLDOWN_MS) {
        return false;
      }
    }

    // Record milestone & prompt timestamp before native trigger
    completed.push(milestone);
    await AsyncStorage.multiSet([
      [COMPLETED_MILESTONES_KEY, JSON.stringify(completed)],
      [LAST_PROMPTED_KEY, Date.now().toString()],
    ]);

    await StoreReview.requestReview();
    return true;
  } catch (error) {
    console.warn("[review] requestReviewForMilestone error:", error);
    return false;
  }
}

// ponytail: automated streak milestone prompt with safe timer cleanup
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

    // 2.0s delay allows celebratory feedback/animations to settle before prompt
    const timer = setTimeout(() => {
      void requestReview();
    }, 2000);

    return () => clearTimeout(timer);
  }, [enabled, currentMilestone, requestReview]);

  return { requestReview };
};
