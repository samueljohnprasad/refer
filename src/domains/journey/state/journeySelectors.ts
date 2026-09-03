// domains/journey/state/journeySelectors.ts
// All memoized selectors for the Journey Map normalized store.
// Every selector uses relationship indexes — no .filter() from root.
// O(1) primitives, O(k) index lookups, O(n) traversal with early return for current node.

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";
import type {
  Node,
  Section,
  NodeStatus,
  DerivedStatus,
  CourseHeaderSummary,
} from "@/src/types/journeyV5";
import {
  findCurrentNodeIdInCourse,
  resolveDerivedStatusFromNodeIds,
} from "@/src/lib/journey/journeyProgress";
import {
  selectActiveCourseIdState,
  selectActiveNodeModalIdByCourseMap,
  selectCourseEntities,
  selectCourseLoadErrorsMap,
  selectCourseIdParam,
  selectCourseProgressMap,
  selectLoadedCoursesMap,
  selectLoadingCoursesMap,
  selectNodeEntities,
  selectNodeIdParam,
  selectNodeProgressMap,
  selectNodesByUnitIndex,
  selectPreviewSectionIdByCourseMap,
  selectRootState,
  selectSectionEntities,
  selectSectionIdParam,
  selectSectionsByCourseIndex,
  selectUnitEntities,
  selectUnitIdParam,
  selectUnitsBySectionIndex,
  selectPendingCelebrationMap,
  selectCourseFinaleSeenMap,
} from "./journeySelectorBase";

interface RenderedUnitView {
  id: string;
  title: string;
  unitNumber: number;
  iconKey: string | null;
  colorThemeKey: string;
}

interface RenderedJourneyView {
  renderedSection: Section | null;
  renderedUnit: RenderedUnitView | null;
}

// ── O(1) entity primitives ────────────────────────────────────────────────────

/** Returns the course entity by id, or undefined if not in store. */
export const selectCourse = (state: RootState, courseId: string) =>
  selectCourseEntities(state)[courseId];

/** Returns the section entity by id, or undefined if not in store. */
export const selectSection = (state: RootState, sectionId: string) =>
  selectSectionEntities(state)[sectionId];

/** Returns the unit entity by id, or undefined if not in store. */
export const selectUnit = (state: RootState, unitId: string) =>
  selectUnitEntities(state)[unitId];

/** Returns the node entity by id, or undefined if not in store. */
export const selectNode = (state: RootState, nodeId: string) =>
  selectNodeEntities(state)[nodeId];

// ── Loading state ─────────────────────────────────────────────────────────────

/** Returns true if this course's tree is already in the Redux store. */
export const selectIsCourseLoaded = createSelector(
  [selectLoadedCoursesMap, selectCourseIdParam],
  (loadedCourses, courseId): boolean => !!loadedCourses[courseId],
);

/** Returns true if this course's tree is currently being fetched. */
export const selectIsCourseLoading = createSelector(
  [selectLoadingCoursesMap, selectCourseIdParam],
  (loadingCourses, courseId): boolean => !!loadingCourses[courseId],
);

export const selectCourseLoadError = createSelector(
  [selectCourseLoadErrorsMap, selectCourseIdParam],
  (courseLoadErrors, courseId): string | undefined =>
    courseLoadErrors[courseId],
);

/** Returns courseProgress for a course, or undefined if not enrolled. */
export const selectCourseProgressForCourse = createSelector(
  [selectCourseProgressMap, selectCourseIdParam],
  (courseProgressMap, courseId) => courseProgressMap[courseId],
);

// ── Index selectors — O(k), never scans full entity store ─────────────────────

export const selectSectionIdsForCourse = createSelector(
  [selectSectionsByCourseIndex, selectCourseIdParam],
  (sectionsByCourse, courseId): string[] => sectionsByCourse[courseId] ?? [],
);

export const selectUnitIdsForSection = createSelector(
  [selectUnitsBySectionIndex, selectSectionIdParam],
  (unitsBySection, sectionId): string[] => unitsBySection[sectionId] ?? [],
);

