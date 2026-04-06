/**
 * useGuestProgress (P1.6.1)
 *
 * Manages temporary progress for unauthenticated (guest) users.
 * Stores node completions and XP in AsyncStorage so guests can
 * experience the first 2 nodes of any journey before signing up.
 *
 * On sign-up, `migrateToServer()` pushes local progress to Supabase
 * and clears the local cache.
 *
 * Features:
 * - Store temp node completions + XP in AsyncStorage
 * - Track completed node count per journey
 * - Gate at node 2 (FREE_NODE_LIMIT)
 * - Migrate local progress to server on sign-up
 * - Celebrations and XP still work during guest session
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NodeResponseData } from '@/src/types/journey/mentalHealth';

// ============================================================================
// Types
// ============================================================================

/** A single guest node completion stored locally */
export interface GuestNodeCompletion {
    nodeId: string;
    journeyId: string;
    responseData: NodeResponseData;
    xpEarned: number;
    completedAt: string;
}

/** Full guest progress stored in AsyncStorage */
export interface GuestProgressData {
    completions: GuestNodeCompletion[];
    totalXP: number;
    lastUpdated: string;
}

export interface UseGuestProgressReturn {
    /** All guest completions */
    completions: GuestNodeCompletion[];
    /** Total guest XP earned */
    totalXP: number;
    /** Number of completed nodes for a specific journey */
    completedCountForJourney: (journeyId: string) => number;
    /** Whether the guest has hit the free node limit for a journey */
    hasReachedLimit: (journeyId: string) => boolean;
    /** Whether a specific node has been completed */
    isNodeCompleted: (nodeId: string) => boolean;
    /** Record a node completion (local only) */
    completeNode: (params: GuestNodeCompletion) => Promise<void>;
    /** Get all completions for a specific journey (for migration) */
    completionsForJourney: (journeyId: string) => GuestNodeCompletion[];
    /** Migrate all guest progress to server, then clear local */
    migrateToServer: (
        migrateFn: (completions: GuestNodeCompletion[]) => Promise<boolean>,
    ) => Promise<boolean>;
    /** Clear all guest progress (e.g., after migration or sign-out) */
    clearProgress: () => Promise<void>;
    /** Whether data is loading from AsyncStorage */
    isLoading: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = '@guest_journey_progress_v1';

/** Maximum nodes a guest can complete before sign-up is required */
export const FREE_NODE_LIMIT: number = 2;

// ============================================================================
// Helpers
// ============================================================================

async function loadFromStorage(): Promise<GuestProgressData> {
    try {
        const raw: string | null = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as GuestProgressData;
        }
    } catch (err) {
        console.warn('[GuestProgress] Failed to load from storage:', err);
    }
    return { completions: [], totalXP: 0, lastUpdated: new Date().toISOString() };
}

async function saveToStorage(data: GuestProgressData): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
        console.warn('[GuestProgress] Failed to save to storage:', err);
    }
}

async function clearStorage(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.warn('[GuestProgress] Failed to clear storage:', err);
    }
}

// ============================================================================
// Hook
// ============================================================================

export function useGuestProgress(): UseGuestProgressReturn {
    const [completions, setCompletions] = useState<GuestNodeCompletion[]>([]);
    const [totalXP, setTotalXP] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load on mount
    useEffect(() => {
        (async () => {
            const data: GuestProgressData = await loadFromStorage();
            setCompletions(data.completions);
            setTotalXP(data.totalXP);
            setIsLoading(false);
        })();
    }, []);

    // ── Query helpers ──

    const completedCountForJourney = useCallback(
        (journeyId: string): number => {
            return completions.filter(
                (c: GuestNodeCompletion) => c.journeyId === journeyId,
            ).length;
        },
        [completions],
    );

    const hasReachedLimit = useCallback(
        (journeyId: string): boolean => {
            return completedCountForJourney(journeyId) >= FREE_NODE_LIMIT;
        },
        [completedCountForJourney],
    );

    const isNodeCompleted = useCallback(
        (nodeId: string): boolean => {
            return completions.some(
                (c: GuestNodeCompletion) => c.nodeId === nodeId,
            );
        },
        [completions],
    );

    const completionsForJourney = useCallback(
        (journeyId: string): GuestNodeCompletion[] => {
            return completions.filter(
                (c: GuestNodeCompletion) => c.journeyId === journeyId,
            );
        },
        [completions],
    );

    // ── Mutations ──

    const completeNode = useCallback(
        async (params: GuestNodeCompletion): Promise<void> => {
            const newCompletions: GuestNodeCompletion[] = [...completions, params];
            const newXP: number = totalXP + params.xpEarned;

            setCompletions(newCompletions);
            setTotalXP(newXP);

            await saveToStorage({
                completions: newCompletions,
                totalXP: newXP,
                lastUpdated: new Date().toISOString(),
            });
        },
        [completions, totalXP],
    );

    const migrateToServer = useCallback(
        async (
            migrateFn: (completions: GuestNodeCompletion[]) => Promise<boolean>,
        ): Promise<boolean> => {
            if (completions.length === 0) return true;

            const success: boolean = await migrateFn(completions);

            if (success) {
                setCompletions([]);
                setTotalXP(0);
                await clearStorage();
            }

            return success;
        },
        [completions],
    );

    const clearProgress = useCallback(async (): Promise<void> => {
        setCompletions([]);
        setTotalXP(0);
        await clearStorage();
    }, []);

    return {
        completions,
        totalXP,
        completedCountForJourney,
        hasReachedLimit,
        isNodeCompleted,
        completeNode,
        completionsForJourney,
        migrateToServer,
        clearProgress,
        isLoading,
    };
}

export default useGuestProgress;
