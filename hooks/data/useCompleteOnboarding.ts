import { useAuth } from "@/src/context/AuthContext";
import { RemindersConfig } from "@/src/components/lib/notification-reminders";
import { supabase } from "@/src/network/auth/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import { OnBoardingFormData } from "@/src/components/steps/src/types";
import { useStartCourseMutation } from "@/src/features/journey/journeyApi";
import { MOTIVATION_COURSE_MAP } from "@/src/screens/OnboardingScreen/constants";
import { MotivationAnswer } from "@/src/screens/OnboardingScreen/types";

export const ONBOARDING_KEY = "onboarding_completed";

export const useCompleteOnboarding = () => {
  const { user } = useAuth();
  const [startCourse] = useStartCourseMutation();

  const markCompleted = useCallback(
    async (
      onBoardingData: OnBoardingFormData & {
        cfg: RemindersConfig;
        motivation?: MotivationAnswer;
      },
    ): Promise<void> => {
      if (!user) return;

      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          remainders: onBoardingData.cfg,
          daily_reminder_enabled: true,
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

      // Enroll user in their personalized course immediately.
      // When MOTIVATION_COURSE_MAP is replaced by a Supabase-driven lookup,
      // swap this line with: const courseId = await fetchCourseIdByMotivation(motivation)
      const courseId =
        MOTIVATION_COURSE_MAP[onBoardingData.motivation ?? "anxiety"].courseId;
      await startCourse(courseId)
        .unwrap()
        .catch(() => {
          // Non-fatal — useActiveCourse will auto-enroll on first journey tab visit
        });

      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    },
    [startCourse],
  );

  return { markCompleted };
};
