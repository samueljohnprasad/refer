import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEnrolledJourneys } from "@/src/lib/api/mentalHealthJourneyApi";
import type { MentalHealthJourneyListItem } from "@/src/types/journey";

export interface EnrolledCoursesData {
  items: MentalHealthJourneyListItem[];
  activeSlug: string | null;
}

export const fetchEnrolledCourses = createAsyncThunk<
  EnrolledCoursesData,
  void,
  { rejectValue: string }
>("enrolledCourses/fetchEnrolledCourses", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchEnrolledJourneys();

    if (!response.success) {
      return rejectWithValue(
        response.error ?? "Failed to fetch enrolled courses",
      );
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
});
