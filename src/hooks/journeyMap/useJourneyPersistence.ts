import { useEffect, useMemo } from "react";
import { useOfflineQueue } from "@/src/hooks/useOfflineQueue";
import { saveJourneyState } from "@/src/store/journeyStore";
import { debounce, type DebouncedFunction } from "@/src/utils/debounce";
import type { JourneyState } from "@/src/types/journey";

export function useJourneyPersistence(
  journeyState: JourneyState,
  isOnline: boolean,
) {
  const { enqueue } = useOfflineQueue(isOnline);

  // Debounced persistence — avoids hammering AsyncStorage on every progress tick.
  // Fires at most once per 1.5s (trailing). Flushed on unmount to avoid data loss.
  const debouncedSave = useMemo<DebouncedFunction<typeof saveJourneyState>>(
    () => debounce(saveJourneyState, 1500),
    [],
  );

  useEffect(() => {
    debouncedSave(journeyState);
    if (!isOnline) {
      enqueue(journeyState);
    }
  }, [journeyState, isOnline, enqueue, debouncedSave]);

  // Flush any pending save on unmount to prevent data loss
  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);
}
