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
  const [visibleUnitId, setVisibleUnitId] = useState<string | null>(null);

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
      const hasVisibleUnit = units.some((unit) => unit.id === targetUnitId);

      if (hasVisibleUnit && targetUnitId !== visibleUnitId) {
        setVisibleUnitId(targetUnitId);
      }
    },
    [units, visibleUnitId],
  );

  return {
    visibleUnitId,
    onViewableItemsChanged,
  };
}
