import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchSectionMap } from "@/src/lib/api/journeyApi";
import type { SectionMapResponse } from "@/src/types/journey/sectionMap";
import {
  setSectionMap,
  setCurrentSectionNumber,
} from "@/src/store/slices/sectionMapSlice";

// Create the API slice
export const sectionMapApi = createApi({
  reducerPath: "sectionMapApi",
  baseQuery: async (args, api, extraOptions) => {
    // Custom base query that uses the existing fetchSectionMap function
    try {
      const { slug, unitNumber } = args as {
        slug: string;
        unitNumber?: number;
      };
      const response = await fetchSectionMap(slug, unitNumber);

      if (!response.success) {
        return {
          error: {
            status: "CUSTOM_ERROR",
            error: response.error ?? "Failed to fetch section map",
            data: response.data,
          },
        };
      }

      return { data: response.data };
    } catch (error) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },
  endpoints: (builder) => ({
    getSectionMap: builder.query<
      SectionMapResponse | null,
      { slug: string; unitNumber?: number }
    >({
      query: ({ slug, unitNumber }) => ({ slug, unitNumber }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data) {
          dispatch(setSectionMap(data));
        }
      },
    }),
  }),
});

// Export hooks
export const { useGetSectionMapQuery } = sectionMapApi;
