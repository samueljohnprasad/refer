import { useCallback, useEffect, useMemo } from "react";

import { useGetEnrolledCourseIdsQuery } from "@/src/domains/journey/data/journeyApi";
import { selectActiveCourseId } from "@/src/domains/journey/state/journeySelectors";
import { setActiveCourse } from "@/src/domains/journey/state/journeySlice";
import { JOURNEY } from "@/src/lib/constants/journey";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export interface UseActiveCourseResult {
  /** Active course to render. Null only while first-time enrollment resolution is in flight. */
  courseId: string | null;
  /** True while the enrolled courses query is in flight. */
  isLoading: boolean;
  /** Error string if the enrolled courses query failed. */
  error: string | undefined;
  /** Updates the globally active course. */
  setActiveCourseId: (courseId: string | null) => void;
}

function resolveActiveCourseId(
  activeCourseId: string | null,
  enrolledIds: string[] | undefined,
  isLoading: boolean,
  hasError: boolean,
): string | null {
  if (!activeCourseId && isLoading) {
    return null;
  }

  const resolvedEnrolledIds = enrolledIds ?? [];
  const hasEnrollments = resolvedEnrolledIds.length > 0;

  if (activeCourseId) {
    if (isLoading || hasError || enrolledIds === undefined) {
      return activeCourseId;
    }

    if (resolvedEnrolledIds.includes(activeCourseId)) {
      return activeCourseId;
    }

    if (activeCourseId === JOURNEY.DEFAULT_COURSE_ID && !hasEnrollments) {
      return activeCourseId;
    }
  }

  if (hasEnrollments) {
    return resolvedEnrolledIds[0] ?? JOURNEY.DEFAULT_COURSE_ID;
  }

  return JOURNEY.DEFAULT_COURSE_ID;
}

export function useActiveCourse(): UseActiveCourseResult {
  const dispatch = useAppDispatch();
  const activeCourseId = useAppSelector(selectActiveCourseId);
  const {
    data: enrolledIds,
    isLoading,
    error,
  } = useGetEnrolledCourseIdsQuery();
  const resolvedCourseId = useMemo(
    () =>
      resolveActiveCourseId(
        activeCourseId,
        enrolledIds,
        isLoading,
        Boolean(error),
      ),
    [activeCourseId, enrolledIds, error, isLoading],
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
    error: error ? String(error) : undefined,
    setActiveCourseId,
  };
}
