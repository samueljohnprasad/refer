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

import { useCallback, useMemo } from 'react';
import {
  format,
  getHours,
  startOfWeek,
  startOfDay,
  addDays,
  isAfter,
  differenceInDays,
  isSameDay,
  getDay,
  parseISO
} from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    UserStreak,
} from '@/src/types/journey/mentalHealth';
import { STREAK_MILESTONES } from '@/src/types/journey/mentalHealth';
import { useAuth } from '@/src/context/AuthContext';
import {
    fetchUserStreak,
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
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: ['streak', user?.id],
        queryFn: async () => {
            if (!user?.id) return { streak: null, activityDates: new Set<string>() };

            // 1. Fetch user_streaks table row
            let streakData: UserStreak | null = null;
            const res = await fetchUserStreak();
            if (res.success && res.data) {
                streakData = res.data;
            }

            // 2. Query xp_history ONLY to get actual user activity dates since beginning
            const { data: xpData } = await db
                .from('xp_history')
                .select('created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1000);

            const datesSet = new Set<string>();
            if (xpData && Array.isArray(xpData)) {
                xpData.forEach((e: { created_at?: string }) => {
                    if (e.created_at) datesSet.add(format(new Date(e.created_at), 'yyyy-MM-dd'));
                });
            }

            return { streak: streakData, activityDates: datesSet };
        },
        enabled: !!user?.id,
    });

    const streak = data?.streak ?? null;
    const activityDates = data?.activityDates ?? new Set<string>();
    const error = queryError ? (queryError instanceof Error ? queryError.message : 'Unknown error') : null;

    // ── Derived: is active today ──
    const isActiveToday: boolean = useMemo(() => {
        const today: string = format(new Date(), 'yyyy-MM-dd');
        if (activityDates.has(today)) return true;
        if (!streak) return false;
        return streak.lastActivityDate === today;
    }, [streak, activityDates]);

    // ── Derived: computed streak count (total active days since beginning) ──
    const computedStreakCount: number = useMemo(() => {
        const dbStreak = streak?.currentStreak ?? 0;
        const totalDays = activityDates.size;
        return Math.max(dbStreak, totalDays);
    }, [streak, activityDates]);

    // ── Derived: is at risk ──
    const isAtRisk: boolean = useMemo(() => {
        if (isActiveToday || computedStreakCount === 0) return false;
        const currentHour: number = getHours(new Date());
        return currentHour >= AT_RISK_HOUR;
    }, [isActiveToday, computedStreakCount]);

    // ── Derived: weekly progress ──
    const weeklyProgress: WeeklyProgress = useMemo(() => {
        const today = startOfDay(new Date());
        const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as first day
        const days: boolean[] = [false, false, false, false, false, false, false];

        // 1. Mark days with recorded activity in exercise_entries
        for (let i = 0; i < 7; i++) {
            const day = addDays(weekStart, i);
            if (isAfter(day, today)) break;
            const dateStr = format(day, 'yyyy-MM-dd');
            if (activityDates.has(dateStr)) {
                days[i] = true;
            }
        }

        // 2. Mark days covered by streak table if present
        if (streak && streak.currentStreak > 0) {
            const lastActive = parseISO(streak.lastActivityDate);
            for (let i = 0; i < 7; i++) {
                const day = addDays(weekStart, i);
                if (isAfter(day, today)) break;
                const daysBack: number = differenceInDays(today, day);
                if (daysBack < streak.currentStreak || isSameDay(day, lastActive)) {
                    days[i] = true;
                }
            }
        }

        const activeDays: number = days.filter(Boolean).length;
        const todayIndex: number = getDay(today);
        const perfectWeekPossible: boolean = days.slice(0, todayIndex).every(Boolean);

        return { days, activeDays, perfectWeekPossible };
    }, [streak, activityDates]);

    // ── Derived: milestones ──
    const milestones: StreakMilestone[] = useMemo(() => {
        const current: number = computedStreakCount;

        return STREAK_MILESTONES.map((day: number): StreakMilestone => ({
            day,
            reached: current >= day,
            daysRemaining: Math.max(0, day - current),
        }));
    }, [computedStreakCount]);

    // ── Derived: next milestone ──
    const nextMilestone: StreakMilestone | null = useMemo(() => {
        return milestones.find((m: StreakMilestone) => !m.reached) ?? null;
    }, [milestones]);

    return {
        streak,
        currentStreak: computedStreakCount,
        isAtRisk,
        isActiveToday,
        weeklyProgress,
        nextMilestone,
        milestones,
        isLoading,
        error,
        refetch: async () => { await refetch(); },
    };
}