export const selectNodeIdsForUnit = createSelector(
  [selectNodesByUnitIndex, selectUnitIdParam],
  (nodesByUnit, unitId): string[] => nodesByUnit[unitId] ?? [],
);

/**
 * Returns sections for a course in order.
 * Uses sectionsByCourse index — O(k) where k = sections in course.
 */
export const selectSectionsForCourse = createSelector(
  [selectSectionIdsForCourse, selectSectionEntities],
  (sectionIds, entities) =>
    sectionIds
      .map((id) => entities[id])
      .filter((s): s is NonNullable<typeof s> => s !== undefined),
);

/**
 * Returns units for a section in order.
 * Uses unitsBySection index — O(k) where k = units in section.
 */
export const selectUnitsForSection = createSelector(
  [selectUnitIdsForSection, selectUnitEntities],
  (unitIds, entities) =>
    unitIds
      .map((id) => entities[id])
      .filter((u): u is NonNullable<typeof u> => u !== undefined),
);

/**
 * Returns nodes for a unit in order.
 * Uses nodesByUnit index — O(k) where k = nodes in unit.
 */
export const selectNodesForUnit = createSelector(
  [selectNodeIdsForUnit, selectNodeEntities],
  (nodeIds, entities) =>
    nodeIds
      .map((id) => entities[id])
      .filter((n): n is NonNullable<typeof n> => n !== undefined),
);

// ── Status selectors ──────────────────────────────────────────────────────────

/**
 * Returns the stored status of a single node.
 * O(1) — direct map lookup. No array scan.
 * Returns 'locked' if no progress row exists.
 */
export const selectNodeStatus = createSelector(
  [selectNodeProgressMap, selectNodeIdParam],
  (nodeProgress, nodeId): NodeStatus =>
    nodeProgress[nodeId]?.status ?? "locked",
);

/**
 * Returns the progress row for a single node, or undefined if not started yet.
 */
export const selectNodeProgressForNode = createSelector(
  [selectNodeProgressMap, selectNodeIdParam],
  (nodeProgress, nodeId) => nodeProgress[nodeId],
);

/**
 * Returns the derived status of a unit based on its child node statuses.
 * Uses nodesByUnit index — O(k) traversal.
 */
export const selectUnitStatus = createSelector(
  [
    selectUnitIdParam,
    selectNodeIdsForUnit,
    selectUnitEntities,
    selectSectionEntities,
    selectSectionsByCourseIndex,
    selectUnitsBySectionIndex,
    selectNodesByUnitIndex,
    selectNodeProgressMap,
  ],
  (
    unitId,
    nodeIds,
    unitEntities,
    sectionEntities,
    sectionsByCourse,
    unitsBySection,
    nodesByUnit,
    nodeProgress,
  ): DerivedStatus => {
    const unit = unitEntities[unitId];
    if (!unit) {
      return "locked";
    }

    const section = sectionEntities[unit.sectionId];
    if (!section) {
      return "locked";
    }

    const currentNodeId = findCurrentNodeIdInCourse(
      sectionsByCourse[section.courseId] ?? [],
      unitsBySection,
      nodesByUnit,
      nodeProgress,
    );

    return resolveDerivedStatusFromNodeIds(
      nodeIds,
      currentNodeId,
      nodeProgress,
    );
  },
);

/**
 * Returns the derived status of a section based on its child unit statuses.
 * Uses unitsBySection + nodesByUnit indexes.
 */
