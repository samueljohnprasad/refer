import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchSectionUnits } from "@/src/lib/api/journeyApi";
import type { UnitData } from "@/src/types/journey/unit";
import { setSectionUnits } from "@/src/store/slices/sectionMapSlice";

export const sectionMapApi = createApi({
  reducerPath: "sectionMapApi",
  baseQuery: async (args) => {
    try {
      const { slug, sectionNumber } = args as {
        slug: string;
        sectionNumber: number;
      };
      const response = await fetchSectionUnits(slug, sectionNumber);

      if (!response.success) {
        return {
          error: {
            status: "CUSTOM_ERROR",
            error: response.error ?? "Failed to fetch section units",
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
    getSectionUnits: builder.query<
      UnitData[] | null,
      { slug: string; sectionNumber: number }
    >({
      query: ({ slug, sectionNumber }) => ({ slug, sectionNumber }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data) {
          dispatch(setSectionUnits(data));
        }
      },
    }),
  }),
});

export const { useGetSectionUnitsQuery } = sectionMapApi;
