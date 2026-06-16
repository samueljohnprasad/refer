import { useMemo } from "react";
import {
  MOTIVATION_COURSE_MAP,
  PersonalizedCourseConfig,
} from "@/src/screens/OnboardingScreen/constants";
import { MotivationAnswer } from "@/src/screens/OnboardingScreen/types";

// ---------------------------------------------------------------------------
// usePersonalizedCourse
// ---------------------------------------------------------------------------
// Returns the course config that matches the user's onboarding motivation.
//
// LOCAL MODE (current): resolves from MOTIVATION_COURSE_MAP in constants.ts.
//
// TO MIGRATE TO SUPABASE: replace the body of this hook with a
// useGetCourseByMotivationQuery(motivation) RTK Query call that hits a
// Supabase RPC or edge function. Keep the same return shape so all callers
// are unaffected.
// ---------------------------------------------------------------------------
export function usePersonalizedCourse(
  motivation: MotivationAnswer | undefined,
): PersonalizedCourseConfig {
  return useMemo(
    () => MOTIVATION_COURSE_MAP[motivation ?? "anxiety"],
    [motivation],
  );
}
