// domains/journey/state/courseEnrollmentSelectors.ts
// Pure memoized selectors for course capacity and enrollment eligibility.

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import { ENROLLMENT_POLICY } from "@/src/domains/journey/config/enrollmentConfig";
import type { CourseCapacityState } from "@/src/types/journey/enrollment";

// ponytail: select existing RTK Query cache entries without extra network calls
const selectEnrolledResult = journeyApi.endpoints.getEnrolledCourses.select();

export const selectEnrolledCoursesList = createSelector(
  [(state: RootState) => selectEnrolledResult(state)?.data],
  (enrolledCourses = []) => enrolledCourses,
);

export const selectInProgressCoursesCount = createSelector(
  [selectEnrolledCoursesList],
  (enrolledCourses): number => {
    return enrolledCourses.filter((course) => course.status === "in_progress").length;
  },
);

export const selectCanEnrollInCourse = createSelector(
  [selectInProgressCoursesCount],
  (inProgressCount): boolean => {
    return inProgressCount < ENROLLMENT_POLICY.MAX_IN_PROGRESS_COURSES;
  },
);

export const selectCourseCapacityState = createSelector(
  [selectInProgressCoursesCount, selectCanEnrollInCourse],
  (inProgressCount, canEnroll): CourseCapacityState => {
    const maxCapacityLimit = ENROLLMENT_POLICY.MAX_IN_PROGRESS_COURSES;
    return {
      inProgressCount,
      maxCapacityLimit,
      isAtCapacityLimit: inProgressCount >= maxCapacityLimit,
      canEnroll,
    };
  },
);
