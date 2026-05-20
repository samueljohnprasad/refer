// hooks/journey/useJourneyFlashListData.ts
// Thin hook over the course-scoped layout selector.
// Keeps layout building memoized per course/view instead of rebuilding from
// broad normalized maps on every unrelated store update.

import { useMemo } from "react";
import { useAppSelector } from "@/src/store/hooks";
import { makeSelectJourneyLayoutForCourse } from "@/src/features/journey/journeyLayoutSelectors";
import type { JourneyLayoutResult } from "@/src/lib/utils/journeyLayout";

/**
 * Returns the flat FlashList data, active node indexes, and visible units for a course.
 * Recomputes only when the course structure or node progress changes.
 *
 * @param courseId - The active course id
 * @param renderedSectionId - Optional section id to render in isolation
 */
export function useJourneyFlashListData(
  courseId: string,
  renderedSectionId?: string,
): JourneyLayoutResult {
  const selectJourneyLayout = useMemo(makeSelectJourneyLayoutForCourse, []);

  return useAppSelector((state) =>
    selectJourneyLayout(state, courseId, renderedSectionId),
  );
}
