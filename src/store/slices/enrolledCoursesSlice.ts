import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type { MentalHealthJourneyListItem } from "@/src/types/journey";
import type { SectionListItem } from "@/src/types/journey/sectionMap";
import type { RootState } from "@/src/store/store";

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

interface EnrolledCoursesState {
  data: EnrolledCoursesData | null;
  /** User-overridden section number (from section switcher). Null = use activeSection from API. */
  currentSectionOverride: number | null;
}

const initialState: EnrolledCoursesState = {
  data: null,
  currentSectionOverride: null,
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
  },
});

export const {
  setEnrolledCourses,
  setActiveSlug,
  setCurrentSectionNumber,
  resetActiveSlug,
  resetEnrolledCourses,
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

export default enrolledCoursesSlice.reducer;
