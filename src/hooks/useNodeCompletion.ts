/**
 * useNodeCompletion
 * Called when a user finishes any mental health journey node.
 * Handles the entire completion pipeline:
 *
 * 1. Insert immutable completion log (user_node_completions)
 * 2. Mark the node complete via the existing RPC (complete_journey_node)
 * 3. Calculate XP: base xp_reward + bonuses (perfect quiz, streak, perfect day)
 * 4. Award Insight Points to the ledger
 * 5. Update streak
 * 6. Detect section/journey completion
 * 7. Unlock next section if needed
 *
 * Returns a mutation-style hook with `completeNode()` action and result state.
 */

import { useCallback, useState } from 'react';
import { useSetAtom } from 'jotai';

import type {
    NodeResponseData,
    QuizResponseData,
    UpdateStreakResponse,
    CompleteNodeResult,
    MentalHealthTemplateNode,
    IPSource,
} from '@/src/types/journey/mentalHealth';
import type { JourneyState } from '@/src/types/journey/state';
import { journeyStateAtom } from '@/src/store/journeyStore';
import { completeNode as completeNodeAction, unlockUnit } from '@/src/store/journeyActions';
import { completeNodeApi } from '@/src/lib/api/journeyApi';
import {
    logNodeCompletion,
    updateStreak,
    earnInsightPoints,
    type LogNodeCompletionPayload,
} from '@/src/lib/api/mentalHealthJourneyApi';
import type { MHJourneyTemplate, MHTemplateUnit } from '@/src/lib/api/mentalHealthJourneyApi';

// ============================================================================
// Types
// ============================================================================

/** Payload to complete a mental health node */
export interface CompleteNodeParams {
    /** Node UUID */
    nodeId: string;
    /** Journey UUID */
    journeyId: string;
    /** Enrollment UUID (from useJourneyMentalHealth) */
    enrollmentId: string;
    /** Node type string */
    nodeType: string;
    /** User's response data (answers, journal text, quiz results, mood, etc.) */
    responseData: NodeResponseData;
    /** Time spent on this node in seconds */
    durationSeconds: number;
    /** Mood rating 1-5 before the node (optional) */
    moodBefore?: number;
    /** Mood rating 1-5 after the node (optional) */
    moodAfter?: number;
}

/** Full result after completing a node */
export interface NodeCompletionResult extends CompleteNodeResult {
    /** Error message if completion failed */
    error: string | null;
}

