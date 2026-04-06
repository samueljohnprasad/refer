/**
 * useAuthGate (P1.6.1)
 *
 * Guard hook that determines whether a node press should proceed,
 * show a sign-up prompt, or show a locked state based on:
 * 1. Authentication status
 * 2. Number of nodes completed as guest
 *
 * Rules:
 * - Authenticated users → always allowed
 * - Guest users with < FREE_NODE_LIMIT completions → allowed (local progress)
 * - Guest users at/past FREE_NODE_LIMIT → blocked, show sign-up prompt
 *
 * This hook does NOT render UI — it returns gating decisions.
 * The container wires these to the SignUpPromptModal.
 */

import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { FREE_NODE_LIMIT } from '@/src/hooks/useGuestProgress';
import type { UseGuestProgressReturn } from '@/src/hooks/useGuestProgress';

// ============================================================================
// Types
// ============================================================================

/** The result of a gate check */
export type GateDecision =
    | { allowed: true }
    | { allowed: false; reason: 'auth_required'; completedCount: number };

export interface UseAuthGateReturn {
    /** Whether the user is authenticated */
    isAuthenticated: boolean;
    /** Whether the user is a guest (not authenticated) */
    isGuest: boolean;
    /** Check if a node press is allowed for a given journey */
    checkNodeAccess: (journeyId: string) => GateDecision;
    /** Whether the sign-up prompt should be shown */
    showSignUpPrompt: boolean;
    /** Trigger the sign-up prompt */
    triggerSignUpPrompt: () => void;
    /** Dismiss the sign-up prompt */
    dismissSignUpPrompt: () => void;
    /** Number of free nodes remaining for a journey */
    freeNodesRemaining: (journeyId: string) => number;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuthGate(
    guestProgress: UseGuestProgressReturn,
): UseAuthGateReturn {
    const { user } = useAuth();
    const [showSignUpPrompt, setShowSignUpPrompt] = useState<boolean>(false);

    const isAuthenticated: boolean = useMemo(() => user !== null, [user]);
    const isGuest: boolean = !isAuthenticated;

    const checkNodeAccess = useCallback(
        (journeyId: string): GateDecision => {
            // Authenticated users always pass
            if (isAuthenticated) {
                return { allowed: true };
            }

            // Guest: check completion count
            const completedCount: number =
                guestProgress.completedCountForJourney(journeyId);

            if (completedCount >= FREE_NODE_LIMIT) {
                return {
                    allowed: false,
                    reason: 'auth_required',
                    completedCount,
                };
            }

            return { allowed: true };
        },
        [isAuthenticated, guestProgress],
    );

    const freeNodesRemaining = useCallback(
        (journeyId: string): number => {
            if (isAuthenticated) return Infinity;
            const completed: number =
                guestProgress.completedCountForJourney(journeyId);
            return Math.max(0, FREE_NODE_LIMIT - completed);
        },
        [isAuthenticated, guestProgress],
    );

    const triggerSignUpPrompt = useCallback((): void => {
        setShowSignUpPrompt(true);
    }, []);

    const dismissSignUpPrompt = useCallback((): void => {
        setShowSignUpPrompt(false);
    }, []);

    return {
        isAuthenticated,
        isGuest,
        checkNodeAccess,
        showSignUpPrompt,
        triggerSignUpPrompt,
        dismissSignUpPrompt,
        freeNodesRemaining,
    };
}

export default useAuthGate;
