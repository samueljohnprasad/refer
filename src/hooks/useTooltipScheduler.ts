/**
 * useTooltipScheduler (P1.6.3)
 *
 * Manages progressive feature tooltips that introduce features gradually.
 * Tracks which tooltips have been shown via AsyncStorage so they never
 * repeat once dismissed.
 *
 * Schedule:
 * - Session 1: "Tap a node to start!" + "You earned Insight Points!"
 * - Session 2: "You're on a streak!"
 * - Session 3: "Try today's Daily Challenge!"
 * - Session 5: "You've been added to a Wellness League!"
 * - Session 7: "Chests contain rewards!"
 *
 * Each tooltip: dismissible on tap / "Got it" button, never shows again.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Types
// ============================================================================

/** Tooltip identifier */
export type TooltipId =
    | 'journey_map_intro'
    | 'xp_earned'
    | 'streak_intro'
    | 'daily_challenge'
    | 'wellness_league'
    | 'chest_rewards';

/** Where to point the tooltip */
export type TooltipAnchor =
    | 'active_node'
    | 'xp_counter'
    | 'streak_banner'
    | 'daily_challenge_card'
    | 'league_badge'
    | 'chest_node';

/** Configuration for a single tooltip */
export interface TooltipConfig {
    id: TooltipId;
    /** Which session number this tooltip first appears (1-indexed) */
    triggerSession: number;
    /** The tooltip message */
    message: string;
    /** What UI element to point at */
    anchor: TooltipAnchor;
    /** Optional: only show after a specific event (e.g., 'first_node_complete') */
    triggerEvent?: string;
}

/** Persisted state in AsyncStorage */
export interface TooltipState {
    /** Map of tooltipId → whether it has been dismissed */
    dismissed: Record<string, boolean>;
    /** Current session count (incremented on each app open) */
    sessionCount: number;
}

export interface UseTooltipSchedulerReturn {
    /** The tooltip that should currently be shown (null = none) */
    activeTooltip: TooltipConfig | null;
    /** Dismiss the current tooltip (marks as permanently dismissed) */
    dismissTooltip: () => Promise<void>;
    /** Manually trigger a tooltip by event name (e.g., after first node complete) */
    triggerEvent: (eventName: string) => void;
    /** Current session number */
    sessionCount: number;
    /** Whether data is still loading from AsyncStorage */
    isLoading: boolean;
    /** Check if a specific tooltip has been dismissed */
    isTooltipDismissed: (id: TooltipId) => boolean;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = '@tooltip_schedule_v1';

/** All tooltips in priority order (first matching undismissed tooltip wins) */
const TOOLTIP_SCHEDULE: TooltipConfig[] = [
    {
        id: 'journey_map_intro',
        triggerSession: 1,
        message: 'This is your journey map. Tap a node to start!',
        anchor: 'active_node',
    },
    {
        id: 'xp_earned',
        triggerSession: 1,
        message: 'You earned Insight Points! Complete nodes to earn more.',
        anchor: 'xp_counter',
        triggerEvent: 'first_node_complete',
    },
    {
        id: 'streak_intro',
        triggerSession: 2,
        message: "You're on a streak! Come back tomorrow to keep it going.",
        anchor: 'streak_banner',
    },
    {
        id: 'daily_challenge',
        triggerSession: 3,
        message: "Try today's Daily Challenge for bonus IP!",
        anchor: 'daily_challenge_card',
    },
    {
        id: 'wellness_league',
        triggerSession: 5,
        message: "You've been added to a Wellness League!",
        anchor: 'league_badge',
    },
    {
        id: 'chest_rewards',
        triggerSession: 7,
        message: 'Chests contain rewards! Complete nodes to unlock them.',
        anchor: 'chest_node',
    },
];

// ============================================================================
// Helpers
// ============================================================================

async function loadState(): Promise<TooltipState> {
    try {
        const raw: string | null = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as TooltipState;
        }
    } catch (err) {
        console.warn('[TooltipScheduler] Failed to load state:', err);
    }
    return { dismissed: {}, sessionCount: 0 };
}

async function saveState(state: TooltipState): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.warn('[TooltipScheduler] Failed to save state:', err);
    }
}

// ============================================================================
// Hook
// ============================================================================

export function useTooltipScheduler(): UseTooltipSchedulerReturn {
    const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
    const [sessionCount, setSessionCount] = useState<number>(0);
    const [firedEvents, setFiredEvents] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load persisted state + increment session count on mount
    useEffect(() => {
        (async () => {
            const state: TooltipState = await loadState();
            const newSession: number = state.sessionCount + 1;

            setDismissed(state.dismissed);
            setSessionCount(newSession);

            // Persist the bumped session count
            await saveState({ ...state, sessionCount: newSession });
            setIsLoading(false);
        })();
    }, []);

    // Determine which tooltip to show
    const activeTooltip: TooltipConfig | null = useMemo(() => {
        if (isLoading || sessionCount === 0) return null;

        for (const tooltip of TOOLTIP_SCHEDULE) {
            // Skip if already dismissed
            if (dismissed[tooltip.id]) continue;

            // Skip if session threshold not met
            if (sessionCount < tooltip.triggerSession) continue;

            // Skip if requires a trigger event that hasn't fired
            if (tooltip.triggerEvent && !firedEvents.has(tooltip.triggerEvent)) continue;

            return tooltip;
        }

        return null;
    }, [isLoading, sessionCount, dismissed, firedEvents]);

    // Dismiss the current tooltip permanently
    const dismissTooltip = useCallback(async (): Promise<void> => {
        if (!activeTooltip) return;

        const newDismissed: Record<string, boolean> = {
            ...dismissed,
            [activeTooltip.id]: true,
        };

        setDismissed(newDismissed);
        await saveState({ dismissed: newDismissed, sessionCount });
    }, [activeTooltip, dismissed, sessionCount]);

    // Fire an event that may unlock event-gated tooltips
    const triggerEvent = useCallback(
        (eventName: string): void => {
            setFiredEvents((prev: Set<string>) => {
                if (prev.has(eventName)) return prev;
                const next: Set<string> = new Set(prev);
                next.add(eventName);
                return next;
            });
        },
        [],
    );

    const isTooltipDismissed = useCallback(
        (id: TooltipId): boolean => {
            return dismissed[id] === true;
        },
        [dismissed],
    );

    return {
        activeTooltip,
        dismissTooltip,
        triggerEvent,
        sessionCount,
        isLoading,
        isTooltipDismissed,
    };
}

export default useTooltipScheduler;