export const selectSectionStatus = createSelector(
  [
    selectSectionIdParam,
    selectSectionEntities,
    selectSectionsByCourseIndex,
    selectNodesByUnitIndex,
    selectUnitsBySectionIndex,
    selectNodeProgressMap,
  ],
  (
    sectionId,
    sectionEntities,
    sectionsByCourse,
    nodesByUnit,
    unitsBySection,
    nodeProgress,
  ): DerivedStatus => {
    const section = sectionEntities[sectionId];
    if (!section) {
      return "locked";
    }

    const unitIds = unitsBySection[sectionId] ?? [];
    const nodeIds = unitIds.flatMap((unitId) => nodesByUnit[unitId] ?? []);
    const currentNodeId = findCurrentNodeIdInCourse(
      sectionsByCourse[section.courseId] ?? [],
      unitsBySection,
      nodesByUnit,
      nodeProgress,
    );

    return resolveDerivedStatusFromNodeIds(
      nodeIds,
      currentNodeId,
      nodeProgress,
    );
  },
);

// ── Current node ──────────────────────────────────────────────────────────────

const COLOR_THEME_CYCLE = ["green", "blue", "purple", "orange"] as const;
const DEFAULT_COLOR_THEME_KEY = "green";

const selectVisibleUnitIdParam = (
  _: RootState,
  _courseId: string,
  visibleUnitId: string | null,
) => visibleUnitId;

export const selectCurrentNodeIdForCourse = createSelector(
  [
    selectSectionIdsForCourse,
    selectUnitsBySectionIndex,
    selectNodesByUnitIndex,
    selectNodeProgressMap,
  ],
  (sectionIds, unitsBySection, nodesByUnit, nodeProgress): string | null =>
    findCurrentNodeIdInCourse(
      sectionIds,
      unitsBySection,
      nodesByUnit,
      nodeProgress,
    ),
);

/**
 * Returns the current node for a course — the first non-completed node.
 *
 * "Current" is a UI-only concept. NOT stored in the database.
 * The current node is the first node in course order without a completed row.
 * Returns null if all nodes are completed.
 *
 * O(n) traversal of indexes with early return. Never scans the full entity store.
 */
export const selectCurrentNodeForCourse = createSelector(
  [selectCurrentNodeIdForCourse, selectNodeEntities],
  (currentNodeId, nodeEntities): Node | null =>
    currentNodeId ? (nodeEntities[currentNodeId] ?? null) : null,
);

export const selectCurrentNode = selectCurrentNodeForCourse;

export const selectCurrentUnitIdForCourse = createSelector(
  [selectCurrentNodeForCourse],
  (currentNode): string | null => currentNode?.unitId ?? null,
);

export const selectCurrentSectionIdForCourse = createSelector(
  [selectCurrentUnitIdForCourse, selectUnitEntities],
  (currentUnitId, unitEntities): string | null => {
    if (!currentUnitId) {
      return null;
    }

    return unitEntities[currentUnitId]?.sectionId ?? null;
  },
);

export const selectDefaultSectionIdForCourse = createSelector(
  [
    selectCurrentSectionIdForCourse,
    selectSectionIdsForCourse,
    selectCourseProgressForCourse,
  ],
  (currentSectionId, sectionIds, courseProgress): string | null => {
    if (currentSectionId) {
      return currentSectionId;
    }

    if (sectionIds.length === 0) {
      return null;
    }

    const fallbackSectionIndex =
      courseProgress?.status === "completed" ? sectionIds.length - 1 : 0;

    return sectionIds[fallbackSectionIndex] ?? null;
  },
);

/**
 * Returns the section the journey should show by default for a course.
 * - If there is a current node, returns that node's parent section.
 * - If the course is completed, returns the last section.
 * - Otherwise falls back to the first section while progress is initializing.
 */
export const selectCurrentSectionForCourse = createSelector(
  [selectDefaultSectionIdForCourse, selectSectionEntities],
  (sectionId, sectionEntities): Section | null =>
    sectionId ? (sectionEntities[sectionId] ?? null) : null,
);

export const selectCurrentSectionNumberForCourse = createSelector(
  [selectCurrentSectionForCourse],
  (currentSection): number => currentSection?.orderIndex ?? 1,
);

export const selectPreviewSectionIdForCourse = createSelector(
  [selectPreviewSectionIdByCourseMap, selectCourseIdParam],
  (previewSectionIdsByCourse, courseId): string | null =>
    previewSectionIdsByCourse[courseId] ?? null,
);

