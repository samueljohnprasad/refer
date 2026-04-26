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

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

const selectEnrolledCoursesState = (state: RootState) => state.enrolledCourses;

export const selectActiveCourse = createSelector(
  selectEnrolledCoursesState,
  (ec): MentalHealthJourneyListItem | undefined => {
    const slug = ec.data?.activeSlug;
    if (!slug) return undefined;
    return ec.data?.items?.find((c) => c.slug === slug);
  },
);

export const selectCurrentSectionNumber = createSelector(
  selectEnrolledCoursesState,
  selectActiveCourse,
  (ec, activeCourse): number =>
    ec.currentSectionOverride ?? activeCourse?.activeSection ?? 1,
);

export const selectCurrentSection = createSelector(
  selectActiveCourse,
  selectCurrentSectionNumber,
  (activeCourse, sectionNumber): SectionListItem | undefined =>
    activeCourse?.sections?.find((s) => s.sectionNumber === sectionNumber),
);

export const selectSectionTitle = createSelector(
  selectCurrentSection,
  (section): string => section?.title ?? "",
);

export const selectSectionList = createSelector(
  selectActiveCourse,
  (activeCourse): SectionListItem[] => activeCourse?.sections ?? [],
);

export const selectJourneyConfig = createSelector(
  selectEnrolledCoursesState,
  (state): JourneyConfig | null => state.config,
);

export default enrolledCoursesSlice.reducer;
