import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchEnrolledJourneys } from '@/src/lib/api/mentalHealthJourneyApi';
import type { MentalHealthJourneyListItem } from '@/src/types/journey';

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

// Create the API slice
export const enrolledCoursesApi = createApi({
  reducerPath: 'enrolledCoursesApi',
  baseQuery: async (args, api, extraOptions) => {
    // Custom base query that uses the existing fetchEnrolledJourneys function
    try {
      const response = await fetchEnrolledJourneys();
      
      if (!response.success) {
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: response.error ?? 'Failed to fetch enrolled courses',
            data: response.data,
          },
        };
      }
      
      return { data: response.data };
    } catch (error) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
  endpoints: (builder) => ({
    getEnrolledCourses: builder.query<EnrolledCoursesData, void>({
      query: () => ({}),
    }),
  }),
});

// Export hooks
export const { useGetEnrolledCoursesQuery } = enrolledCoursesApi;
