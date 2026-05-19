import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/src/store/store";
import type {
  Section,
  Unit,
  Node,
  UserNodeProgress,
} from "@/src/types/journeyV5";
import {
  buildJourneyFlashListData,
  type JourneyLayoutResult,
} from "@/src/lib/utils/journeyLayout";
import {
  selectNodeEntities,
  selectNodeProgressMap,
  selectNodesByUnitIndex,
  selectUnitEntities,
  selectUnitsBySectionIndex,
} from "./journeySelectorBase";
import { selectSectionsForCourse } from "./journeySelectors";

const EMPTY_LAYOUT: JourneyLayoutResult = {
  flashListData: [],
  activeGlobalIndex: -1,
  units: [],
};

const selectRenderedSectionIdParam = (
  _: RootState,
  _courseId: string,
  renderedSectionId?: string,
) => renderedSectionId;

function collectCourseUnitIds(
  sections: Section[],
  unitsBySection: Record<string, string[]>,
): string[] {
  return sections.flatMap((section) => unitsBySection[section.id] ?? []);
}

function collectVisibleNodeIds(
  sections: Section[],
  unitsBySection: Record<string, string[]>,
  nodesByUnit: Record<string, string[]>,
  renderedSectionId?: string,
): string[] {
  return sections.flatMap((section) => {
    if (renderedSectionId !== undefined && section.id !== renderedSectionId) {
      return [];
    }

    return (unitsBySection[section.id] ?? []).flatMap(
      (unitId) => nodesByUnit[unitId] ?? [],
    );
  });
}

function areArraysEqual<T>(
  previous: readonly T[],
  current: readonly T[],
): boolean {
  if (previous.length !== current.length) {
    return false;
  }

  return previous.every((value, index) => value === current[index]);
}

interface LayoutSnapshot {
  renderedSectionId?: string;
  sectionIds: string[];
  sectionRefs: Array<Section | undefined>;
  unitIds: string[];
  unitRefs: Array<Unit | undefined>;
  visibleNodeIds: string[];
  nodeRefs: Array<Node | undefined>;
  progressRefs: Array<UserNodeProgress | undefined>;
}

function hasSameSnapshot(
  previous: LayoutSnapshot | null,
  current: LayoutSnapshot,
): boolean {
  if (!previous) {
    return false;
  }

  if (previous.renderedSectionId !== current.renderedSectionId) {
    return false;
  }

  return (
    areArraysEqual(previous.sectionIds, current.sectionIds) &&
    areArraysEqual(previous.sectionRefs, current.sectionRefs) &&
    areArraysEqual(previous.unitIds, current.unitIds) &&
    areArraysEqual(previous.unitRefs, current.unitRefs) &&
    areArraysEqual(previous.visibleNodeIds, current.visibleNodeIds) &&
    areArraysEqual(previous.nodeRefs, current.nodeRefs) &&
    areArraysEqual(previous.progressRefs, current.progressRefs)
  );
}

function createLayoutSnapshot(
  sections: Section[],
  unitsBySection: Record<string, string[]>,
  nodesByUnit: Record<string, string[]>,
  unitEntities: Record<string, Unit | undefined>,
  nodeEntities: Record<string, Node | undefined>,
  nodeProgress: Record<string, UserNodeProgress>,
  renderedSectionId?: string,
): LayoutSnapshot {
  const sectionIds = sections.map((section) => section.id);
  const sectionRefs = sections.map((section) => section);
  const unitIds = collectCourseUnitIds(sections, unitsBySection);
  const unitRefs = unitIds.map((unitId) => unitEntities[unitId]);
  const visibleNodeIds = collectVisibleNodeIds(
    sections,
    unitsBySection,
    nodesByUnit,
    renderedSectionId,
  );
  const nodeRefs = visibleNodeIds.map((nodeId) => nodeEntities[nodeId]);
  const progressRefs = visibleNodeIds.map((nodeId) => nodeProgress[nodeId]);

  return {
    renderedSectionId,
    sectionIds,
    sectionRefs,
    unitIds,
    unitRefs,
    visibleNodeIds,
    nodeRefs,
    progressRefs,
  };
}

export function makeSelectJourneyLayoutForCourse() {
  let previousSnapshot: LayoutSnapshot | null = null;
  let previousLayout: JourneyLayoutResult = EMPTY_LAYOUT;

  return createSelector(
    [
      selectSectionsForCourse,
      selectUnitEntities,
      selectNodeEntities,
      selectUnitsBySectionIndex,
      selectNodesByUnitIndex,
      selectNodeProgressMap,
      selectRenderedSectionIdParam,
    ],
    (
      sections,
      unitEntities,
      nodeEntities,
      unitsBySection,
      nodesByUnit,
      nodeProgress,
      renderedSectionId,
    ): JourneyLayoutResult => {
      if (sections.length === 0) {
        previousSnapshot = null;
        previousLayout = EMPTY_LAYOUT;
        return previousLayout;
      }

      const nextSnapshot = createLayoutSnapshot(
        sections,
        unitsBySection,
        nodesByUnit,
        unitEntities as Record<string, Unit | undefined>,
        nodeEntities as Record<string, Node | undefined>,
        nodeProgress,
        renderedSectionId,
      );

      if (hasSameSnapshot(previousSnapshot, nextSnapshot)) {
        return previousLayout;
      }

      previousSnapshot = nextSnapshot;
      previousLayout = buildJourneyFlashListData(
        sections,
        unitEntities as Record<string, Unit | undefined>,
        nodeEntities as Record<string, Node | undefined>,
        unitsBySection,
        nodesByUnit,
        nodeProgress,
        renderedSectionId,
      );

      return previousLayout;
    },
  );
}
