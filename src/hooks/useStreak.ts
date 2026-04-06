/**
 * useStreak
 * Mental health journey streak management hook.
 *
 * Uses the dedicated `user_streaks` table and `update_user_streak()` RPC
 * (created in migration 20260405000002). Separate from the existing
 * useStreakTracker which tracks journal streaks via the `profiles` table.
 *
 * Features:
 * - Fetch current streak data
 * - Update streak on node completion (via atomic RPC)
 * - Consume a streak freeze manually
 * - Check if streak is at risk today
 * - Detect streak milestones (3, 7, 14, 30, 60, 100, 365)
 * - Weekly progress tracking
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import type {
    UserStreak,
    UpdateStreakResponse,
} from '@/src/types/journey/mentalHealth';
import { STREAK_MILESTONES } from '@/src/types/journey/mentalHealth';
import { useAuth } from '@/src/context/AuthContext';
import {
    fetchUserStreak,
    updateStreak as updateStreakApi,
} from '@/src/lib/api/mentalHealthJourneyApi';
import { supabase } from '@/src/network/auth/supabase';

// ============================================================================
// Types
// ============================================================================

/** Weekly progress: which days this week had activity */
export interface WeeklyProgress {
    /** Array of 7 booleans [Mon, Tue, Wed, Thu, Fri, Sat, Sun] */
    days: boolean[];
    /** Number of active days this week */
    activeDays: number;
    /** Whether a perfect week is still possible */
    perfectWeekPossible: boolean;
}

/** Streak milestone info */
export interface StreakMilestone {
    /** The milestone day number */
    day: number;
    /** Whether the user has reached this milestone */
    reached: boolean;
    /** Days remaining until this milestone */
    daysRemaining: number;
}

