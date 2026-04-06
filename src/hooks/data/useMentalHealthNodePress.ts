/**
 * useMentalHealthNodePress (P1.4.4)
 *
 * Handles node press events for mental health journey nodes.
 * Determines the correct action based on node status:
 * - LOCKED → show toast
 * - COMPLETED → show review (read-only for exercise/journal, reviewable for learn/quiz)
 * - ACTIVE → open NodeRenderer in full-screen modal
 *
 * On completion: calls useNodeCompletion → shows NodeCompletionCelebration → refreshes map.
 */

import { useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { NodeStatus } from '@/src/types/journey/enums';
import type { PathNodeData } from '@/src/types/journey/node';
import type {
    MentalHealthTemplateNode,
    NodeContent,
    NodeResponseData,
    MentalHealthNodeType,
} from '@/src/types/journey/mentalHealth';
import { isCheckpointNode } from '@/src/lib/journey/mentalHealthNodeMapping';

// ============================================================================
// Types
// ============================================================================

/** Reviewable node types — can be re-opened in read-only mode after completion */
const REVIEWABLE_TYPES: Set<string> = new Set(['learn', 'quiz']);

/** Non-reviewable types — show "Already completed" toast */
const NON_REVIEWABLE_TYPES: Set<string> = new Set(['exercise', 'journal', 'mood_check']);

/** State for the currently open node modal */
export interface ActiveNodeModal {
    /** The full template node data */
    templateNode: MentalHealthTemplateNode;
    /** Whether this is a read-only review */
    isReview: boolean;
}

/** State for the post-completion celebration */
export interface CelebrationState {
    xpEarned: number;
    nodeType: string;
    nodeTitle: string;
}

export interface UseMentalHealthNodePressReturn {
    /** Currently open node modal (null = closed) */
    activeModal: ActiveNodeModal | null;
    /** Post-completion celebration state (null = hidden) */
    celebration: CelebrationState | null;
    /** Handle a node press from the map */
    handleNodePress: (node: PathNodeData) => void;
    /** Close the active modal without completing */
    closeModal: () => void;
    /** Called when a node renderer completes */
    handleNodeComplete: (responseData: NodeResponseData) => void;
    /** Dismiss the celebration screen */
    dismissCelebration: () => void;
    /** Toast message to show (null = none) */
    toastMessage: string | null;
    /** Clear the toast */
    clearToast: () => void;
}

// ============================================================================
// Hook
// ============================================================================

export function useMentalHealthNodePress(
    nodeContentMap: Map<string, MentalHealthTemplateNode>,
    onCompleteNode: (nodeId: string, responseData: NodeResponseData) => Promise<void>,
): UseMentalHealthNodePressReturn {
    const [activeModal, setActiveModal] = useState<ActiveNodeModal | null>(null);
    const [celebration, setCelebration] = useState<CelebrationState | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleNodePress = useCallback(
        (node: PathNodeData): void => {
            const templateNode: MentalHealthTemplateNode | undefined = nodeContentMap.get(node.id);

            switch (node.status) {
                case NodeStatus.LOCKED:
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    setToastMessage('🔒 Complete previous nodes first');
                    break;

                case NodeStatus.COMPLETED:
                    if (!templateNode) {
                        setToastMessage('Node data not available');
                        break;
                    }
                    if (REVIEWABLE_TYPES.has(templateNode.nodeType)) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setActiveModal({ templateNode, isReview: true });
                    } else {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setToastMessage('✅ Already completed');
                    }
                    break;

                case NodeStatus.ACTIVE:
                    if (!templateNode) {
                        setToastMessage('Node data not available');
                        break;
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setActiveModal({ templateNode, isReview: false });
                    break;
            }
        },
        [nodeContentMap],
    );

    const closeModal = useCallback((): void => {
        setActiveModal(null);
    }, []);

    const handleNodeComplete = useCallback(
        async (responseData: NodeResponseData): Promise<void> => {
            if (!activeModal || activeModal.isReview) {
                // Review mode — just close
                setActiveModal(null);
                return;
            }

            const { templateNode } = activeModal;
            const nodeId: string = templateNode.id;

            // Close modal first for snappy feel
            setActiveModal(null);

            // Fire completion
            await onCompleteNode(nodeId, responseData);

            // Checkpoints have their own celebration — skip the generic one
            if (isCheckpointNode(templateNode.nodeType)) {
                return;
            }

            // Show celebration
            setCelebration({
                xpEarned: templateNode.xpReward,
                nodeType: templateNode.nodeType,
                nodeTitle: templateNode.title ?? 'Activity',
            });
        },
        [activeModal, onCompleteNode],
    );

    const dismissCelebration = useCallback((): void => {
        setCelebration(null);
    }, []);

    const clearToast = useCallback((): void => {
        setToastMessage(null);
    }, []);

    return {
        activeModal,
        celebration,
        handleNodePress,
        closeModal,
        handleNodeComplete,
        dismissCelebration,
        toastMessage,
        clearToast,
    };
}

export default useMentalHealthNodePress;
