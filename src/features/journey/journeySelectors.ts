// features/journey/journeySelectors.ts
// All memoized selectors for the Journey Map normalized store.
// Every selector uses relationship indexes — no .filter() from root.
// O(1) primitives, O(k) index lookups, O(n) traversal with early return for current node.

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import type { Node, NodeStatus, DerivedStatus } from "@/src/types/journeyV5";

// ── O(1) entity primitives ────────────────────────────────────────────────────

/** Returns the course entity by id, or undefined if not in store. */
export const selectCourse = (state: RootState, courseId: string) =>
  state.journey.courses.entities[courseId];

/** Returns the section entity by id, or undefined if not in store. */
export const selectSection = (state: RootState, sectionId: string) =>
  state.journey.sections.entities[sectionId];

/** Returns the unit entity by id, or undefined if not in store. */
export const selectUnit = (state: RootState, unitId: string) =>
  state.journey.units.entities[unitId];

/** Returns the node entity by id, or undefined if not in store. */
export const selectNode = (state: RootState, nodeId: string) =>
  state.journey.nodes.entities[nodeId];

// ── Loading state ─────────────────────────────────────────────────────────────

/** Returns true if this course's tree is already in the Redux store. */
export const selectIsCourseLoaded = (
  state: RootState,
  courseId: string,
): boolean => !!state.journey.loadedCourses[courseId];

/** Returns true if this course's tree is currently being fetched. */
export const selectIsCourseLoading = (
  state: RootState,
  courseId: string,
): boolean => !!state.journey.loadingCourses[courseId];

// ── Index selectors — O(k), never scans full entity store ─────────────────────

/**
 * Returns sections for a course in order.
 * Uses sectionsByCourse index — O(k) where k = sections in course.
 */
export const selectSectionsForCourse = createSelector(
  [
    (state: RootState) => state.journey.sectionsByCourse,
    (state: RootState) => state.journey.sections.entities,
    (_: RootState, courseId: string) => courseId,
  ],
  (sectionsByCourse, entities, courseId) =>
    (sectionsByCourse[courseId] ?? [])
      .map((id) => entities[id])
      .filter((s): s is NonNullable<typeof s> => s !== undefined),
);

/**
 * Returns units for a section in order.
 * Uses unitsBySection index — O(k) where k = units in section.
 */
export const selectUnitsForSection = createSelector(
  [
    (state: RootState) => state.journey.unitsBySection,
    (state: RootState) => state.journey.units.entities,
    (_: RootState, sectionId: string) => sectionId,
  ],
  (unitsBySection, entities, sectionId) =>
    (unitsBySection[sectionId] ?? [])
      .map((id) => entities[id])
      .filter((u): u is NonNullable<typeof u> => u !== undefined),
);

/**
 * Returns nodes for a unit in order.
 * Uses nodesByUnit index — O(k) where k = nodes in unit.
 */
export const selectNodesForUnit = createSelector(
  [
    (state: RootState) => state.journey.nodesByUnit,
    (state: RootState) => state.journey.nodes.entities,
    (_: RootState, unitId: string) => unitId,
  ],
  (nodesByUnit, entities, unitId) =>
    (nodesByUnit[unitId] ?? [])
      .map((id) => entities[id])
      .filter((n): n is NonNullable<typeof n> => n !== undefined),
);

// ── Status selectors ──────────────────────────────────────────────────────────

/**
 * Returns the status of a single node.
 * O(1) — direct map lookup. No array scan.
 * Returns 'locked' if no progress row exists (never stored in DB).
 */
export const selectNodeStatus = createSelector(
  [(state: RootState, nodeId: string) => state.journey.nodeProgress[nodeId]],
  (progress): NodeStatus => progress?.status ?? "locked",
);

/**
 * Returns the derived status of a unit based on its child node statuses.
 * Uses nodesByUnit index — O(k) traversal.
 */
export const selectUnitStatus = createSelector(
  [
    (state: RootState, unitId: string) =>
      state.journey.nodesByUnit[unitId] ?? [],
    (state: RootState) => state.journey.nodeProgress,
  ],
  (nodeIds, nodeProgress): DerivedStatus => {
    if (nodeIds.length === 0) return "locked";

    const statuses = nodeIds.map(
      (id) => (nodeProgress[id]?.status ?? "locked") as NodeStatus,
    );

    if (statuses.every((s) => s === "locked")) return "locked";
    if (statuses.every((s) => s === "completed")) return "completed";
    if (statuses.every((s) => s === "locked" || s === "not_started"))
      return "not_started";

    return "in_progress";
  },
);

/**
 * Returns the derived status of a section based on its child unit statuses.
 * Uses unitsBySection + nodesByUnit indexes.
 */
export const selectSectionStatus = createSelector(
  [
    (state: RootState, sectionId: string) =>
      state.journey.unitsBySection[sectionId] ?? [],
    (state: RootState) => state.journey.nodesByUnit,
    (state: RootState) => state.journey.nodeProgress,
  ],
  (unitIds, nodesByUnit, nodeProgress): DerivedStatus => {
    if (unitIds.length === 0) return "locked";

    const unitStatuses: DerivedStatus[] = unitIds.map((unitId) => {
      const nodeIds = nodesByUnit[unitId] ?? [];
      if (nodeIds.length === 0) return "locked";

      const statuses = nodeIds.map(
        (id) => (nodeProgress[id]?.status ?? "locked") as NodeStatus,
      );
      if (statuses.every((s) => s === "locked")) return "locked";
      if (statuses.every((s) => s === "completed")) return "completed";
      if (statuses.every((s) => s === "locked" || s === "not_started"))
        return "not_started";

      return "in_progress";
    });

    if (unitStatuses.every((s) => s === "locked")) return "locked";
    if (unitStatuses.every((s) => s === "completed")) return "completed";
    if (unitStatuses.every((s) => s === "locked" || s === "not_started"))
      return "not_started";

    return "in_progress";
  },
);

