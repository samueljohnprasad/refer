import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import type { MentalHealthJourneyListItem, JourneyConfig } from "@/src/types/journey";
import type { SectionListItem } from "@/src/types/journey/sectionMap";

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
