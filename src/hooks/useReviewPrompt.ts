import { useEffect, useCallback } from "react";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const REVIEW_REQUESTED_KEY = "app_review_requested";
const REVIEW_MILESTONE_STREAK = 7; // Trigger at 7-day streak

interface UseReviewPromptParams {
  currentStreak: number;
  enabled?: boolean;
}

export const useReviewPrompt = ({
  currentStreak,
  enabled = true,
}: UseReviewPromptParams) => {
  const requestReview = useCallback(async () => {
    try {
      // Check if we've already requested a review
      const hasRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);

      if (hasRequested) {
        return; // Don't ask again
      }

      // Check if device supports in-app reviews
      const isAvailable = await StoreReview.isAvailableAsync();

      if (!isAvailable) {
        return;
      }

      // Show encouraging message first
      Alert.alert(
        "🌟 Day 7 of Reflection",
        "You've started your journey to self-awareness. We hope this space brings clarity to your thoughts. If it has, would you mind sharing your experience on the App Store?",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: async () => {
              // Mark as requested even if declined
              await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, "true");
            },
          },
          {
            text: "Rate App",
            onPress: async () => {
              await StoreReview.requestReview();
              await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, "true");
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error requesting review:", error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Trigger review request when user hits the 1-day milestone
    if (currentStreak === REVIEW_MILESTONE_STREAK) {
      // Small delay to avoid interrupting the streak celebration
      const timer = setTimeout(() => {
        requestReview();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStreak, enabled, requestReview]);

  return { requestReview };
};
