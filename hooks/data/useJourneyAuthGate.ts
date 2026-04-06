/**
 * useJourneyAuthGate
 *
 * Encapsulates all guest-vs-authenticated logic for the journey map.
 *
 * Rules:
 * - Guests (no session) may access node indices 0 and 1 (first 2 nodes).
 * - Node index 2+ requires authentication.
 * - Authenticated users have unrestricted access.
 *
 * "Node index" = the completion order across ALL units in the journey.
 * It is computed from the count of COMPLETED nodes in the Jotai state.
 *
 * Returns a ref for the GuestSignUpSheet so the caller can forward it to
 * the sheet component without duplicating sheet-state logic.
 */

import { useCallback, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth } from '@/src/context/AuthContext';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of nodes a guest may complete before sign-up is required. */
export const GUEST_FREE_NODE_LIMIT = 2;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseJourneyAuthGateReturn {
  /** Whether the current user is a guest (unauthenticated). */
  isGuest: boolean;
  /**
   * Returns true if the user may access the node at the given completion index.
   * @param completedCount - number of nodes already marked COMPLETED in state.
   *   The next node to be completed is at index `completedCount`.
   */
  canAccessNode: (completedCount: number) => boolean;
  /** Imperatively show the GuestSignUpSheet. */
  showSignUpPrompt: () => void;
  /** Ref to attach to <GuestSignUpSheet ref={signUpSheetRef} /> */
  signUpSheetRef: React.RefObject<BottomSheetModal | null>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJourneyAuthGate(): UseJourneyAuthGateReturn {
  const { session } = useAuth();
  const signUpSheetRef = useRef<BottomSheetModal>(null);

  const isGuest: boolean = session === null;

  /**
   * A guest may access node at index `completedCount` (0-based next node)
   * as long as completedCount < GUEST_FREE_NODE_LIMIT.
   * Authenticated users always return true.
   */
  const canAccessNode = useCallback(
    (completedCount: number): boolean => {
      if (!isGuest) return true;
      return completedCount < GUEST_FREE_NODE_LIMIT;
    },
    [isGuest],
  );

  const showSignUpPrompt = useCallback((): void => {
    signUpSheetRef.current?.present();
  }, []);

  return {
    isGuest,
    canAccessNode,
    showSignUpPrompt,
    signUpSheetRef,
  };
}
