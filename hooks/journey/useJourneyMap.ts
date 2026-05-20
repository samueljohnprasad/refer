// hooks/journey/useJourneyMap.ts
// Lazy-loads the course tree and progress for a given courseId.
// On first visit: fires get-course-tree + get-course-progress in parallel (1 round trip each).
// On return visit: reads from the normalized Redux store instantly — no fetch.
// Auto-enrolls via start-course if get-course-progress returns courseProgress=null.

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  selectIsCourseLoaded,
  selectIsCourseLoading,
} from "@/src/features/journey/journeySelectors";
import {
  setCourseTree,
  setCourseProgress,
  setLoadingCourse,
} from "@/src/features/journey/journeySlice";
import { journeyApi } from "@/src/features/journey/journeyApi";

export interface UseJourneyMapResult {
  /** True while the course tree and progress are being fetched for the first time. */
  isLoading: boolean;
  /** True once the course tree is in the normalized Redux store. */
  isLoaded: boolean;
}

/**
 * Manages lazy loading of a course into the normalized Redux store.
 *
 * Fires getCourseTree + getCourseProgress in parallel on the first visit.
 * Subsequent visits return immediately — data is already in the store.
 * If the user is not yet enrolled, calls start-course (auto-enrollment).
 *
 * @param courseId - The course to load. Null while active-course resolution is in flight.
 */
export function useJourneyMap(courseId: string | null): UseJourneyMapResult {
  const dispatch = useAppDispatch();
  const isLoaded = useAppSelector((state) =>
    courseId ? selectIsCourseLoaded(state, courseId) : false,
  );
  const isLoading = useAppSelector((state) =>
    courseId ? selectIsCourseLoading(state, courseId) : false,
  );

  useEffect(() => {
    if (!courseId) return;
    if (isLoaded || isLoading) return;

    dispatch(setLoadingCourse(courseId));

    // Fire both Edge Functions in parallel — 1 round trip each
    void loadCourseData(courseId, dispatch);
  }, [courseId, isLoaded, isLoading, dispatch]);

  return {
    isLoading: courseId === null || isLoading || (!isLoaded && !isLoading),
    isLoaded: courseId !== null && isLoaded,
  };
}

/**
 * Loads course tree and progress in parallel.
 * Auto-enrolls (calls start-course) if progress is null.
 */
async function loadCourseData(
  courseId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
): Promise<void> {
  const [treeResult, progressResult] = await Promise.all([
    dispatch(journeyApi.endpoints.getCourseTree.initiate(courseId)),
    dispatch(journeyApi.endpoints.getCourseProgress.initiate(courseId)),
  ]);

  if ("data" in treeResult && treeResult.data) {
    dispatch(setCourseTree(treeResult.data));
  }

  if ("data" in progressResult && progressResult.data) {
    const { courseProgress, nodeProgressMap } = progressResult.data;

    // A started course can legitimately have zero node progress rows because
    // "current node" is derived from completion history instead of pre-created
    // untouched next-node rows.
    if (courseProgress === null) {
      const startResult = await dispatch(
        journeyApi.endpoints.startCourse.initiate(courseId),
      );

      if ("data" in startResult) {
        // Refetch progress after enrollment
        const refetchResult = await dispatch(
          journeyApi.endpoints.getCourseProgress.initiate(courseId, {
            forceRefetch: true,
          }),
        );
        if ("data" in refetchResult && refetchResult.data) {
          dispatch(setCourseProgress(refetchResult.data));
        }
      }
    } else {
      dispatch(setCourseProgress({ courseProgress, nodeProgressMap }));
    }
  }
}
