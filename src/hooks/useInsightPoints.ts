/**
 * useInsightPoints
 * Mental health journey Insight Points (IP) management hook.
 *
 * Uses the `insight_points_ledger` table and `user_ip_totals` view
 * (created in migration 20260405000002). Separate from the existing
 * useXPSystem which tracks general XP via `user_xp` / `xp_history`.
 *
 * Features:
 * - Fetch total/today/week IP from the aggregated view
 * - Earn IP (insert into ledger)
 * - Fetch IP history for a date range (charts, AI reports)
 * - Optimistic local updates for responsive UI
 * - Recent gains tracking for animation toasts
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type {
    IPTotals,
    IPLedgerEntry,
    IPSource,
} from '@/src/types/journey/mentalHealth';
import { useAuth } from '@/src/context/AuthContext';
import {
    fetchIPTotals,
    earnInsightPoints as earnIPApi,
} from '@/src/lib/api/mentalHealthJourneyApi';
import { supabase } from '@/src/network/auth/supabase';

// ============================================================================
// Types
// ============================================================================

/** A recent IP gain for toast/animation display */
export interface IPGain {
    id: string;
    amount: number;
    source: IPSource;
    label: string;
    timestamp: number;
}

/** Parameters for earning IP */
export interface EarnIPParams {
    amount: number;
    source: IPSource;
    sourceId?: string;
    journeyId?: string;
    metadata?: Record<string, unknown>;
}

/** Daily IP entry for history charts */
export interface DailyIPEntry {
    date: string;
    totalIP: number;
}

