// hooks/journey/useDefaultCourse.ts
// Resolves which courseId to display when the user opens the Journeys tab.
// Auto-enrollment rule:
//   - 0 enrollments → use JOURNEY.DEFAULT_COURSE_ID (config-driven)
//   - 1+ enrollments → use the first enrolled courseId (earliest started_at)

import { useGetEnrolledCourseIdsQuery } from "@/src/features/journey/journeyApi";
import { JOURNEY } from "@/src/lib/constants/journey";

export interface UseDefaultCourseResult {
  /** The courseId to render. Never null — falls back to DEFAULT_COURSE_ID. */
  courseId: string;
  /** True while the enrolled courses query is in flight. */
  isLoading: boolean;
  /** Error string if the enrolled courses query failed. */
  error: string | undefined;
}

/**
 * Resolves the courseId to display on the Journeys tab.
 *
 * Uses getEnrolledCourseIds (direct Supabase query) to check enrollments.
 * If no enrollments exist, returns DEFAULT_COURSE_ID — auto-enrollment
 * happens lazily when useJourneyMap fires get-course-progress.
 */
export function useDefaultCourse(): UseDefaultCourseResult {
  const {
    data: enrolledIds,
    isLoading,
    error,
  } = useGetEnrolledCourseIdsQuery();

  const courseId =
    enrolledIds && enrolledIds.length > 0
      ? enrolledIds[0]!
      : JOURNEY.DEFAULT_COURSE_ID;

  return {
    courseId,
    isLoading,
    error: error ? String(error) : undefined,
  };
}
