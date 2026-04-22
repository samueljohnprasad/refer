import { useState, useCallback } from "react";
import type { ViewToken } from "@legendapp/list";
import type {
  JourneyFlashListItem,
  JourneyNode,
  UnitData,
} from "@/src/types/journey";

interface UseVisibleUnitProps {
  units: UnitData[];
}

function isJourneyNode(item: JourneyFlashListItem): item is JourneyNode {
  return item.itemType === "node";
}

export function useVisibleUnit({ units }: UseVisibleUnitProps) {
  const [visibleUnitIndex, setVisibleUnitIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<JourneyFlashListItem>[];
    }) => {
      const firstItem = viewableItems.find((vi) => isJourneyNode(vi.item));

      if (!firstItem) return;
      if (!isJourneyNode(firstItem.item)) return;

      const targetUnitId = firstItem.item.unitId;

      const unitIndex = units.findIndex((u) => u.id === targetUnitId);

      if (unitIndex !== -1 && unitIndex !== visibleUnitIndex) {
        setVisibleUnitIndex(unitIndex);
      }
    },
    [units, visibleUnitIndex],
  );

  const unit = units[visibleUnitIndex] || units[0];
  const visibleUnit = unit
    ? {
        unitNumber: unit.unitNumber,
        unitTitle: unit.title,
        colorThemeKey: unit.colorScheme,
        unitId: unit.id,
      }
    : {
        unitNumber: 1,
        unitTitle: "Loading...",
        colorThemeKey: "green",
        unitId: "",
      };

  return {
    visibleUnit,
    onViewableItemsChanged,
  };
}
