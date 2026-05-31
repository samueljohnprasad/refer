/**
 * NodeRenderer (P1.3.8)
 * Dispatcher component that routes node_type to the correct renderer.
 *
 * Accepts a MentalHealthTemplateNode and delegates to the appropriate
 * full-screen renderer based on nodeType.
 *
 * Responsibilities:
 * - Switch on nodeType → correct renderer
 * - Pass content + callbacks to each renderer
 * - Fallback for unknown node types
 * - Consistent full-screen presentation wrapper
 */

import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import {
    MentalHealthNodeType,
    type NodeContent,
    type NodeResponseData,
    type LearnContent,
    type ExerciseContent,
    type ExerciseResponseData,
    type JournalContent,
    type JournalResponseData,
    type QuizContent,
    type QuizResponseData,
    type MoodCheckContent,
    type MoodCheckResponseData,
    type CheckpointContent,
    type ChestContent,
    type ChestResponseData,
} from '@/src/types/journey/mentalHealth';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { INK_MUTED, SAGE } from '@/lib/tokens';

import LearnNodeRenderer from './LearnNodeRenderer';
import { ExerciseNodeRenderer } from './exercise';
import { JournalNodeRenderer } from './journal';
import { QuizNodeRenderer } from './quiz';
import { MoodCheckRenderer } from './moodcheck';
import { CheckpointRenderer } from './checkpoint';
import { ChestOpeningRenderer } from './chest';

// ============================================================================
// Types
// ============================================================================

export interface NodeRendererProps {
    /** Node type string (from MentalHealthNodeType enum) */
    nodeType: string;
    /** Rich content JSONB — shape varies by nodeType */
    content: NodeContent;
    /** Node title */
    title: string;
    /** Estimated minutes */
    estimatedMinutes: number;
    /** XP reward for this node */
    xpReward: number;
    /** Called when user completes the node with response data */
    onComplete: (responseData: NodeResponseData) => void | Promise<void>;
    /** Called when user taps back / close without completing */
    onClose: () => void;
    /** Called to save journal entries to the main journal system */
    onSaveToJournal?: (text: string, moodBefore?: string, moodAfter?: string) => void;
    /** Mood data for checkpoint mood comparison (optional) */
    checkpointMoodBefore?: { emoji: string; rating: number } | null;
    checkpointMoodAfter?: { emoji: string; rating: number } | null;
}

// ============================================================================
// Fallback
// ============================================================================

function UnknownNodeFallback({
    nodeType,
    onClose,
}: {
    nodeType: string;
    onClose: () => void;
}): React.JSX.Element {
    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-5xl mb-4">🚧</Text>
                    <Text className="happy-font-heading-bold text-center text-[34px] leading-10 text-ink">
                        Coming Soon
                    </Text>
                    <Text className="happy-font-body-medium mt-3 text-center text-base leading-6 text-ink-muted">
                        The "{nodeType}" node type is not yet available.
                    </Text>
                    <PressableScale
                        onPress={onClose}
                        scale={0.96}
                        hapticStyle="light"
                        className="bg-sage-pill py-[14px] px-8 rounded-[22px] flex-row items-center gap-2 mt-8"
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color={INK_MUTED} />
                        <Text className="happy-font-body-bold text-sm text-sage-600">Go Back</Text>
                    </PressableScale>
                </View>
            </SafeAreaView>
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function NodeRenderer({
    nodeType,
    content,
    title,
    estimatedMinutes,
    xpReward,
    onComplete,
    onClose,
    onSaveToJournal,
    checkpointMoodBefore,
    checkpointMoodAfter,
}: NodeRendererProps): React.JSX.Element {
    // ── Generic complete handler that wraps response data ──
    const handleCompleteGeneric = useCallback(
        (responseData: NodeResponseData) => {
            return onComplete(responseData);
        },
        [onComplete],
    );

    switch (nodeType) {
        // ── Learn ──
        case MentalHealthNodeType.LEARN:
            return (
                <LearnNodeRenderer
                    content={content as LearnContent}
                    title={title}
                    estimatedMinutes={estimatedMinutes}
                    xpReward={xpReward}
                    onComplete={() => handleCompleteGeneric({})}
                    onBack={onClose}
                />
            );

        // ── Exercise ──
        case MentalHealthNodeType.EXERCISE:
            return (
                <ExerciseNodeRenderer
                    content={content as ExerciseContent}
                    title={title}
                    xpReward={xpReward}
                    onComplete={(data: ExerciseResponseData) => handleCompleteGeneric(data)}
                    onBack={onClose}
                />
            );

        // ── Journal ──
        case MentalHealthNodeType.JOURNAL:
            return (
                <JournalNodeRenderer
                    content={content as JournalContent}
                    title={title}
                    xpReward={xpReward}
                    onComplete={(data: JournalResponseData) => handleCompleteGeneric(data)}
                    onSaveToJournal={onSaveToJournal ?? (() => { })}
                    onBack={onClose}
                />
            );

        // ── Quiz ──
        case MentalHealthNodeType.QUIZ:
            return (
                <QuizNodeRenderer
                    content={content as QuizContent}
                    title={title}
                    xpReward={xpReward}
                    onComplete={(data: QuizResponseData) => handleCompleteGeneric(data)}
                    onBack={onClose}
                />
            );

        // ── Mood Check ──
        case MentalHealthNodeType.MOOD_CHECK:
            return (
                <MoodCheckRenderer
                    content={content as MoodCheckContent}
                    title={title}
                    xpReward={xpReward}
                    onComplete={(data: MoodCheckResponseData) => handleCompleteGeneric(data)}
                    onBack={onClose}
                />
            );

        // ── Checkpoint ──
        case MentalHealthNodeType.CHECKPOINT:
            return (
                <CheckpointRenderer
                    content={content as CheckpointContent}
                    title={title}
                    xpEarned={xpReward}
                    moodBefore={checkpointMoodBefore}
                    moodAfter={checkpointMoodAfter}
                    onComplete={() => handleCompleteGeneric({})}
                />
            );

        // ── Chest ──
        case MentalHealthNodeType.CHEST:
            return (
                <ChestOpeningRenderer
                    content={content as ChestContent}
                    title={title}
                    onComplete={(data: ChestResponseData) => handleCompleteGeneric(data)}
                />
            );

        // ── Unknown / Future types ──
        default:
            return <UnknownNodeFallback nodeType={nodeType} onClose={onClose} />;
    }
}
