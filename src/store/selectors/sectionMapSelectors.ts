import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/store";
import type { UnitData, PathNodeData } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Base selectors
// ---------------------------------------------------------------------------

export const selectUnits = (state: RootState): UnitData[] =>
  state.sectionMap.units;

// ---------------------------------------------------------------------------
// Derived: Completed counts
// ---------------------------------------------------------------------------

export const selectUnitCompletedCounts = createSelector(
  selectUnits,
  (units): Record<string, number> =>
    units.reduce(
      (counts, unit) => {
        const completed = unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length;

        counts[unit.id] = completed;

        const sectionNumber = unit.sectionNumber;
        counts[`section_${sectionNumber}`] =
          (counts[`section_${sectionNumber}`] ?? 0) + completed;

        return counts;
      },
      {} as Record<string, number>,
    ),
);

export const selectTotalCompletedCount = createSelector(
  selectUnits,
  (units): number =>
    units.reduce(
      (acc, unit) =>
        acc +
        unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length,
      0,
    ),
);

// ---------------------------------------------------------------------------
// Derived: Active node index (flat)
// ---------------------------------------------------------------------------

export const selectActiveNodeIndex = createSelector(
  selectUnits,
  (units): number => {
    let idx = 0;
    const found = units.find((unit) =>
      unit.nodes.find((node) => {
        if (node.status === NodeStatus.ACTIVE) return true;
        idx++;
        return false;
      }),
    );
    return found ? idx : -1;
  },
);
