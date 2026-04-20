import { useState, useCallback } from "react";
import type { ViewToken } from "@legendapp/list";
import type { JourneyFlashListItem, JourneyNode } from "@/src/types/journey";

interface UnitHeader {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  colorThemeKey: string;
}

interface UseVisibleUnitProps {
  unitHeaders: UnitHeader[];
}

function isJourneyNode(item: JourneyFlashListItem): item is JourneyNode {
  return item.itemType === "node";
}

export function useVisibleUnit({ unitHeaders }: UseVisibleUnitProps) {
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

      const unitIndex = unitHeaders.findIndex(
        (uh) => uh.unitId === targetUnitId,
      );

      if (unitIndex !== -1 && unitIndex !== visibleUnitIndex) {
        setVisibleUnitIndex(unitIndex);
      }
    },
    [unitHeaders, visibleUnitIndex],
  );

  const visibleUnit = unitHeaders[visibleUnitIndex] ||
    unitHeaders[0] || {
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