/**
 * Returns the course-scoped preview section when the user is intentionally
 * browsing away from the progress-derived current section.
 */
export const selectPreviewSectionForCourse = createSelector(
  [
    selectPreviewSectionIdForCourse,
    selectSectionIdsForCourse,
    selectSectionEntities,
    selectCurrentSectionForCourse,
  ],
  (
    previewSectionId,
    courseSectionIds,
    sectionEntities,
    currentSection,
  ): Section | null => {
    if (!previewSectionId) {
      return null;
    }

    const previewSectionBelongsToCourse =
      courseSectionIds.includes(previewSectionId);
    if (!previewSectionBelongsToCourse) {
      return null;
    }

    if (previewSectionId === currentSection?.id) {
      return null;
    }

    return sectionEntities[previewSectionId] ?? null;
  },
);

/**
 * Returns the section the journey should currently render for a course.
 * Preview wins when present; otherwise we fall back to the current section.
 */
export const selectRenderedSectionForCourse = createSelector(
  [selectPreviewSectionForCourse, selectCurrentSectionForCourse],
  (previewSection, currentSection): Section | null =>
    previewSection ?? currentSection,
);

export const selectRenderedSectionIdForCourse = createSelector(
  [selectRenderedSectionForCourse],
  (renderedSection): string | null => renderedSection?.id ?? null,
);

export const selectOrderedUnitIdsForCourse = createSelector(
  [selectSectionIdsForCourse, selectUnitsBySectionIndex],
  (sectionIds, unitsBySection): string[] =>
    sectionIds.flatMap((sectionId) => unitsBySection[sectionId] ?? []),
);

export const selectRenderedUnitIdsForCourse = createSelector(
  [selectRenderedSectionIdForCourse, selectUnitsBySectionIndex],
  (renderedSectionId, unitsBySection): string[] =>
    renderedSectionId ? (unitsBySection[renderedSectionId] ?? []) : [],
);

function resolveRenderedUnitId(
  currentUnitId: string | null,
  renderedUnitIds: string[],
  visibleUnitId: string | null,
): string | null {
  if (visibleUnitId && renderedUnitIds.includes(visibleUnitId)) {
    return visibleUnitId;
  }

  if (currentUnitId && renderedUnitIds.includes(currentUnitId)) {
    return currentUnitId;
  }

  return renderedUnitIds[0] ?? null;
}

export const selectRenderedUnitIdForCourse = createSelector(
  [
    selectCurrentUnitIdForCourse,
    selectRenderedUnitIdsForCourse,
    selectVisibleUnitIdParam,
  ],
  (currentUnitId, renderedUnitIds, visibleUnitId): string | null =>
    resolveRenderedUnitId(currentUnitId, renderedUnitIds, visibleUnitId),
);

export const selectRenderedUnitForCourse = createSelector(
  [
    selectRenderedUnitIdForCourse,
    selectOrderedUnitIdsForCourse,
    selectUnitEntities,
  ],
  (renderedUnitId, orderedUnitIds, unitEntities): RenderedUnitView | null => {
    if (!renderedUnitId) {
      return null;
    }

    const renderedUnit = unitEntities[renderedUnitId];
    if (!renderedUnit) {
      return null;
    }

    const globalUnitNumber = orderedUnitIds.indexOf(renderedUnitId) + 1;
    const colorThemeKey =
      globalUnitNumber > 0
        ? resolveColorThemeKey(globalUnitNumber)
        : DEFAULT_COLOR_THEME_KEY;

    return {
      id: renderedUnit.id,
      title: renderedUnit.title,
      unitNumber: renderedUnit.orderIndex,
      iconKey: renderedUnit.iconKey,
      colorThemeKey,
    };
  },
);

export const selectRenderedJourneyViewForCourse = createSelector(
  [selectRenderedSectionForCourse, selectRenderedUnitForCourse],
  (renderedSection, renderedUnit): RenderedJourneyView => ({
    renderedSection,
    renderedUnit,
  }),
);

