// hooks/journey/useCurrentNode.ts
// Returns the current node — the first non-completed, unlocked node in a course.
// Thin selector wrapper. "Current node" is a UI concept; it is not stored in the DB.

import { useAppSelector } from "@/src/store/hooks";
import { selectCurrentNode } from "@/src/features/journey/journeySelectors";
import type { Node } from "@/src/types/journeyV5";

/**
 * Returns the current node for a course — the first node with status
 * not_started, in_progress, or attempted (in sequential order).
 *
 * Returns null if:
 * - All nodes are completed (course is done)
 * - No progress rows exist (user not yet started)
 * - The course is not yet loaded in the store
 *
 * @param courseId - The active course id
 */
export function useCurrentNode(courseId: string): Node | null {
  return useAppSelector((state) => selectCurrentNode(state, courseId));
}
