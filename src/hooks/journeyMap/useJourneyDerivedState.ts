import { useMemo } from "react";
import { useJourneyFlashList } from "@/src/hooks/useJourneyFlashList";
import type { JourneyState, UnitData, PathNodeData, JourneyConfig, UnitConfig } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

export function useJourneyDerivedState(
  journeyState: JourneyState | undefined,
  allUnitsRaw: UnitData[],
  config: JourneyConfig,
  unitConfigMap: Map<string, UnitConfig>
) {
  const unitCompletedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!journeyState?.units) return counts;

    journeyState.units.forEach((unit: UnitData) => {
      if (!unit || !unit.nodes) return;
      const completed: number = unit.nodes.filter(
        (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
      ).length;
      // Key by unit.id (UUID) for FlashList pipeline
      counts[unit.id] = completed;
      // Key by section number for SectionOverviewSheet aggregation
      const sectionNumber: number = unit.sectionNumber ?? unit.unitNumber;
      counts[`section_${sectionNumber}`] =
        (counts[`section_${sectionNumber}`] ?? 0) + completed;
    });
    return counts;
  }, [journeyState?.units]);

  // Compute total completed count across ALL units (for guest gate)
  const totalCompletedCount: number = useMemo(() => {
    return allUnitsRaw.reduce((acc: number, unit: UnitData) => {
      if (!unit || !unit.nodes) return acc;
      return (
        acc +
        unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length
      );
    }, 0);
  }, [allUnitsRaw]);

  // FlashList segment-per-cell data pipeline
  const {
    flashListData,
    activeNodeIndex: flashActiveNodeIndex,
    activeGlobalIndex,
    screenWidth: flashScreenWidth,
    activeNodeY: flashActiveNodeY,
    unitHeaders,
  } = useJourneyFlashList(
    config,
    unitConfigMap,
    allUnitsRaw.map((unit: UnitData) => unit.id),
  );

  return {
    unitCompletedCounts,
    totalCompletedCount,
    flashListData,
    flashActiveNodeIndex,
    activeGlobalIndex,
    flashScreenWidth,
    flashActiveNodeY,
    unitHeaders,
  };
}