// ── Current node ──────────────────────────────────────────────────────────────

/**
 * Returns the current node for a course — the first non-completed, unlocked node.
 *
 * "Current" is a UI-only concept. NOT stored in the database.
 * Statuses that make a node "current": not_started, in_progress, attempted.
 * Returns null if all nodes completed (course done) or no progress rows exist.
 *
 * O(n) traversal of indexes with early return. Never scans the full entity store.
 */
export const selectCurrentNode = createSelector(
  [
    (state: RootState, courseId: string) =>
      state.journey.sectionsByCourse[courseId] ?? [],
    (state: RootState) => state.journey.unitsBySection,
    (state: RootState) => state.journey.nodesByUnit,
    (state: RootState) => state.journey.nodes.entities,
    (state: RootState) => state.journey.nodeProgress,
  ],
  (
    sectionIds,
    unitsBySection,
    nodesByUnit,
    nodeEntities,
    nodeProgress,
  ): Node | null => {
    for (const sectionId of sectionIds) {
      for (const unitId of unitsBySection[sectionId] ?? []) {
        for (const nodeId of nodesByUnit[unitId] ?? []) {
          const status = nodeProgress[nodeId]?.status ?? "locked";
          if (
            status === "not_started" ||
            status === "in_progress" ||
            status === "attempted"
          ) {
            return nodeEntities[nodeId] ?? null;
          }
        }
      }
    }
    return null;
  },
);

// ── Progress percentages ──────────────────────────────────────────────────────

/**
 * Returns completed node count as a percentage (0–100) for a course.
 * Uses all 3 relationship indexes to traverse without touching root arrays.
 */
export const selectCourseProgressPct = createSelector(
  [
    (state: RootState, courseId: string) =>
      state.journey.sectionsByCourse[courseId] ?? [],
    (state: RootState) => state.journey.unitsBySection,
    (state: RootState) => state.journey.nodesByUnit,
    (state: RootState) => state.journey.nodeProgress,
  ],
  (sectionIds, unitsBySection, nodesByUnit, nodeProgress): number => {
    let total = 0;
    let completed = 0;

    for (const sectionId of sectionIds) {
      for (const unitId of unitsBySection[sectionId] ?? []) {
        for (const nodeId of nodesByUnit[unitId] ?? []) {
          total++;
          if (nodeProgress[nodeId]?.status === "completed") completed++;
        }
      }
    }

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  },
);

/**
 * Returns completed node count as a percentage (0–100) for a unit.
 * Uses nodesByUnit index — O(k).
 */
export const selectUnitProgressPct = createSelector(
  [
    (state: RootState, unitId: string) =>
      state.journey.nodesByUnit[unitId] ?? [],
    (state: RootState) => state.journey.nodeProgress,
  ],
  (nodeIds, nodeProgress): number => {
    if (nodeIds.length === 0) return 0;
    const completed = nodeIds.filter(
      (id) => nodeProgress[id]?.status === "completed",
    ).length;
    return Math.round((completed / nodeIds.length) * 100);
  },
);

// ── UI state selectors ────────────────────────────────────────────────────────

export const selectActiveCourseId = (state: RootState) =>
  state.journey.activeCourseId;

export const selectSelectedNodeId = createSelector(
  [
    selectActiveCourseId,
    (state: RootState) => state.journey.sectionsByCourse,
    (state: RootState) => state.journey.unitsBySection,
    (state: RootState) => state.journey.nodesByUnit,
    (state: RootState) => state.journey.nodeProgress,
  ],
  (
    activeCourseId,
    sectionsByCourse,
    unitsBySection,
    nodesByUnit,
    nodeProgress,
  ): string | null => {
    if (!activeCourseId) return null;

    for (const sectionId of sectionsByCourse[activeCourseId] ?? []) {
      for (const unitId of unitsBySection[sectionId] ?? []) {
        for (const nodeId of nodesByUnit[unitId] ?? []) {
          const status = nodeProgress[nodeId]?.status ?? "locked";
          if (
            status === "not_started" ||
            status === "in_progress" ||
            status === "attempted"
          ) {
            return nodeId;
          }
        }
      }
    }

    return null;
  },
);

export const selectActiveSectionId = createSelector(
  [
    selectSelectedNodeId,
    (state: RootState) => state.journey.nodes.entities,
    (state: RootState) => state.journey.units.entities,
  ],
  (selectedNodeId, nodeEntities, unitEntities): string | null => {
    if (!selectedNodeId) return null;

    const node = nodeEntities[selectedNodeId];
    if (!node) return null;

    return unitEntities[node.unitId]?.sectionId ?? null;
  },
);

export const selectActiveNodeModalId = createSelector(
  [
    selectActiveCourseId,
    (state: RootState) => state.journey.activeNodeModalIdByCourse,
  ],
  (activeCourseId, activeNodeModalIdByCourse) =>
    activeCourseId ? activeNodeModalIdByCourse[activeCourseId] ?? null : null,
);

/** Returns courseProgress for a course, or undefined if not enrolled. */
export const selectCourseProgressForCourse = (
  state: RootState,
  courseId: string,
) => state.journey.courseProgress[courseId];
