import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MentalHealthJourneyListItem } from "@/src/types/journey";

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

interface EnrolledCoursesState {
  data: EnrolledCoursesData | null;
}

const initialState: EnrolledCoursesState = {
  data: null,
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
    },
    resetActiveSlug: (state) => {
      if (state.data) {
        state.data.activeSlug = null;
      }
    },
    resetEnrolledCourses: (state) => {
      state.data = null;
    },
  },
});

export const {
  setEnrolledCourses,
  setActiveSlug,
  resetActiveSlug,
  resetEnrolledCourses,
} = enrolledCoursesSlice.actions;

export default enrolledCoursesSlice.reducer;
