import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSectionUnits as fetchSectionUnitsApi } from "@/src/lib/api/journeyApi";
import type { UnitData } from "@/src/types/journey/unit";

export const fetchSectionUnits = createAsyncThunk<
  UnitData[] | null,
  { slug: string; sectionNumber: number },
  { rejectValue: string }
>("sectionMap/fetchSectionUnits", async (args, { rejectWithValue }) => {
  try {
    const { slug, sectionNumber } = args;
    const response = await fetchSectionUnitsApi(slug, sectionNumber);

    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to fetch section units");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
});
