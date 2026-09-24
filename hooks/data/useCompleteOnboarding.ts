import { useAuth } from "@/src/context/AuthContext";
import type { RemindersConfig } from "@/src/components/lib/notification-reminders";
import type { Database } from "@/database.types";
import { supabase } from "@/src/network/auth/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import type { OnboardingFormData } from "@/src/screens/OnboardingScreen/types";
import { useStartCourseMutation } from "@/src/domains/journey/data/journeyApi";
import { fetchCourseCatalog } from "@/src/domains/journey/data/courseServerQueries";
import { resolveCourseForMotivation } from "@/src/screens/OnboardingScreen/utils/courseResolver";
import { setActiveCourse } from "@/src/domains/journey/state/journeySlice";
import { useAppDispatch } from "@/src/store/hooks";
import type { MotivationAnswer } from "@/src/screens/OnboardingScreen/types";

export const ONBOARDING_KEY = "onboarding_completed";

type CompleteOnboardingData = Pick<
  OnboardingFormData,
  "motivation" | "notificationTime"
> & {
  cfg: RemindersConfig;
  reminderEnabled: boolean;
  name?: string;
  reasons?: MotivationAnswer[];
  ageRange?: Database["public"]["Enums"]["age_range_enum"];
  gender?: Database["public"]["Enums"]["gender_enum"];
};

export const useCompleteOnboarding = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [startCourse] = useStartCourseMutation();

  const markCompleted = useCallback(
    async (
      onBoardingData: CompleteOnboardingData,
    ): Promise<void> => {
      if (!user) return;

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          remainders: onBoardingData.cfg,
          daily_reminder_enabled: onBoardingData.reminderEnabled,
          timezone,
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          onboarding_completed: true,
          display_name: onBoardingData.name,
          age_range: onBoardingData.ageRange,
          gender: onBoardingData.gender,
          reasons: onBoardingData.reasons,
        },
        { onConflict: "id" },
      );

      if (profileError) throw profileError;

      // Resolve user's personalized course from catalog and enroll immediately
      try {
        const catalog = await fetchCourseCatalog();
        const courseId = resolveCourseForMotivation(onBoardingData.motivation, catalog);
        if (courseId) {
          await startCourse(courseId).unwrap();
          dispatch(setActiveCourse(courseId));
        }
      } catch (error) {
        console.warn("[Onboarding] Course enrollment deferred:", error);
      }

      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    },
    [dispatch, startCourse, user],
  );

  return { markCompleted };
};