/** Return type for the hook */
export interface UseStreakReturn {
    /** Current streak data from DB */
    streak: UserStreak | null;
    /** Current streak count (convenience) */
    currentStreak: number;
    /** Longest streak count (convenience) */
    longestStreak: number;
    /** Available streak freezes */
    freezesAvailable: number;
    /** Whether the streak is at risk (no activity today, past 6 PM) */
    isAtRisk: boolean;
    /** Whether the user has been active today */
    isActiveToday: boolean;
    /** Weekly progress for the current week */
    weeklyProgress: WeeklyProgress;
    /** Next upcoming milestone */
    nextMilestone: StreakMilestone | null;
    /** All milestones with status */
    milestones: StreakMilestone[];
    /** Whether data is loading */
    isLoading: boolean;
    /** Error message */
    error: string | null;
    /** Update streak (called by useNodeCompletion, but can be called directly) */
    updateStreak: () => Promise<UpdateStreakResponse | null>;
    /** Manually consume a streak freeze */
    useStreakFreeze: () => Promise<boolean>;
    /** Check if streak is at risk right now */
    checkStreakStatus: () => boolean;
    /** Refresh streak data from DB */
    refetch: () => Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

/** Hour after which a streak is considered "at risk" if no activity today */
const AT_RISK_HOUR: number = 18;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ============================================================================
// Hook
// ============================================================================

export function useStreak(): UseStreakReturn {
    const { user } = useAuth();
    const [streak, setStreak] = useState<UserStreak | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch streak data ──
    const loadStreak = useCallback(async (): Promise<void> => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const res = await fetchUserStreak();
            if (res.success) {
                setStreak(res.data);
            } else {
                setError(res.error ?? 'Failed to fetch streak');
            }
        } catch (err) {
            console.error('[useStreak] loadStreak error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // ── Auto-load on mount / user change ──
    useEffect(() => {
        loadStreak();
    }, [loadStreak]);

    // ── Derived: is active today ──
    const isActiveToday: boolean = useMemo(() => {
        if (!streak) return false;
        const today: string = dayjs().format('YYYY-MM-DD');
        return streak.lastActivityDate === today;
    }, [streak]);

    // ── Derived: is at risk ──
    const isAtRisk: boolean = useMemo(() => {
        if (!streak || isActiveToday) return false;
        if (streak.currentStreak === 0) return false;
        const currentHour: number = dayjs().hour();
        return currentHour >= AT_RISK_HOUR;
    }, [streak, isActiveToday]);

    // ── Derived: weekly progress ──
    const weeklyProgress: WeeklyProgress = useMemo(() => {
        const today = dayjs();
        const weekStart = today.startOf('week'); // Sunday in dayjs default
        const days: boolean[] = [false, false, false, false, false, false, false];

        if (streak) {
            const lastActive = dayjs(streak.lastActivityDate);

            // Mark days this week that were active
            // We only know the last activity date from the streak table,
            // so we mark today if active, and infer consecutive days from currentStreak
            for (let i = 0; i < 7; i++) {
                const day = weekStart.add(i, 'day');
                if (day.isAfter(today, 'day')) break;

                // If last active is this day or current streak covers this day
                const daysBack: number = today.diff(day, 'day');
                if (daysBack < streak.currentStreak || day.isSame(lastActive, 'day')) {
                    days[i] = true;
                }
            }
        }

        const activeDays: number = days.filter(Boolean).length;
        const todayIndex: number = today.day(); // 0=Sun
        const perfectWeekPossible: boolean = days.slice(0, todayIndex).every(Boolean);

        return { days, activeDays, perfectWeekPossible };
    }, [streak]);

    // ── Derived: milestones ──
    const milestones: StreakMilestone[] = useMemo(() => {
        const current: number = streak?.currentStreak ?? 0;

        return STREAK_MILESTONES.map((day: number): StreakMilestone => ({
            day,
            reached: current >= day,
            daysRemaining: Math.max(0, day - current),
        }));
    }, [streak]);

    // ── Derived: next milestone ──
    const nextMilestone: StreakMilestone | null = useMemo(() => {
        return milestones.find((m: StreakMilestone) => !m.reached) ?? null;
    }, [milestones]);

    // ── Action: update streak ──
    const handleUpdateStreak = useCallback(async (): Promise<UpdateStreakResponse | null> => {
        try {
            const res = await updateStreakApi();
            if (res.success && res.data) {
                // Refresh streak data to sync local state
                await loadStreak();
                return res.data;
            }
            console.warn('[useStreak] updateStreak failed:', res.error);
            return null;
        } catch (err) {
            console.error('[useStreak] updateStreak error:', err);
            return null;
        }
    }, [loadStreak]);

    // ── Action: use streak freeze ──
    const useStreakFreeze = useCallback(async (): Promise<boolean> => {
        if (!user?.id || !streak || streak.streakFreezesAvailable <= 0) {
            return false;
        }

        try {
            const { error: updateError } = await db
                .from('user_streaks')
                .update({
                    streak_freezes_available: streak.streakFreezesAvailable - 1,
                    last_activity_date: dayjs().format('YYYY-MM-DD'),
                })
                .eq('user_id', user.id);

            if (updateError) {
                console.error('[useStreak] useStreakFreeze error:', updateError.message);
                return false;
            }

            await loadStreak();
            return true;
        } catch (err) {
            console.error('[useStreak] useStreakFreeze error:', err);
            return false;
        }
    }, [user?.id, streak, loadStreak]);

    // ── Action: check streak status (synchronous) ──
    const checkStreakStatus = useCallback((): boolean => {
        if (!streak || isActiveToday) return false;
        if (streak.currentStreak === 0) return false;
        return dayjs().hour() >= AT_RISK_HOUR;
    }, [streak, isActiveToday]);

    return {
        streak,
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        freezesAvailable: streak?.streakFreezesAvailable ?? 0,
        isAtRisk,
        isActiveToday,
        weeklyProgress,
        nextMilestone,
        milestones,
        isLoading,
        error,
        updateStreak: handleUpdateStreak,
        useStreakFreeze,
        checkStreakStatus,
        refetch: loadStreak,
    };
}
