// hooks/journey/useJourneyFlashListData.ts
// Derives the flat FlashList data array from the normalized v5 Redux store.
// Replaces the old useJourneyDerivedState hook with new-system selectors.

import { useMemo } from "react";
import { useAppSelector } from "@/src/store/hooks";
import type { JourneyFlashListItem, UnitData } from "@/src/types/journey";
import { selectSectionsForCourse } from "@/src/features/journey/journeySelectors";
import type { Unit, Node } from "@/src/types/journeyV5";
import { buildJourneyFlashListData, JourneyLayoutResult } from "@/src/lib/utils/journeyLayout";

/**
 * Returns the flat FlashList data, activeGlobalIndex, and units for a course.
 * Recomputes only when the course structure or node progress changes.
 *
 * @param courseId - The active course id
 * @param selectedSectionId - Optional section id to render only one section
 */
export function useJourneyFlashListData(
  courseId: string,
  selectedSectionId?: string,
): JourneyLayoutResult {
  const sections = useAppSelector((state) =>
    selectSectionsForCourse(state, courseId),
  );
  const unitEntities = useAppSelector((state) => state.journey.units.entities);
  const nodeEntities = useAppSelector((state) => state.journey.nodes.entities);
  const unitsBySection = useAppSelector(
    (state) => state.journey.unitsBySection,
  );
  const nodesByUnit = useAppSelector((state) => state.journey.nodesByUnit);
  const nodeProgress = useAppSelector((state) => state.journey.nodeProgress);

  return useMemo(
    () =>
      buildJourneyFlashListData(
        sections,
        unitEntities as Record<string, Unit | undefined>,
        nodeEntities as Record<string, Node | undefined>,
        unitsBySection,
        nodesByUnit,
        nodeProgress,
        selectedSectionId,
      ),
    [
      sections,
      unitEntities,
      nodeEntities,
      unitsBySection,
      nodesByUnit,
      nodeProgress,
      selectedSectionId,
    ],
  );
}
