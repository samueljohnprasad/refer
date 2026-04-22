import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UnitData } from "@/src/types/journey/unit";

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
});

export const { setSectionUnits, resetSectionMap } = sectionMapSlice.actions;

export default sectionMapSlice.reducer;
