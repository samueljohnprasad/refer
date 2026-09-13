// domains/journey/state/courseRecommendationSelectors.ts
// Pure memoized selector for next course recommendation post-completion.

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import type { Course } from "@/src/types/journeyV5";
import {
  selectCourseEntities,
  selectCourseProgressMap,
} from "./journeySelectorBase";
import { selectIsCourseCompleteForCourse } from "./journeySelectors";
import type { NextCourseRecommendation } from "@/specs/019-next-journey-bridge/contracts/NextJourneyBridgeContract";

// ponytail: select existing RTK Query cache entries without extra network calls
const selectCatalogResult = journeyApi.endpoints.getCourseCatalog.select();
const selectEnrolledResult = journeyApi.endpoints.getEnrolledCourses.select();

export const selectNextCourseRecommendation = createSelector(
  [
    (state: RootState) => selectCatalogResult(state),
    (state: RootState) => selectEnrolledResult(state)?.data,
    selectCourseProgressMap,
    selectCourseEntities,
    (state: RootState, courseId: string) =>
      selectIsCourseCompleteForCourse(state, courseId),
    (_state: RootState, courseId: string) => courseId,
  ],
  (
    catalogResult,
    enrolledCourses = [],
    courseProgressMap,
    courseEntities,
    isActiveCourseComplete,
    courseId,
  ): NextCourseRecommendation => {
    const catalogCourses = catalogResult?.data ?? [];
    const isCatalogSuccess = !!catalogResult?.isSuccess;

    // 1. Check if the active course is completed
    const activeProgress = courseProgressMap[courseId];
    const enrolledActive = enrolledCourses?.find((c) => c.id === courseId);
    const isCompleted =
      isActiveCourseComplete ||
      activeProgress?.status === "completed" ||
      enrolledActive?.status === "completed";

    if (!isCompleted) {
      return {
        isCompleted: false,
        nextCourse: null,
        isAllCoursesCompleted: false,
      };
    }

    // 2. Identify available courses (catalog items or loaded entities)
    const coursesList =
      catalogCourses.length > 0
        ? catalogCourses
        : (Object.values(courseEntities).filter(Boolean) as Course[]);

    // 3. Sort courses by orderIndex ascending
    const sortedCourses = [...coursesList].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
    );

    const isCourseCompleted = (id: string) => {
      if (id === courseId) return true;
      const progress = courseProgressMap[id];
      if (progress?.status === "completed") return true;
      const enrolled = enrolledCourses?.find((c) => c.id === id);
      if (enrolled?.status === "completed") return true;
      return false;
    };

    // 4. Find first uncompleted course
    const uncompletedCourses = sortedCourses.filter(
      (c) => !isCourseCompleted(c.id),
    );

    if (uncompletedCourses.length === 0) {
      // ponytail: only mark all completed if catalog query resolved with data
      const isAllDone = isCatalogSuccess && catalogCourses.length > 0;
      return {
        isCompleted: true,
        nextCourse: null,
        isAllCoursesCompleted: isAllDone,
      };
    }

    const candidate = uncompletedCourses[0];
    const nextCourse: Course = {
      id: candidate.id,
      title: candidate.title,
      description: candidate.description ?? "",
      iconUrl: candidate.iconUrl ?? "",
      colorHex: candidate.colorHex ?? "4F46E5",
      orderIndex: candidate.orderIndex ?? 0,
      isPublished: true,
      rewardContent: (candidate as Course).rewardContent ?? null,
    };

    return {
      isCompleted: true,
      nextCourse,
      isAllCoursesCompleted: false,
    };
  },
);
