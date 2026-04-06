/**
 * useGuestProgress
 *
 * Persists temporary node completions and XP for unauthenticated (guest) users.
 * Progress is stored in AsyncStorage under GUEST_PROGRESS_KEY and migrated
 * to Supabase after the user signs up via migrateGuestProgress().
 *
 * Single-responsibility: read/write guest progress only.
 * All auth-gate logic lives in useJourneyAuthGate.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GuestProgress {
  /** Ordered list of node IDs the guest has completed */
  completedNodeIds: string[];
  /** Total Insight Points earned during the guest session */
  tempXP: number;
  /** Slug of the journey the guest started (first one they opened) */
  journeySlug: string | null;
}

const GUEST_PROGRESS_KEY = '@guest_journey_progress_v1';

const DEFAULT_PROGRESS: GuestProgress = {
  completedNodeIds: [],
  tempXP: 0,
  journeySlug: null,
};

// ---------------------------------------------------------------------------
// Pure persistence helpers (exported for migration use)
// ---------------------------------------------------------------------------

export async function loadGuestProgress(): Promise<GuestProgress> {
  try {
    const raw = await AsyncStorage.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<GuestProgress>;
    return {
      completedNodeIds: Array.isArray(parsed.completedNodeIds)
        ? parsed.completedNodeIds
        : [],
      tempXP: typeof parsed.tempXP === 'number' ? parsed.tempXP : 0,
      journeySlug: typeof parsed.journeySlug === 'string' ? parsed.journeySlug : null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveGuestProgress(progress: GuestProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('[useGuestProgress] Failed to save guest progress:', err);
  }
}

export async function clearGuestProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GUEST_PROGRESS_KEY);
  } catch (err) {
    console.warn('[useGuestProgress] Failed to clear guest progress:', err);
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseGuestProgressReturn {
  guestProgress: GuestProgress;
  isLoading: boolean;
  /**
   * Record that a guest completed a node.
   * No-op if the node was already recorded.
   */
  recordGuestNodeCompletion: (nodeId: string, xpEarned: number, journeySlug: string) => Promise<void>;
  clearGuestProgress: () => Promise<void>;
}

export function useGuestProgress(): UseGuestProgressReturn {
  const [guestProgress, setGuestProgress] = useState<GuestProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load on mount
  useEffect(() => {
    loadGuestProgress().then((progress: GuestProgress) => {
      setGuestProgress(progress);
      setIsLoading(false);
    });
  }, []);

  const recordGuestNodeCompletion = useCallback(
    async (nodeId: string, xpEarned: number, journeySlug: string): Promise<void> => {
      setGuestProgress((prev: GuestProgress) => {
        // Deduplicate
        if (prev.completedNodeIds.includes(nodeId)) return prev;

        const updated: GuestProgress = {
          completedNodeIds: [...prev.completedNodeIds, nodeId],
          tempXP: prev.tempXP + xpEarned,
          journeySlug: prev.journeySlug ?? journeySlug,
        };

        // Fire-and-forget persist
        saveGuestProgress(updated).catch(console.warn);
        return updated;
      });
    },
    [],
  );

  const clear = useCallback(async (): Promise<void> => {
    await clearGuestProgress();
    setGuestProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    guestProgress,
    isLoading,
    recordGuestNodeCompletion,
    clearGuestProgress: clear,
  };
}
