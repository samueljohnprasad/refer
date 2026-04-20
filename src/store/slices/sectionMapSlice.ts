import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SectionMapResponse, SectionListItem } from '@/src/types/journey/sectionMap';

interface SectionMapState {
  sectionMap: SectionMapResponse | null;
  sectionList: SectionListItem[];
  activeNodeId: string | null;
  currentSectionNumber: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SectionMapState = {
  sectionMap: null,
  sectionList: [],
  activeNodeId: null,
  currentSectionNumber: null,
  isLoading: false,
  error: null,
};

const sectionMapSlice = createSlice({
  name: 'sectionMap',
  initialState,
  reducers: {
    setSectionMap: (state, action: PayloadAction<SectionMapResponse>) => {
      state.sectionMap = action.payload;
      state.sectionList = action.payload.sectionList || [];
      state.activeNodeId = action.payload.focusNodeId || null;
      state.currentSectionNumber = action.payload.section.unitNumber;
      state.error = null;
    },
    setSectionList: (state, action: PayloadAction<SectionListItem[]>) => {
      state.sectionList = action.payload;
    },
    setActiveNodeId: (state, action: PayloadAction<string | null>) => {
      state.activeNodeId = action.payload;
    },
    setCurrentSectionNumber: (state, action: PayloadAction<number>) => {
      state.currentSectionNumber = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSectionMap: (state) => {
      return initialState;
    },
  },
});

export const {
  setSectionMap,
  setSectionList,
  setActiveNodeId,
  setCurrentSectionNumber,
  setLoading,
  setError,
  resetSectionMap,
} = sectionMapSlice.actions;

export default sectionMapSlice.reducer;