function resolveColorThemeKey(globalUnitNumber: number): string {
  return COLOR_THEME_CYCLE[(globalUnitNumber - 1) % COLOR_THEME_CYCLE.length]!;
}

export const selectSectionOverviewItemsForCourse = createSelector(
  [
    selectSectionIdsForCourse,
    selectSectionEntities,
    selectUnitsBySectionIndex,
    selectUnitEntities,
    selectNodesByUnitIndex,
    selectNodeProgressMap,
    selectCurrentSectionNumberForCourse,
  ],
  (
    sectionIds,
    sectionEntities,
    unitsBySection,
    unitEntities,
    nodesByUnit,
    nodeProgress,
    currentSectionNumber,
  ): SectionOverviewItem[] => {
    let globalUnitNumber = 0;

    return sectionIds
      .map((sectionId): SectionOverviewItem | null => {
        const section = sectionEntities[sectionId];
        if (!section) {
          return null;
        }

        const unitIds = unitsBySection[sectionId] ?? [];
        let totalNodes = 0;
        let completedNodes = 0;
        let colorScheme = "green";
        const unitTitles: string[] = [];
        const unitIconKeys: Array<string | null | undefined> = [];

        unitIds.forEach((unitId, unitIndex) => {
          globalUnitNumber += 1;

          if (unitIndex === 0) {
            colorScheme = resolveColorThemeKey(globalUnitNumber);
          }

          const unit = unitEntities[unitId];
          if (!unit) {
            return;
          }

          unitTitles.push(unit.title);
          unitIconKeys.push(unit.iconKey);

          const nodeIds = nodesByUnit[unitId] ?? [];
          totalNodes += nodeIds.length;
          completedNodes += nodeIds.filter(
            (nodeId) => nodeProgress[nodeId]?.status === "completed",
          ).length;
        });

        return {
          id: section.id,
          sectionNumber: section.orderIndex,
          title: section.title,
          colorScheme,
          unitCount: unitIds.length,
          unitTitles,
          unitIconKeys,
          totalNodes,
          completedNodes,
          progressPercent:
            totalNodes > 0
              ? Math.round((completedNodes / totalNodes) * 100)
              : 0,
          isUnlocked: section.orderIndex <= currentSectionNumber,
          isCurrent: section.orderIndex === currentSectionNumber,
        };
      })
      .filter((section): section is SectionOverviewItem => section !== null);
  },
);

// ── Progress percentages ──────────────────────────────────────────────────────

/**
 * Returns total/completed node counts for a course.
 */
export const selectCourseNodeCountsForCourse = createSelector(
  [
    selectSectionIdsForCourse,
    selectUnitsBySectionIndex,
    selectNodesByUnitIndex,
    selectNodeProgressMap,
  ],
  (sectionIds, unitsBySection, nodesByUnit, nodeProgress) => {
    let totalNodes = 0;
    let completedNodes = 0;

    for (const sectionId of sectionIds) {
      for (const unitId of unitsBySection[sectionId] ?? []) {
        for (const nodeId of nodesByUnit[unitId] ?? []) {
          totalNodes += 1;
          if (nodeProgress[nodeId]?.status === "completed") {
            completedNodes += 1;
          }
        }
      }
    }

    return { completedNodes, totalNodes };
  },
);

/**
 * Returns completed node count as a percentage (0–100) for a course.
 * Uses all 3 relationship indexes to traverse without touching root arrays.
 */
export const selectCourseProgressPct = createSelector(
  [selectCourseNodeCountsForCourse],
  ({ completedNodes, totalNodes }): number => {
    return totalNodes === 0
      ? 0
      : Math.round((completedNodes / totalNodes) * 100);
  },
);

/**
 * Returns completed node count as a percentage (0–100) for a unit.
 * Uses nodesByUnit index — O(k).
 */
