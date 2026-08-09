// hooks/journey/useJourneyMap.ts
// Lazy-loads the course tree and progress for a given courseId.
// On first visit: fires get-course-tree + get-course-progress in parallel (1 round trip each).
// On return visit: reads from the normalized Redux store instantly — no fetch.
// Auto-enrolls via start-course if get-course-progress returns courseProgress=null.

import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  selectIsCourseLoaded,
  selectIsCourseLoading,
  selectCourseLoadError,
} from "@/src/domains/journey/state/journeySelectors";
import {
  setCourseTree,
  setCourseProgress,
  clearCourseLoadError,
  setCourseLoadFailed,
  setLoadingCourse,
} from "@/src/domains/journey/state/journeySlice";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("JourneyMap");

export interface UseJourneyMapResult {
  /** True while the course tree and progress are being fetched for the first time. */
  isLoading: boolean;
  /** True once the course tree is in the normalized Redux store. */
  isLoaded: boolean;
  error: string | undefined;
  retry: () => void;
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
  const error = useAppSelector((state) =>
    courseId ? selectCourseLoadError(state, courseId) : undefined,
  );

  const retry = useCallback((): void => {
    if (courseId) dispatch(clearCourseLoadError(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    if (!courseId) return;
    if (isLoaded || isLoading || error) return;

    dispatch(setLoadingCourse(courseId));

    // Fire both Edge Functions in parallel — 1 round trip each
    void loadCourseData(courseId, dispatch);
  }, [courseId, isLoaded, isLoading, error, dispatch]);

  return {
    isLoading:
      courseId === null || isLoading || (!isLoaded && !isLoading && !error),
    isLoaded: courseId !== null && isLoaded,
    error,
    retry,
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
  const startedAt = Date.now();
  log.info("course_load_started", { courseId });

  try {
    const [courseTree, progress] = await Promise.all([
      dispatch(
        journeyApi.endpoints.getCourseTree.initiate(courseId, {
          forceRefetch: true,
          subscribe: false,
        }),
      ).unwrap(),
      dispatch(
        journeyApi.endpoints.getCourseProgress.initiate(courseId, {
          forceRefetch: true,
          subscribe: false,
        }),
      ).unwrap(),
    ]);
    const { courseProgress, nodeProgressMap } = progress;
    let finalProgress = progress;

    if (courseProgress === null) {
      log.info("course_enrollment_started", { courseId });
      await dispatch(
        journeyApi.endpoints.startCourse.initiate(courseId),
      ).unwrap();
      const refreshedProgress = await dispatch(
        journeyApi.endpoints.getCourseProgress.initiate(courseId, {
          forceRefetch: true,
          subscribe: false,
        }),
      ).unwrap();
      dispatch(setCourseProgress(refreshedProgress));
      finalProgress = refreshedProgress;
      log.info("course_enrollment_succeeded", { courseId });
    } else {
      dispatch(setCourseProgress({ courseProgress, nodeProgressMap }));
    }

    dispatch(setCourseTree(courseTree));
    log.info("course_load_succeeded", {
      courseId,
      sectionCount: courseTree.sections.length,
      unitCount: courseTree.units.length,
      nodeCount: courseTree.nodes.length,
      progressCount: Object.keys(finalProgress.nodeProgressMap).length,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = getLoadErrorMessage(error);
    log.error("course_load_failed", {
      courseId,
      error: message,
      durationMs: Date.now() - startedAt,
    });
    dispatch(setCourseLoadFailed({ courseId, message }));
  }
}

function getLoadErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "error" in error) {
    return String(error.error);
  }
  return error instanceof Error ? error.message : "Unable to load course.";
}
