import { useCallback, useEffect, useMemo } from "react";

import {
  useGetCourseCatalogQuery,
  useGetEnrolledCourseIdsQuery,
} from "@/src/domains/journey/data/journeyApi";
import { selectActiveCourseId } from "@/src/domains/journey/state/journeySelectors";
import { setActiveCourse } from "@/src/domains/journey/state/journeySlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export interface UseActiveCourseResult {
  /** Active course to render. Null only while first-time enrollment resolution is in flight. */
  courseId: string | null;
  /** True while the enrolled courses query is in flight. */
  isLoading: boolean;
  /** Error string if the enrolled courses query failed. */
  error: string | undefined;
  retry: () => void;
  /** Updates the globally active course. */
  setActiveCourseId: (courseId: string | null) => void;
}

// ponytail: prioritize user-selected active course, fall back to enrolled courses, never auto-select un-enrolled catalog[0]
function resolveActiveCourseId(
  activeCourseId: string | null,
  enrolledIds: string[] | undefined,
  catalogIds: string[] | undefined,
  isLoading: boolean,
): string | null {
  if (!activeCourseId && isLoading) {
    return null;
  }

  // 1. If active course is an enrolled course, preserve it
  if (activeCourseId && enrolledIds?.includes(activeCourseId)) {
    return activeCourseId;
  }

  // 2. If active course was explicitly set and exists in catalog (e.g. selected in onboarding), preserve it
  if (activeCourseId && catalogIds?.includes(activeCourseId)) {
    return activeCourseId;
  }

  // 3. Fall back to user's enrolled courses if available
  if (enrolledIds && enrolledIds.length > 0) {
    return enrolledIds[0];
  }

  // 4. If user has no enrollments and no active choice, return null (never auto-enroll catalog[0])
  return null;
}

export function useActiveCourse(
  initialCourseId?: string,
): UseActiveCourseResult {
  const dispatch = useAppDispatch();
  const activeCourseId = useAppSelector(selectActiveCourseId);
  const enrolledCoursesQuery = useGetEnrolledCourseIdsQuery();
  const courseCatalogQuery = useGetCourseCatalogQuery();
  const {
    data: enrolledIds,
    isLoading: isLoadingEnrollments,
    error: enrollmentError,
  } = enrolledCoursesQuery;
  const {
    data: courseCatalog,
    isLoading: isLoadingCatalog,
    error: catalogError,
  } = courseCatalogQuery;
  const isLoading = isLoadingEnrollments || isLoadingCatalog;
  const error = enrollmentError ?? catalogError;
  const resolvedCourseId = useMemo(
    () => {
      if (initialCourseId) {
        return initialCourseId;
      }
      return resolveActiveCourseId(
        activeCourseId,
        enrolledIds,
        courseCatalog?.map((course) => course.id),
        isLoading,
      );
    },
    [activeCourseId, courseCatalog, enrolledIds, initialCourseId, isLoading],
  );

  useEffect(() => {
    if (resolvedCourseId === activeCourseId) return;
    dispatch(setActiveCourse(resolvedCourseId));
  }, [activeCourseId, dispatch, resolvedCourseId]);

  const setActiveCourseId = useCallback(
    (courseId: string | null): void => {
      dispatch(setActiveCourse(courseId));
    },
    [dispatch],
  );

  return {
    courseId: resolvedCourseId,
    isLoading,
    error: getQueryErrorMessage(error),
    retry: () => {
      void enrolledCoursesQuery.refetch();
      void courseCatalogQuery.refetch();
    },
    setActiveCourseId,
  };
}

function getQueryErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "object" && "error" in error) {
    return String(error.error);
  }
  return error instanceof Error ? error.message : String(error);
}
