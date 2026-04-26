import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UnitData } from "@/src/types/journey/unit";
import { fetchSectionUnits } from "@/src/store/api/sectionMapApi";

interface SectionMapState {
  units: UnitData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SectionMapState = {
  units: [],
  isLoading: false,
  error: null,
};

const sectionMapSlice = createSlice({
  name: "sectionMap",
  initialState,
  reducers: {
    setSectionUnits: (state, action: PayloadAction<UnitData[]>) => {
      state.units = action.payload;
      state.error = null;
    },
    resetSectionMap: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSectionUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload) {
          state.units = action.payload;
        }
      })
      .addCase(fetchSectionUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to fetch section units";
      });
  },
});

export const { setSectionUnits, resetSectionMap } = sectionMapSlice.actions;

export default sectionMapSlice.reducer;
