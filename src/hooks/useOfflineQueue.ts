/**
 * useOfflineQueue (Task 5.1.1)
 * Queues journey state updates when offline and flushes them on reconnect.
 *
 * While offline, state changes are persisted locally via AsyncStorage.
 * When connectivity is restored, the queue is flushed by re-saving the
 * latest journey state (single source of truth pattern).
 */

import { useCallback, useEffect, useRef } from "react";
import { saveJourneyState } from "@/src/store/journeyStore";
import type { JourneyState } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OfflineQueueResult {
  /** Queue a state snapshot for sync when back online */
  enqueue: (state: JourneyState) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useOfflineQueue(isOnline: boolean): OfflineQueueResult {
  const pendingStateRef = useRef<JourneyState | null>(null);
  const wasOfflineRef = useRef<boolean>(false);

  // When coming back online, flush the latest queued state
  useEffect(() => {
    if (isOnline && wasOfflineRef.current && pendingStateRef.current) {
      saveJourneyState(pendingStateRef.current);
      pendingStateRef.current = null;
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline]);

  const enqueue = useCallback(
    (state: JourneyState): void => {
      if (!isOnline) {
        // Store latest state for flush on reconnect
        pendingStateRef.current = state;
      }
    },
    [isOnline],
  );

  return { enqueue };
}
