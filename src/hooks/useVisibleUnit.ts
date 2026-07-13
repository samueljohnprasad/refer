import { useState, useCallback, useRef } from "react";
import type { ViewToken } from "@legendapp/list";
import type {
  JourneyFlashListItem,
  JourneyNode,
  UnitData,
} from "@/src/types/journey";

import * as Haptics from "expo-haptics";

interface UseVisibleUnitProps {
  units: UnitData[];
}

function isJourneyNode(item: JourneyFlashListItem): item is JourneyNode {
  return item.itemType === "node";
}

function getFirstVisibleNode(
  viewableItems: ViewToken<JourneyFlashListItem>[],
): JourneyNode | null {
  const firstVisibleNode = viewableItems
    .filter((viewToken) => isJourneyNode(viewToken.item))
    .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))[0];

  return firstVisibleNode && isJourneyNode(firstVisibleNode.item)
    ? firstVisibleNode.item
    : null;
}

export function useVisibleUnit({ units }: UseVisibleUnitProps) {
  const [visibleUnitId, setVisibleUnitId] = useState<string | null>(null);
  const lastHapticTime = useRef<number>(0);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<JourneyFlashListItem>[];
    }) => {
      const firstVisibleNode = getFirstVisibleNode(viewableItems);
      if (!firstVisibleNode) return;

      const targetUnitId = firstVisibleNode.unitId;
      const hasVisibleUnit = units.some((unit) => unit.id === targetUnitId);

      if (hasVisibleUnit && targetUnitId !== visibleUnitId) {
        if (visibleUnitId !== null) {
          const now = Date.now();
          if (now - lastHapticTime.current > 300) {
            void Haptics.selectionAsync();
            lastHapticTime.current = now;
          }
        }
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
