/**
 * NodeCompletionCelebration (P1.3.9)
 * Post-node reward screen shown after every node completion
 * (except Checkpoints which have their own celebration).
 *
 * Features:
 * - "+X IP!" animated counter (counts up from 0)
 * - Streak status: "🔥 Day 12!" or "🔥 Streak started!"
 * - Streak milestone badge (if hit)
 * - "Next up" preview with subtle glow
 * - Two CTAs: "Continue" (open next node) + "Done for now" (return to map)
 * - Light confetti animation
 * - Medium haptic
 * - Auto-dismiss after 5 seconds if no interaction
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import * as Haptics from 'expo-haptics';

import { PressableScale } from '@/src/components/ui/PressableScale';
import { ConfettiExplosion } from '@/src/components/animations/ConfettiExplosion';

// ============================================================================
// Types
// ============================================================================

export interface NextNodePreview {
    title: string;
    nodeType: string;
    emoji: string;
}

export interface NodeCompletionCelebrationProps {
    /** XP earned for this node */
    xpEarned: number;
    /** Current streak day count */
    streakDays: number;
    /** Whether a streak milestone was just hit */
    streakMilestoneHit?: boolean;
    /** Streak milestone label (e.g., "7-Day Streak!") */
    streakMilestoneLabel?: string;
    /** Preview of the next node (null if no next node) */
    nextNode: NextNodePreview | null;
    /** Called when user taps "Continue" to open next node */
    onContinue: () => void;
    /** Called when user taps "Done for now" to return to map */
    onDone: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const AUTO_DISMISS_MS: number = 5000;
const XP_COUNT_DURATION: number = 800;

const NODE_TYPE_EMOJI: Record<string, string> = {
    learn: '📖',
    exercise: '🏋️',
    journal: '✍️',
    quiz: '❓',
    mood_check: '🪞',
    checkpoint: '⭐',
    chest: '🎁',
    default: '📚',
};

// ============================================================================
// Sub-components
// ============================================================================

/** Animated XP counter that counts up from 0 */
function XPCounter({ xp }: { xp: number }): React.JSX.Element {
    const [displayValue, setDisplayValue] = useState<number>(0);
    const progress = useSharedValue<number>(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: XP_COUNT_DURATION }, (finished) => {
            if (finished) {
                runOnJS(setDisplayValue)(xp);
            }
        });

        // Animate the counter via interval for smooth counting
        const startTime: number = Date.now();
        const interval = setInterval(() => {
            const elapsed: number = Date.now() - startTime;
            const fraction: number = Math.min(elapsed / XP_COUNT_DURATION, 1);
            const current: number = Math.round(fraction * xp);
            setDisplayValue(current);
            if (fraction >= 1) clearInterval(interval);
        }, 32);

        return () => clearInterval(interval);
    }, [xp, progress]);

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withDelay(200, withSpring(1, { damping: 8, stiffness: 100 })) }],
    }));

    return (
        <Animated.View style={scaleStyle} className="items-center mb-4">
            <View className="bg-amber-50 border-2 border-amber-200 px-8 py-4 rounded-2xl">
                <Text className="text-3xl font-bold text-amber-700">
                    +{displayValue} IP
                </Text>
            </View>
        </Animated.View>
    );
}

/** Streak display */
function StreakDisplay({
    days,
    milestoneHit,
    milestoneLabel,
}: {
    days: number;
    milestoneHit: boolean;
    milestoneLabel?: string;
}): React.JSX.Element {
    const scale = useSharedValue<number>(0.8);

    useEffect(() => {
        scale.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 120 }));
    }, [scale]);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={style} className="items-center mb-6">
            <Text className="text-lg font-semibold text-orange-600">
                🔥 {days === 1 ? 'Streak started!' : `Day ${days}!`}
            </Text>
            {milestoneHit && milestoneLabel ? (
                <View className="bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full mt-2">
                    <Text className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                        {milestoneLabel}
                    </Text>
                </View>
            ) : null}
        </Animated.View>
    );
}

