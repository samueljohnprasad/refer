import { useQuery } from "@tanstack/react-query";
import { fetchEnrolledJourneys } from "@/src/lib/api/mentalHealthJourneyApi";
import type { MentalHealthJourneyListItem } from "@/src/types/journey";

export const ENROLLED_COURSES_QUERY_KEY = ["enrolled-courses"] as const;

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

/**
 * Hook to fetch the list of courses/journeys the user is currently enrolled in.
 * Uses TanStack react-query and queries user_journey_enrollments first, then journey_templates.
 * Returns the courses and the slug of the course with the latest node completion.
 */
export function useEnrolledCoursesQuery() {
  return useQuery({
    queryKey: ENROLLED_COURSES_QUERY_KEY,
    queryFn: async (): Promise<EnrolledCoursesData> => {
      const response = await fetchEnrolledJourneys();

      if (!response.success) {
        throw new Error(response.error ?? "Failed to fetch enrolled courses");
      }

      return response.data;
    },
  });
}
