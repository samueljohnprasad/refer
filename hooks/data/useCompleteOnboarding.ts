import { OnBoardingFormData } from "@/src/components/steps/src";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

export const ONBOARDING_KEY = "onboarding_completed";

export const useCompleteOnboarding = () => {
  const { user } = useAuth();

  const markCompleted = useCallback(
    async (onBoardingData: OnBoardingFormData): Promise<void> => {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      if (!user) return;

      console.log("onBoardingData", onBoardingData);

      await supabase.from("profiles").upsert(
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

     const { data, error } =   await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          daily_reminder_enabled: onBoardingData.reminderEnabled,
          daily_reminder_time: onBoardingData.reminderTime,
        },
        { onConflict: "user_id" }
      );
    },
    []
  );

  return { markCompleted };
};
