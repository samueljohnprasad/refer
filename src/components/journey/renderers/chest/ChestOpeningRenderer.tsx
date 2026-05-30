/**
 * ChestOpeningRenderer (P1.3.7)
 * Chest reward reveal animation sequence.
 *
 * Flow:
 * 1. Closed chest with glow/shimmer (idle animation)
 * 2. "Tap to open" prompt
 * 3. On tap: chest opens with spring animation + particle burst
 * 4. Reward item rises from chest with reveal animation
 * 5. Reward name + description displayed
 * 6. "Awesome!" CTA to continue
 *
 * Rarity-based visual effects:
 * - Common: simple sparkle
 * - Uncommon: golden glow
 * - Rare: rainbow particles
 * - Legendary: extra particles (Phase 1 — fireworks in Phase 2)
 *
 * Reuses ChestNode shimmer/shake patterns and ConfettiExplosion.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withTiming,
    withRepeat,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { ChestContent, ChestRarity, ChestResponseData } from '@/src/types/journey/mentalHealth';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { ConfettiExplosion } from '@/src/components/animations/ConfettiExplosion';
import { GOLD, SAGE } from '@/lib/tokens';
import { SPRING_BOUNCY } from '@/src/utils/motionTokens';

// ============================================================================
// Types
// ============================================================================

export interface ChestOpeningRendererProps {
    /** Chest node content from template JSONB */
    content: ChestContent;
    /** Node title */
    title: string;
    /** Called when user taps "Awesome!" */
    onComplete: (responseData: ChestResponseData) => void;
}

/** Animation phase state machine */
type ChestPhase = 'idle' | 'opening' | 'revealed';

// ============================================================================
// Constants
// ============================================================================

/** Rarity → visual config */
const RARITY_CONFIG: Record<ChestRarity, {
    glowColor: string;
    bgColor: string;
    borderColor: string;
    particleCount: number;
    label: string;
    labelColor: string;
}> = {
    common: {
        glowColor: SAGE[100],
        bgColor: 'bg-sage-50',
        borderColor: 'border-sage-200',
        particleCount: 12,
        label: 'Common',
        labelColor: 'text-ink-muted',
    },
    uncommon: {
        glowColor: GOLD,
        bgColor: 'bg-sage-pill',
        borderColor: 'border-gold',
        particleCount: 20,
        label: 'Uncommon',
        labelColor: 'text-gold',
    },
    rare: {
        glowColor: SAGE[300],
        bgColor: 'bg-sage-selected',
        borderColor: 'border-sage-400',
        particleCount: 28,
        label: 'Rare',
        labelColor: 'text-sage-600',
    },
    legendary: {
        glowColor: GOLD,
        bgColor: 'bg-sage-pill',
        borderColor: 'border-gold',
        particleCount: 36,
        label: 'Legendary',
        labelColor: 'text-gold',
    },
};

/** Reward type → emoji */
const REWARD_EMOJI: Record<string, string> = {
    audio: '🎵',
    prompt: '📝',
    theme: '🎨',
    avatar: '👤',
    streak_freeze: '🧊',
    badge: '🏅',
    default: '🎁',
};

const SHIMMER_DURATION: number = 2500;

// ============================================================================
// Sub-components
// ============================================================================

/** Idle shimmer glow behind the chest */
function ChestShimmer({
    glowColor,
    visible,
}: {
    glowColor: string;
    visible: boolean;
}): React.JSX.Element | null {
    const shimmerProgress = useSharedValue<number>(0);

    useEffect(() => {
        if (visible) {
            shimmerProgress.value = withRepeat(
                withTiming(1, { duration: SHIMMER_DURATION, easing: Easing.linear }),
                -1,
                false,
            );
        }
    }, [visible, shimmerProgress]);

    const shimmerStyle = useAnimatedStyle(() => {
        const opacity: number = interpolate(
            shimmerProgress.value,
            [0, 0.3, 0.5, 0.7, 1],
            [0.3, 0.7, 1, 0.7, 0.3],
        );
        const scale: number = interpolate(
            shimmerProgress.value,
            [0, 0.5, 1],
            [0.9, 1.1, 0.9],
        );
        return { opacity, transform: [{ scale }] };
    });

    if (!visible) return null;

    return (
        <Animated.View
            style={[shimmerStyle, { backgroundColor: glowColor }]}
            className="absolute h-40 w-40 rounded-full"
            pointerEvents="none"
        />
    );
}

/** The chest itself with tap-to-open */
function ChestBody({
    phase,
    onTap,
}: {
    phase: ChestPhase;
    onTap: () => void;
}): React.JSX.Element {
    const shakeX = useSharedValue<number>(0);
    const chestScale = useSharedValue<number>(1);

    // Shake on opening
    useEffect(() => {
        if (phase === 'opening') {
            shakeX.value = withSequence(
                withTiming(-6, { duration: 50 }),
                withTiming(6, { duration: 50 }),
                withTiming(-4, { duration: 50 }),
                withTiming(4, { duration: 50 }),
                withTiming(0, { duration: 50 }),
            );
            chestScale.value = withSequence(
                withSpring(1.15, SPRING_BOUNCY),
                withSpring(0.85, SPRING_BOUNCY),
            );
        }
    }, [phase, shakeX, chestScale]);

    const bodyStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }, { scale: chestScale.value }],
    }));

    const isIdle: boolean = phase === 'idle';
    const chestEmoji: string = phase === 'revealed' ? '🎁' : '🎁';

    return (
        <Animated.View style={bodyStyle}>
            <Pressable
                onPress={isIdle ? onTap : undefined}
                disabled={!isIdle}
                className="h-28 w-28 items-center justify-center rounded-[32px] border-4 border-sage-300 bg-sage-pill"
                accessibilityLabel={isIdle ? 'Tap to open treasure chest' : 'Chest'}
                accessibilityRole="button"
            >
                <Text style={{ fontSize: 52 }}>{chestEmoji}</Text>
            </Pressable>
        </Animated.View>
    );
}

