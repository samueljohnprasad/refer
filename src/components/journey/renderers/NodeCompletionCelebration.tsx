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
import { View } from 'react-native';
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
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { BRAND_SURFACE, SAGE } from '@/lib/tokens';
import { SPRING_BOUNCY, SPRING_GENTLE } from '@/src/utils/motionTokens';

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
        transform: [{ scale: withDelay(200, withSpring(1, SPRING_BOUNCY)) }],
    }));

    return (
        <Animated.View style={scaleStyle} className="items-center mb-4">
            <View className="rounded-[24px] border-2 border-sage-200 bg-sage-50 px-8 py-4">
                <Text variant="display" className="text-[34px] leading-10 text-sage-700">
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
        scale.value = withDelay(400, withSpring(1, SPRING_BOUNCY));
    }, [scale]);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={style} className="items-center mb-6">
            <Text variant="h2" className="text-sage-600">
                🔥 {days === 1 ? 'Streak started!' : `Day ${days}!`}
            </Text>
            {milestoneHit && milestoneLabel ? (
                <View className="happy-brand-status-chip mt-2 px-4 py-1.5">
                    <Text variant="eyebrow">
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
            withSpring(0.6, SPRING_GENTLE),
        );
    }, [glowOpacity]);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const emoji: string = NODE_TYPE_EMOJI[nextNode.nodeType] ?? NODE_TYPE_EMOJI.default;

    return (
        <Card variant="tile" className="p-5 items-center w-full max-w-[280px]" showDepth>
            <Text variant="eyebrow" className="mb-3">
                Next Up
            </Text>
            <View className="relative items-center mb-2">
                {/* Glow */}
                <Animated.View
                    style={glowStyle}
                    className="absolute w-20 h-20 rounded-full bg-sage-200"
                />
                {/* Icon */}
                <View className="h-16 w-16 items-center justify-center rounded-[22px] border-2 border-sage-200 bg-sage-50 z-10">
                    <Text className="text-[28px]">{emoji}</Text>
                </View>
            </View>
            <Text variant="body-bold" className="text-center text-sm text-ink">
                {nextNode.title}
            </Text>
            <Text variant="chip" className="mt-1 text-xs text-sage-600">
                Just one more! ✨
            </Text>
        </Card>
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
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
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
                    <Text variant="display" className="mb-6 text-center text-ink">
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
                        <Button
                            label="Continue"
                            onPress={handleContinue}
                            variant="primary"
                            rightIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={18} color={BRAND_SURFACE} />}
                            accessibilityLabel="Continue to next activity"
                        />
                    ) : null}

                    {/* Done for now */}
                    <Button
                        label="Done for now"
                        onPress={handleDone}
                        variant="secondary"
                        accessibilityLabel="Return to journey map"
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
