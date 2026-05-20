// hooks/journey/useCurrentNode.ts
// Returns the current node — the first non-completed, unlocked node in a course.
// Thin selector wrapper. "Current node" is a UI concept; it is not stored in the DB.

import { useAppSelector } from "@/src/store/hooks";
import { selectCurrentNodeForCourse } from "@/src/features/journey/journeySelectors";
import type { Node } from "@/src/types/journeyV5";

/**
 * Returns the current node for a course — the first node in course order
 * without a completed progress row.
 *
 * Returns null if:
 * - All nodes are completed (course is done)
 * - The course is not yet loaded in the store
 *
 * @param courseId - The active course id
 */
export function useCurrentNode(courseId: string): Node | null {
  return useAppSelector((state) => selectCurrentNodeForCourse(state, courseId));
}