/** Return type for the hook */
export interface UseNodeCompletionReturn {
    /** Execute the completion pipeline */
    completeNode: (params: CompleteNodeParams) => Promise<NodeCompletionResult>;
    /** Whether a completion is currently in progress */
    isCompleting: boolean;
    /** Last completion result (for animations/toasts) */
    lastResult: NodeCompletionResult | null;
    /** Clear the last result (after animation completes) */
    clearResult: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Bonus XP for a perfect quiz score */
const PERFECT_QUIZ_BONUS: number = 10;

/** Bonus XP for maintaining a streak (awarded per day milestone) */
const STREAK_BONUS_MAP: Record<number, number> = {
    3: 15,
    7: 30,
    14: 50,
    30: 100,
    60: 200,
    100: 500,
    365: 1000,
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Calculate total XP for a node completion including bonuses.
 */
function calculateXP(
    baseXP: number,
    nodeType: string,
    responseData: NodeResponseData,
    streakResult: UpdateStreakResponse | null,
): { totalXP: number; bonuses: Array<{ source: IPSource; amount: number }> } {
    const bonuses: Array<{ source: IPSource; amount: number }> = [];
    let totalXP: number = baseXP;

    // Perfect quiz bonus
    if (nodeType === 'quiz') {
        const quizData = responseData as QuizResponseData;
        if (quizData.score !== undefined && quizData.total !== undefined) {
            if (quizData.score === quizData.total) {
                totalXP += PERFECT_QUIZ_BONUS;
                bonuses.push({ source: 'quiz_perfect_bonus', amount: PERFECT_QUIZ_BONUS });
            }
        }
    }

    // Streak milestone bonus
    if (streakResult?.milestone && streakResult.milestone > 0) {
        const streakBonus: number = STREAK_BONUS_MAP[streakResult.milestone] ?? 0;
        if (streakBonus > 0) {
            totalXP += streakBonus;
            bonuses.push({ source: 'milestone_reward', amount: streakBonus });
        }
    }

    // Streak day bonus (small daily bonus for maintaining streak > 1)
    if (streakResult?.streakChanged && streakResult.currentStreak > 1) {
        const dailyStreakBonus: number = Math.min(streakResult.currentStreak, 10);
        totalXP += dailyStreakBonus;
        bonuses.push({ source: 'streak_bonus', amount: dailyStreakBonus });
    }

    return { totalXP, bonuses };
}

/**
 * Determine if completing this node finishes the current section.
 */
function checkSectionComplete(
    template: MHJourneyTemplate | null,
    nodeId: string,
): { sectionCompleted: boolean; isLastSection: boolean } {
    if (!template) return { sectionCompleted: false, isLastSection: false };

    for (let i = 0; i < template.units.length; i++) {
        const unit: MHTemplateUnit = template.units[i];
        const lastNode: MentalHealthTemplateNode | undefined = unit.nodes[unit.nodes.length - 1];

        if (lastNode?.id === nodeId) {
            return {
                sectionCompleted: true,
                isLastSection: i === template.units.length - 1,
            };
        }
    }

    return { sectionCompleted: false, isLastSection: false };
}

/**
 * Find the base XP for a node from the template.
 */
function findNodeXP(
    template: MHJourneyTemplate | null,
    nodeId: string,
): number {
    if (!template) return 10;

    for (const unit of template.units) {
        const node: MentalHealthTemplateNode | undefined = unit.nodes.find(
            (n: MentalHealthTemplateNode) => n.id === nodeId,
        );
        if (node) return node.xpReward;
    }
    return 10;
}

// ============================================================================
// Hook
// ============================================================================

export function useNodeCompletion(
    template: MHJourneyTemplate | null,
): UseNodeCompletionReturn {
    const [isCompleting, setIsCompleting] = useState<boolean>(false);
    const [lastResult, setLastResult] = useState<NodeCompletionResult | null>(null);

    const setJourneyState = useSetAtom(journeyStateAtom);

    const completeNode = useCallback(
        async (params: CompleteNodeParams): Promise<NodeCompletionResult> => {
            setIsCompleting(true);

            const errorResult = (msg: string): NodeCompletionResult => ({
                xpEarned: 0,
                newTotalXP: 0,
                streakUpdated: false,
                streak: null,
                sectionCompleted: false,
                journeyCompleted: false,
                error: msg,
            });

            try {
                // ── Step 1: Log immutable completion ──
                const completionPayload: LogNodeCompletionPayload = {
                    nodeId: params.nodeId,
                    journeyId: params.journeyId,
                    enrollmentId: params.enrollmentId,
                    nodeType: params.nodeType,
                    responseData: params.responseData,
                    xpEarned: 0, // Will be updated after XP calc
                    durationSeconds: params.durationSeconds,
                    moodBefore: params.moodBefore,
                    moodAfter: params.moodAfter,
                };

                const logRes = await logNodeCompletion(completionPayload);
                if (!logRes.success) {
                    const result = errorResult(logRes.error ?? 'Failed to log completion');
                    setLastResult(result);
                    return result;
                }

                // ── Step 2: Mark node complete via existing RPC ──
                const completeRes = await completeNodeApi({
                    enrollmentId: params.enrollmentId,
                    nodeId: params.nodeId,
                });

                if (!completeRes.success) {
                    console.warn('[useNodeCompletion] RPC failed, continuing with local update:', completeRes.error);
                }

                // ── Step 3: Update streak ──
                let streakResult: UpdateStreakResponse | null = null;
                const streakRes = await updateStreak();
                if (streakRes.success && streakRes.data) {
                    streakResult = streakRes.data;
                }

                // ── Step 4: Calculate XP with bonuses ──
                const baseXP: number = findNodeXP(template, params.nodeId);
                const { totalXP: xpEarned, bonuses } = calculateXP(
                    baseXP,
                    params.nodeType,
                    params.responseData,
                    streakResult,
                );

                // ── Step 5: Award Insight Points ──
                // Base node completion IP
                const ipRes = await earnInsightPoints({
                    amount: baseXP,
                    source: 'node_completion',
                    sourceId: params.nodeId,
                    journeyId: params.journeyId,
                    metadata: {
                        nodeType: params.nodeType,
                        durationSeconds: params.durationSeconds,
                    },
                });

                let newTotalXP: number = ipRes.success ? (ipRes.data?.amount ?? 0) : 0;

                // Award bonus IP entries
                for (const bonus of bonuses) {
                    const bonusRes = await earnInsightPoints({
                        amount: bonus.amount,
                        source: bonus.source,
                        sourceId: params.nodeId,
                        journeyId: params.journeyId,
                        metadata: {
                            nodeType: params.nodeType,
                            streakDay: streakResult?.currentStreak,
                        },
                    });
                    if (bonusRes.success) {
                        newTotalXP += bonus.amount;
                    }
                }

                // ── Step 6: Check section/journey completion ──
                const { sectionCompleted, isLastSection } = checkSectionComplete(
                    template,
                    params.nodeId,
                );
                const journeyCompleted: boolean = sectionCompleted && isLastSection;

                // ── Step 7: Optimistic Jotai state update ──
                setJourneyState((prev: JourneyState) => {
                    let next: JourneyState = completeNodeAction(prev, params.nodeId);

                    // If section complete, unlock next unit
                    if (sectionCompleted && !isLastSection) {
                        next = unlockUnit(next);
                    }

                    return next;
                });

                // ── Step 8: Build result ──
                const result: NodeCompletionResult = {
                    xpEarned,
                    newTotalXP,
                    streakUpdated: streakResult?.streakChanged ?? false,
                    streak: streakResult,
                    sectionCompleted,
                    journeyCompleted,
                    error: null,
                };

                setLastResult(result);
                return result;
            } catch (err) {
                console.error('[useNodeCompletion] Unexpected error:', err);
                const result = errorResult(err instanceof Error ? err.message : 'Unknown error');
                setLastResult(result);
                return result;
            } finally {
                setIsCompleting(false);
            }
        },
        [template, setJourneyState],
    );

    const clearResult = useCallback((): void => {
        setLastResult(null);
    }, []);

    return {
        completeNode,
        isCompleting,
        lastResult,
        clearResult,
    };
}
