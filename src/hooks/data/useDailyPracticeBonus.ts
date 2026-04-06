/**
 * useDailyPracticeBonus (P1.4.6)
 *
 * Manages the daily practice bonus node state:
 * - Selects a rotating exercise from completed sections
 * - Tracks whether the user has completed today's practice
 * - Provides the exercise content for the bonus node
 *
 * Replayable — can be completed once per day.
 * Bonus XP: +15 IP.
 */

import { useMemo, useState, useCallback } from 'react';

import type { MentalHealthTemplateNode, NodeContent } from '@/src/types/journey/mentalHealth';
import { MentalHealthNodeType } from '@/src/types/journey/mentalHealth';

// ============================================================================
// Types
// ============================================================================

export interface DailyPracticeState {
    /** Title of today's exercise */
    exerciseTitle: string;
    /** Whether completed today */
    completedToday: boolean;
    /** The template node for today's exercise (null if none available) */
    templateNode: MentalHealthTemplateNode | null;
    /** XP reward */
    xpReward: number;
    /** Mark today's practice as complete */
    markComplete: () => void;
    /** Whether there are any exercises available for daily practice */
    hasExercises: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DAILY_BONUS_XP: number = 15;

/** Node types eligible for daily practice rotation */
const PRACTICE_ELIGIBLE_TYPES: Set<string> = new Set([
    MentalHealthNodeType.EXERCISE,
    MentalHealthNodeType.JOURNAL,
    MentalHealthNodeType.MOOD_CHECK,
]);

/** Default exercise titles when none are available */
const DEFAULT_EXERCISES: string[] = [
    'Try Box Breathing 🧘',
    'Quick Gratitude Journal ✍️',
    'Mood Check-in 🪞',
    '5-4-3-2-1 Grounding 🌿',
    'Body Scan Meditation 🧠',
];

// ============================================================================
// Helpers
// ============================================================================

/** Get today's date as YYYY-MM-DD string for cache key */
function getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
}

/** Pick a deterministic daily exercise based on today's date */
function pickDailyIndex(items: number): number {
    const today: string = getTodayKey();
    let hash: number = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % items;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Select and manage the daily practice bonus exercise.
 *
 * @param completedNodes - Nodes the user has already completed (eligible for replay)
 * @param lastCompletionDate - ISO date string of last daily practice completion (from AsyncStorage)
 */
export function useDailyPracticeBonus(
    completedNodes: MentalHealthTemplateNode[],
    lastCompletionDate: string | null,
): DailyPracticeState {
    const [localCompletedToday, setLocalCompletedToday] = useState<boolean>(false);

    // Filter to practice-eligible completed nodes
    const eligibleNodes: MentalHealthTemplateNode[] = useMemo(
        () =>
            completedNodes.filter((n: MentalHealthTemplateNode) =>
                PRACTICE_ELIGIBLE_TYPES.has(n.nodeType),
            ),
        [completedNodes],
    );

    // Check if already completed today (from persisted state or local state)
    const completedToday: boolean = useMemo(() => {
        if (localCompletedToday) return true;
        if (lastCompletionDate === getTodayKey()) return true;
        return false;
    }, [localCompletedToday, lastCompletionDate]);

    // Pick today's exercise
    const { exerciseTitle, templateNode } = useMemo(() => {
        if (eligibleNodes.length > 0) {
            const idx: number = pickDailyIndex(eligibleNodes.length);
            const node: MentalHealthTemplateNode = eligibleNodes[idx];
            return {
                exerciseTitle: node.title ?? 'Daily Practice',
                templateNode: node,
            };
        }

        // No completed exercises yet — use a default title, no template node
        const defaultIdx: number = pickDailyIndex(DEFAULT_EXERCISES.length);
        return {
            exerciseTitle: DEFAULT_EXERCISES[defaultIdx],
            templateNode: null,
        };
    }, [eligibleNodes]);

    const markComplete = useCallback((): void => {
        setLocalCompletedToday(true);
    }, []);

    return {
        exerciseTitle,
        completedToday,
        templateNode,
        xpReward: DAILY_BONUS_XP,
        markComplete,
        hasExercises: eligibleNodes.length > 0,
    };
}

export default useDailyPracticeBonus;
