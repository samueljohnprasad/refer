import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type {
  MentalHealthJourneyListItem,
  JourneyConfig,
} from "@/src/types/journey";
import type { SectionListItem } from "@/src/types/journey/sectionMap";
import type { RootState } from "@/src/store/store";
import { DEFAULT_JOURNEY_CONFIG } from "@/src/data/journey";
import { fetchEnrolledCourses } from "@/src/store/api/enrolledCoursesApi";

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

interface EnrolledCoursesState {
  data: EnrolledCoursesData | null;
  /** User-overridden section number (from section switcher). Null = use activeSection from API. */
  currentSectionOverride: number | null;
  config: JourneyConfig | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EnrolledCoursesState = {
  data: null,
  currentSectionOverride: null,
  config: DEFAULT_JOURNEY_CONFIG,
  isLoading: false,
  error: null,
};

const enrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState,
  reducers: {
    setEnrolledCourses: (state, action: PayloadAction<EnrolledCoursesData>) => {
      state.data = action.payload;
    },
    setActiveSlug: (state, action: PayloadAction<string | null>) => {
      if (state.data) {
        state.data.activeSlug = action.payload;
      }
      // Reset section override when switching courses
      state.currentSectionOverride = null;
    },
    setCurrentSectionNumber: (state, action: PayloadAction<number>) => {
      state.currentSectionOverride = action.payload;
    },
    resetActiveSlug: (state) => {
      if (state.data) {
        state.data.activeSlug = null;
      }
      state.currentSectionOverride = null;
    },
    resetEnrolledCourses: (state) => {
      state.data = null;
      state.currentSectionOverride = null;
    },
    setJourneyConfig: (state, action: PayloadAction<JourneyConfig>) => {
      state.config = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to fetch enrolled courses";
      });
  },
});

export const {
  setEnrolledCourses,
  setActiveSlug,
  setCurrentSectionNumber,
  resetActiveSlug,
  resetEnrolledCourses,
  setJourneyConfig,
} = enrolledCoursesSlice.actions;

export default enrolledCoursesSlice.reducer;