/** Reward reveal card that rises up */
function RewardReveal({
    content,
    rarity,
}: {
    content: ChestContent;
    rarity: ChestRarity;
}): React.JSX.Element {
    const translateY = useSharedValue<number>(60);
    const opacity = useSharedValue<number>(0);
    const scale = useSharedValue<number>(0.8);

    useEffect(() => {
        translateY.value = withDelay(200, withSpring(0, { damping: 12, stiffness: 100 }));
        opacity.value = withDelay(200, withTiming(1, { duration: 400 }));
        scale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 120 }));
    }, [translateY, opacity, scale]);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    const config = RARITY_CONFIG[rarity];
    const rewardEmoji: string = REWARD_EMOJI[content.reward_type] ?? REWARD_EMOJI.default;

    return (
        <Animated.View style={style} className="items-center mt-6">
            {/* Rarity label */}
            <View className="mb-3">
                <Text className={`happy-brand-eyebrow ${config.labelColor}`}>
                    {config.label}
                </Text>
            </View>

            {/* Reward icon */}
            <View className={`mb-4 h-20 w-20 items-center justify-center rounded-[24px] border-2 ${config.bgColor} ${config.borderColor}`}>
                <Text style={{ fontSize: 40 }}>{rewardEmoji}</Text>
            </View>

            {/* Reward name */}
            <Text className="happy-font-heading-bold mb-2 text-center text-[30px] leading-9 text-ink">
                {content.reward_name}
            </Text>

            {/* Reward description */}
            <Text className="happy-font-body-medium px-8 text-center text-sm leading-5 text-ink-muted">
                {content.reward_description}
            </Text>
        </Animated.View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ChestOpeningRenderer({
    content,
    title,
    onComplete,
}: ChestOpeningRendererProps): React.JSX.Element {
    const [phase, setPhase] = useState<ChestPhase>('idle');
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    const rarity: ChestRarity = content.rarity;
    const config = RARITY_CONFIG[rarity];

    const handleTapOpen = useCallback((): void => {
        // Heavy haptic burst
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setPhase('opening');

        // After shake, reveal
        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setPhase('revealed');
            setShowConfetti(true);
        }, 400);
    }, []);

    const handleConfettiComplete = useCallback((): void => {
        setShowConfetti(false);
    }, []);

    const handleComplete = useCallback((): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const responseData: ChestResponseData = {
            rewardType: content.reward_type,
            rewardKey: content.reward_key,
            rarity: content.rarity,
        };

        onComplete(responseData);
    }, [content, onComplete]);

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                {/* Confetti */}
                <ConfettiExplosion
                    isVisible={showConfetti}
                    count={config.particleCount}
                    duration={1400}
                    onAnimationComplete={handleConfettiComplete}
                />

                <View className="flex-1 items-center justify-center px-5">
                    {/* Title */}
                    <Text className="happy-brand-eyebrow mb-8">
                        {title}
                    </Text>

                    {/* Chest area */}
                    <View className="items-center justify-center relative">
                        <ChestShimmer glowColor={config.glowColor} visible={phase === 'idle'} />
                        <ChestBody phase={phase} onTap={handleTapOpen} />
                    </View>

                    {/* Tap to open prompt (idle only) */}
                    {phase === 'idle' ? (
                        <View className="mt-6 items-center">
                            <Text className="happy-font-body-bold mb-1 text-base text-sage-600">
                                Tap to Open!
                            </Text>
                            <Text className="happy-font-body-medium text-xs text-ink-muted">
                                A reward awaits inside
                            </Text>
                        </View>
                    ) : null}

                    {/* Reward reveal (after opening) */}
                    {phase === 'revealed' ? (
                        <RewardReveal content={content} rarity={rarity} />
                    ) : null}
                </View>

                {/* CTA (only after reveal) */}
                {phase === 'revealed' ? (
                    <View className="px-5 pb-4 pt-2">
                        <PressableScale
                            onPress={handleComplete}
                            scale={0.96}
                            hapticStyle="medium"
                            style={{
                                backgroundColor: SAGE[500],
                                paddingVertical: 16,
                                borderRadius: 22,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: 4,
                                borderBottomColor: SAGE[700],
                            }}
                            accessibilityLabel="Continue"
                            accessibilityRole="button"
                        >
                            <Text className="happy-font-body-bold text-base text-brand-surface">
                                Awesome! 🎉
                            </Text>
                        </PressableScale>
                    </View>
                ) : null}
            </SafeAreaView>
        </View>
    );
}
