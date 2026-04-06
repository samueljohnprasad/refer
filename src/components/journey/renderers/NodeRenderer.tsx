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
    onComplete: (responseData: NodeResponseData) => void;
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-5xl mb-4">🚧</Text>
                <Text className="text-xl font-bold text-slate-900 text-center mb-2">
                    Coming Soon
                </Text>
                <Text className="text-sm text-slate-400 text-center mb-8">
                    The "{nodeType}" node type is not yet available.
                </Text>
                <PressableScale
                    onPress={onClose}
                    scale={0.96}
                    hapticStyle="light"
                    style={{
                        backgroundColor: '#F1F5F9',
                        paddingVertical: 14,
                        paddingHorizontal: 32,
                        borderRadius: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color="#64748B" />
                    <Text className="text-sm font-semibold text-slate-600">Go Back</Text>
                </PressableScale>
            </View>
        </SafeAreaView>
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
        (responseData: NodeResponseData): void => {
            onComplete(responseData);
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
