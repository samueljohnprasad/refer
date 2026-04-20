import { useMemo } from "react";
import { useJourneyFlashList } from "@/src/hooks/useJourneyFlashList";
import type {
  JourneyState,
  UnitData,
  PathNodeData,
  JourneyConfig,
  UnitConfig,
  SectionMapResponse,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

export function useJourneyDerivedState(
  sectionMapData: SectionMapResponse | null | undefined,
  journeyState: JourneyState | undefined,
  config: JourneyConfig,
  unitConfigMap: Map<string, UnitConfig>,
) {
  const unitCompletedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Use section units with progress from sectionMapData
    const units = sectionMapData?.section?.units || [];

    units.forEach((unit: any) => {
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
  }, [sectionMapData?.section?.units]);

  // Compute total completed count across ALL units (for guest gate)
  const totalCompletedCount: number = useMemo(() => {
    const units = sectionMapData?.section?.units || [];
    return units.reduce((acc: number, unit: any) => {
      if (!unit || !unit.nodes) return acc;
      return (
        acc +
        unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length
      );
    }, 0);
  }, [sectionMapData?.section?.units]);

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
    sectionMapData?.section?.units.map((unit: any) => unit.id) || [],
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
