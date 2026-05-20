// hooks/journey/useCourseProgress.ts
// Returns progress metrics for a course: percentage, status, and current node.
// All values are derived from the normalized Redux store via memoized selectors.

import { useAppSelector } from "@/src/store/hooks";
import {
  selectCourseProgressPct,
  selectCourseProgressForCourse,
  selectCurrentNodeForCourse,
} from "@/src/features/journey/journeySelectors";
import type { CourseStatus, Node } from "@/src/types/journeyV5";

export interface UseCourseProgressResult {
  /** Completed nodes as integer percentage 0–100. */
  progressPct: number;
  /** Course-level status from user_course_progress. Undefined if not enrolled. */
  courseStatus: CourseStatus | undefined;
  /** The first non-completed node in course order. Null if the course is done. */
  currentNode: Node | null;
}

/**
 * Returns progress metrics for a course derived entirely from the Redux store.
 * No API calls — all values come from cached state after useJourneyMap loads the course.
 *
 * @param courseId - The course to read progress for
 */
export function useCourseProgress(courseId: string): UseCourseProgressResult {
  const progressPct = useAppSelector((state) =>
    selectCourseProgressPct(state, courseId),
  );
  const courseStatus = useAppSelector((state) =>
    selectCourseProgressForCourse(state, courseId),
  )?.status;
  const currentNode = useAppSelector((state) =>
    selectCurrentNodeForCourse(state, courseId),
  );

  return { progressPct, courseStatus, currentNode };
}