export const selectUnitProgressPct = createSelector(
  [selectNodeIdsForUnit, selectNodeProgressMap],
  (nodeIds, nodeProgress): number => {
    if (nodeIds.length === 0) return 0;
    const completed = nodeIds.filter(
      (id) => nodeProgress[id]?.status === "completed",
    ).length;
    return Math.round((completed / nodeIds.length) * 100);
  },
);

/**
 * Returns the total number of completed journey nodes currently present in the
 * normalized progress map across all loaded courses.
 */
export const selectTotalCompletedCount = createSelector(
  [selectNodeProgressMap],
  (nodeProgress): number =>
    Object.values(nodeProgress).filter(
      (progress) => progress.status === "completed",
    ).length,
);

export const selectCourseHeaderSummaryForCourse = createSelector(
  [
    selectCourseEntities,
    selectCourseIdParam,
    selectCourseNodeCountsForCourse,
    selectCurrentSectionNumberForCourse,
    selectSectionIdsForCourse,
  ],
  (
    courseEntities,
    courseId,
    { completedNodes, totalNodes },
    currentSectionNumber,
    sectionIds,
  ): CourseHeaderSummary | null => {
    const course = courseEntities[courseId];
    if (!course) {
      return null;
    }

    return {
      courseId: course.id,
      title: course.title,
      completedNodes,
      totalNodes,
      activeSectionNumber: currentSectionNumber,
      sectionCount: sectionIds.length,
    };
  },
);

// ── UI state selectors ────────────────────────────────────────────────────────

export const selectActiveCourseId = selectActiveCourseIdState;

export const selectCurrentNodeForActiveCourse = createSelector(
  [selectActiveCourseId, selectRootState],
  (activeCourseId, state): Node | null =>
    activeCourseId ? selectCurrentNodeForCourse(state, activeCourseId) : null,
);

export const selectCurrentSectionForActiveCourse = createSelector(
  [selectActiveCourseId, selectRootState],
  (activeCourseId, state): Section | null =>
    activeCourseId
      ? selectCurrentSectionForCourse(state, activeCourseId)
      : null,
);

export const selectPreviewSectionForActiveCourse = createSelector(
  [selectActiveCourseId, selectRootState],
  (activeCourseId, state): Section | null =>
    activeCourseId
      ? selectPreviewSectionForCourse(state, activeCourseId)
      : null,
);

export const selectRenderedSectionForActiveCourse = createSelector(
  [selectActiveCourseId, selectRootState],
  (activeCourseId, state): Section | null =>
    activeCourseId
      ? selectRenderedSectionForCourse(state, activeCourseId)
      : null,
);

export const selectActiveNodeModalIdForCourse = createSelector(
  [selectActiveNodeModalIdByCourseMap, selectCourseIdParam],
  (activeNodeModalIdsByCourse, courseId): string | null =>
    activeNodeModalIdsByCourse[courseId] ?? null,
);

export const selectActiveNodeModalId = createSelector(
  [selectActiveCourseId, selectRootState],
  (activeCourseId, state) =>
    activeCourseId
      ? selectActiveNodeModalIdForCourse(state, activeCourseId)
      : null,
);

// ── Reward UI selectors ───────────────────────────────────────────────────────

/**
 * Returns the pending celebration level for a course, or null if none pending.
 * Used by useJourneyMapController to decide which surface to show.
 */
export const selectPendingCelebration = createSelector(
  [selectPendingCelebrationMap, selectCourseIdParam],
  (pendingCelebration, courseId): 'lesson' | 'unit' | 'course' | null =>
    pendingCelebration[courseId] ?? null,
);

/**
 * Returns whether the full course finale has been seen for a given courseId.
 * Used to skip the finale on re-entry after dismissal (FR-4.8).
 */
export const selectCourseFinaleSeen = createSelector(
  [selectCourseFinaleSeenMap, selectCourseIdParam],
  (courseFinaleSeenByCourse, courseId): boolean =>
    courseFinaleSeenByCourse[courseId] ?? false,
);