/** Next node preview with glow */
function NextNodePreviewCard({
    nextNode,
}: {
    nextNode: NextNodePreview;
}): React.JSX.Element {
    const glowOpacity = useSharedValue<number>(0.3);

    useEffect(() => {
        glowOpacity.value = withDelay(
            600,
            withSpring(0.6, { damping: 15, stiffness: 80 }),
        );
    }, [glowOpacity]);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const emoji: string = NODE_TYPE_EMOJI[nextNode.nodeType] ?? NODE_TYPE_EMOJI.default;

    return (
        <View className="items-center mb-6">
            <Text className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                Next Up
            </Text>
            <View className="relative items-center">
                {/* Glow */}
                <Animated.View
                    style={[glowStyle, { position: 'absolute', width: 80, height: 80, borderRadius: 40 }]}
                    className="bg-blue-200"
                />
                {/* Icon */}
                <View className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 items-center justify-center mb-2">
                    <Text style={{ fontSize: 28 }}>{emoji}</Text>
                </View>
            </View>
            <Text className="text-sm font-semibold text-slate-700 text-center">
                {nextNode.title}
            </Text>
            <Text className="text-xs text-blue-500 font-medium mt-1">
                Just one more! ✨
            </Text>
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function NodeCompletionCelebration({
    xpEarned,
    streakDays,
    streakMilestoneHit = false,
    streakMilestoneLabel,
    nextNode,
    onContinue,
    onDone,
}: NodeCompletionCelebrationProps): React.JSX.Element {
    const [showConfetti, setShowConfetti] = useState<boolean>(true);
    const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [interacted, setInteracted] = useState<boolean>(false);

    // Medium haptic on mount
    useEffect(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, []);

    // Auto-dismiss after 5s if no interaction
    useEffect(() => {
        autoDismissRef.current = setTimeout(() => {
            if (!interacted) {
                onDone();
            }
        }, AUTO_DISMISS_MS);

        return () => {
            if (autoDismissRef.current) {
                clearTimeout(autoDismissRef.current);
            }
        };
    }, [interacted, onDone]);

    const cancelAutoDismiss = useCallback((): void => {
        setInteracted(true);
        if (autoDismissRef.current) {
            clearTimeout(autoDismissRef.current);
        }
    }, []);

    const handleContinue = useCallback((): void => {
        cancelAutoDismiss();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onContinue();
    }, [cancelAutoDismiss, onContinue]);

    const handleDone = useCallback((): void => {
        cancelAutoDismiss();
        onDone();
    }, [cancelAutoDismiss, onDone]);

    const handleConfettiComplete = useCallback((): void => {
        setShowConfetti(false);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            {/* Light confetti */}
            <ConfettiExplosion
                isVisible={showConfetti}
                count={16}
                duration={1000}
                onAnimationComplete={handleConfettiComplete}
            />

            <View className="flex-1 items-center justify-center px-6">
                {/* Celebration emoji */}
                <Text className="text-5xl mb-4">🎊</Text>

                {/* Title */}
                <Text className="text-2xl font-bold text-slate-900 text-center mb-6">
                    Well Done!
                </Text>

                {/* XP counter */}
                <XPCounter xp={xpEarned} />

                {/* Streak */}
                <StreakDisplay
                    days={streakDays}
                    milestoneHit={streakMilestoneHit}
                    milestoneLabel={streakMilestoneLabel}
                />

                {/* Next node preview */}
                {nextNode ? <NextNodePreviewCard nextNode={nextNode} /> : null}
            </View>

            {/* CTAs */}
            <View className="px-5 pb-4 pt-2 gap-3">
                {/* Continue to next node */}
                {nextNode ? (
                    <PressableScale
                        onPress={handleContinue}
                        scale={0.96}
                        hapticStyle="medium"
                        style={{
                            backgroundColor: '#3B82F6',
                            paddingVertical: 16,
                            borderRadius: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomWidth: 4,
                            borderBottomColor: '#2563EB',
                        }}
                        accessibilityLabel="Continue to next activity"
                        accessibilityRole="button"
                    >
                        <Text className="text-base font-bold text-white mr-1">
                            Continue
                        </Text>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#FFFFFF" />
                    </PressableScale>
                ) : null}

                {/* Done for now */}
                <PressableScale
                    onPress={handleDone}
                    scale={0.96}
                    hapticStyle="light"
                    style={{
                        backgroundColor: '#F1F5F9',
                        paddingVertical: 14,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    accessibilityLabel="Return to journey map"
                    accessibilityRole="button"
                >
                    <Text className="text-sm font-semibold text-slate-500">
                        Done for now
                    </Text>
                </PressableScale>
            </View>
        </SafeAreaView>
    );
}
