import { useAuth } from "@/src/context/AuthContext";
import { RemindersConfig } from "@/src/components/lib/notification-reminders";
import { supabase } from "@/src/network/auth/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import { OnBoardingFormData } from "@/src/components/steps/src/types";

export const ONBOARDING_KEY = "onboarding_completed";

export const useCompleteOnboarding = () => {
  const { user } = useAuth();

  const markCompleted = useCallback(
    async (
      onBoardingData: OnBoardingFormData & { cfg: RemindersConfig }
    ): Promise<void> => {
      if (!user) return;

      const { data, error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          remainders: onBoardingData.cfg,
          daily_reminder_enabled: true,
        },
        { onConflict: "user_id" }
      );

      if (error) {
        throw error;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            onboarding_completed: true,
            display_name: onBoardingData.name,
            age_range: onBoardingData.ageRange,
            gender: onBoardingData.gender,
            reasons: onBoardingData.reasons,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        throw profileError;
      }

      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    },
    []
  );

  return { markCompleted };
};