/** Return type for the hook */
export interface UseInsightPointsReturn {
    /** Total lifetime Insight Points */
    totalIP: number;
    /** IP earned today */
    todayIP: number;
    /** IP earned this week */
    weekIP: number;
    /** Whether data is loading */
    isLoading: boolean;
    /** Error message */
    error: string | null;
    /** Recent IP gains for toast animations */
    recentGains: IPGain[];
    /** Earn Insight Points (insert into ledger + optimistic update) */
    earnIP: (params: EarnIPParams) => Promise<IPLedgerEntry | null>;
    /** Get IP history for the last N days (for charts) */
    getIPHistory: (days: number) => Promise<DailyIPEntry[]>;
    /** Clear a recent gain from the animation list */
    clearRecentGain: (id: string) => void;
    /** Refresh IP totals from the server */
    refetch: () => Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

/** How long to show a recent gain toast (ms) */
const RECENT_GAIN_DISPLAY_MS: number = 3000;

/** Human-readable labels for IP sources */
const IP_SOURCE_LABELS: Record<IPSource, string> = {
    node_completion: 'Node Complete',
    streak_bonus: 'Streak Bonus',
    perfect_day: 'Perfect Day',
    daily_challenge: 'Daily Challenge',
    chest_reward: 'Chest Reward',
    milestone_reward: 'Milestone Reward',
    quiz_perfect_bonus: 'Perfect Quiz',
    early_bird_bonus: 'Early Bird',
    night_owl_bonus: 'Night Owl',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

/** Generate a unique ID for recent gains */
function generateGainId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// Hook
// ============================================================================

export function useInsightPoints(): UseInsightPointsReturn {
    const { user } = useAuth();
    const [totals, setTotals] = useState<IPTotals>({ totalIp: 0, todayIp: 0, weekIp: 0 });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [recentGains, setRecentGains] = useState<IPGain[]>([]);
    const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    // ── Cleanup timeouts on unmount ──
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach((tid: ReturnType<typeof setTimeout>) => clearTimeout(tid));
            timeoutRefs.current.clear();
        };
    }, []);

    // ── Fetch IP totals ──
    const loadTotals = useCallback(async (): Promise<void> => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const res = await fetchIPTotals();
            if (res.success) {
                setTotals(res.data);
            } else {
                setError(res.error ?? 'Failed to fetch IP totals');
            }
        } catch (err) {
            console.error('[useInsightPoints] loadTotals error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // ── Auto-load on mount / user change ──
    useEffect(() => {
        loadTotals();
    }, [loadTotals]);

    // ── Clear a recent gain ──
    const clearRecentGain = useCallback((id: string): void => {
        setRecentGains((prev: IPGain[]) => prev.filter((g: IPGain) => g.id !== id));

        const tid = timeoutRefs.current.get(id);
        if (tid) {
            clearTimeout(tid);
            timeoutRefs.current.delete(id);
        }
    }, []);

    // ── Earn IP ──
    const earnIP = useCallback(
        async (params: EarnIPParams): Promise<IPLedgerEntry | null> => {
            // Optimistic local update
            setTotals((prev: IPTotals) => ({
                totalIp: prev.totalIp + params.amount,
                todayIp: prev.todayIp + params.amount,
                weekIp: prev.weekIp + params.amount,
            }));

            // Add to recent gains for animation
            const gainId: string = generateGainId();
            const newGain: IPGain = {
                id: gainId,
                amount: params.amount,
                source: params.source,
                label: IP_SOURCE_LABELS[params.source] ?? params.source,
                timestamp: Date.now(),
            };

            setRecentGains((prev: IPGain[]) => [...prev, newGain]);

            // Auto-remove after display duration
            const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
                clearRecentGain(gainId);
            }, RECENT_GAIN_DISPLAY_MS);
            timeoutRefs.current.set(gainId, timeoutId);

            // Persist to server
            try {
                const res = await earnIPApi({
                    amount: params.amount,
                    source: params.source,
                    sourceId: params.sourceId,
                    journeyId: params.journeyId,
                    metadata: params.metadata,
                });

                if (!res.success) {
                    // Rollback optimistic update
                    console.warn('[useInsightPoints] earnIP failed, rolling back:', res.error);
                    setTotals((prev: IPTotals) => ({
                        totalIp: Math.max(0, prev.totalIp - params.amount),
                        todayIp: Math.max(0, prev.todayIp - params.amount),
                        weekIp: Math.max(0, prev.weekIp - params.amount),
                    }));
                    return null;
                }

                return res.data;
            } catch (err) {
                console.error('[useInsightPoints] earnIP error:', err);
                // Rollback
                setTotals((prev: IPTotals) => ({
                    totalIp: Math.max(0, prev.totalIp - params.amount),
                    todayIp: Math.max(0, prev.todayIp - params.amount),
                    weekIp: Math.max(0, prev.weekIp - params.amount),
                }));
                return null;
            }
        },
        [clearRecentGain],
    );

    // ── Get IP history for charts ──
    const getIPHistory = useCallback(
        async (days: number): Promise<DailyIPEntry[]> => {
            if (!user?.id) return [];

            try {
                const startDate: string = new Date(
                    Date.now() - days * 24 * 60 * 60 * 1000,
                ).toISOString();

                const { data, error: queryError } = await db
                    .from('insight_points_ledger')
                    .select('amount, earned_at')
                    .eq('user_id', user.id)
                    .gte('earned_at', startDate)
                    .order('earned_at', { ascending: true });

                if (queryError) {
                    console.error('[useInsightPoints] getIPHistory error:', queryError.message);
                    return [];
                }

                // Aggregate by date
                const dailyMap: Map<string, number> = new Map();
                for (const row of (data ?? [])) {
                    const date: string = new Date(row.earned_at as string)
                        .toISOString()
                        .split('T')[0];
                    const current: number = dailyMap.get(date) ?? 0;
                    dailyMap.set(date, current + (row.amount as number));
                }

                // Fill in missing days with 0
                const entries: DailyIPEntry[] = [];
                for (let i = days - 1; i >= 0; i--) {
                    const date: string = new Date(
                        Date.now() - i * 24 * 60 * 60 * 1000,
                    )
                        .toISOString()
                        .split('T')[0];
                    entries.push({
                        date,
                        totalIP: dailyMap.get(date) ?? 0,
                    });
                }

                return entries;
            } catch (err) {
                console.error('[useInsightPoints] getIPHistory error:', err);
                return [];
            }
        },
        [user?.id],
    );

    return {
        totalIP: totals.totalIp,
        todayIP: totals.todayIp,
        weekIP: totals.weekIp,
        isLoading,
        error,
        recentGains,
        earnIP,
        getIPHistory,
        clearRecentGain,
        refetch: loadTotals,
    };
}
