/**
 * CheckpointRenderer (P1.3.6)
 * Full-screen celebration for section completion.
 *
 * Features:
 * - "Section Complete!" title with scale-in spring animation
 * - Badge reveal with glow effect
 * - Skills recap bullet list
 * - Mood comparison (before/after from section mood checks)
 * - XP earned animated counter
 * - Confetti particles (reuses existing ConfettiExplosion)
 * - "Continue to next section" / "Journey Complete!" CTA
 * - Heavy haptic on badge reveal
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import * as Haptics from 'expo-haptics';

import { PressableScale } from '@/src/components/ui/PressableScale';
import { ConfettiExplosion } from '@/src/components/animations/ConfettiExplosion';
import { Text } from '@/src/components/ui/Text';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { CheckpointContent } from '@/src/types/journey/mentalHealth';
import { BRAND_SURFACE, SAGE } from '@/lib/tokens';

// ============================================================================
// Types
// ============================================================================

export interface CheckpointRendererProps {
    /** Checkpoint node content from template JSONB */
    content: CheckpointContent;
    /** Node title */
    title: string;
    /** XP earned for this checkpoint */
    xpEarned: number;
    /** Mood data from section mood checks (optional) */
    moodBefore?: { emoji: string; rating: number } | null;
    moodAfter?: { emoji: string; rating: number } | null;
    /** Called when user taps continue */
    onComplete: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Badge key → emoji mapping */
const BADGE_MAP: Record<string, string> = {
    thought_challenger: '🧠',
    emotion_explorer: '❤️',
    calm_warrior: '🧘',
    mindfulness_master: '🌟',
    resilience_builder: '🛡️',
    self_compassion: '🤗',
    growth_mindset: '🌱',
    anxiety_tamer: '⚡',
    mood_tracker: '📊',
    journaling_pro: '✍️',
    default: '⭐',
};

import { SPRING_BOUNCY, SPRING_GENTLE } from "@/src/utils/motionTokens";

// ============================================================================
// Sub-components
// ============================================================================

/** Animated badge circle with glow */
function BadgeReveal({
    badgeKey,
    badgeName,
}: {
    badgeKey: string;
    badgeName: string;
}): React.JSX.Element {
    const scale = useSharedValue<number>(0);
    const glowOpacity = useSharedValue<number>(0);

    useEffect(() => {
        // Badge entrance with bounce
        scale.value = withDelay(
            400,
            withSequence(
                withSpring(1.3, { damping: 6, stiffness: 150 }),
                withSpring(1, { damping: 10, stiffness: 120 }),
            ),
        );
        // Glow pulse
        glowOpacity.value = withDelay(
            400,
            withSequence(
                withTiming(0.8, { duration: 300 }),
                withTiming(0.3, { duration: 600 }),
            ),
        );
        // Heavy haptic on reveal
        const timer = setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 400);
        return () => clearTimeout(timer);
    }, [scale, glowOpacity]);

    const badgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const emoji: string = BADGE_MAP[badgeKey] ?? BADGE_MAP.default;

    return (
        <View className="items-center mb-6">
            {/* Glow ring */}
            <Animated.View
                style={glowStyle}
                className="bg-sage-100 absolute w-[140px] h-[140px] rounded-[70px]"
            />

            {/* Badge */}
            <Animated.View
                style={badgeStyle}
                className="h-28 w-28 items-center justify-center rounded-full border-4 border-sage-300 bg-sage-pill"
            >
                <Text className="text-[52px]">{emoji}</Text>
            </Animated.View>

            {/* Badge name */}
            <Animated.View style={badgeStyle}>
                <Text variant="h2" className="mt-3 text-center text-ink">
                    {badgeName}
                </Text>
            </Animated.View>
        </View>
    );
}

/** Animated title */
function CelebrationTitle({
    isJourneyComplete,
}: {
    isJourneyComplete: boolean;
}): React.JSX.Element {
    const scale = useSharedValue<number>(0.5);
    const opacity = useSharedValue<number>(0);

    useEffect(() => {
        scale.value = withSpring(1, SPRING_BOUNCY);
        opacity.value = withTiming(1, { duration: 400 });
    }, [scale, opacity]);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={style} className="items-center mb-4">
            <Text variant="display" className="text-center text-ink">
                {isJourneyComplete ? 'Journey Complete! 🎉' : 'Section Complete! ⭐'}
            </Text>
        </Animated.View>
    );
}

/** Skills recap list */
function SkillsRecap({
    skills,
}: {
    skills: string[];
}): React.JSX.Element | null {
    if (skills.length === 0) return null;

    return (
        <Card variant="tile" className="mb-5 p-5" showDepth>
            <Text variant="eyebrow" className="mb-3">
                Skills You've Learned
            </Text>
            <View className="gap-2">
                {skills.map((skill: string, index: number) => (
                    <View key={index} className="flex-row items-start gap-2">
                        <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-sage-pill">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} color={SAGE[600]} />
                        </View>
                        <Text variant="body" className="flex-1 text-sm leading-5 text-ink-soft">
                            {skill}
                        </Text>
                    </View>
                ))}
            </View>
        </Card>
    );
}

/** Mood comparison card */
function MoodComparison({
    moodBefore,
    moodAfter,
}: {
    moodBefore: { emoji: string; rating: number };
    moodAfter: { emoji: string; rating: number };
}): React.JSX.Element {
    const improved: boolean = moodAfter.rating > moodBefore.rating;
    const same: boolean = moodAfter.rating === moodBefore.rating;

    return (
        <Card variant="tile" className="mb-5 p-5" showDepth>
            <Text variant="eyebrow" className="mb-3">
                Your Mood Journey
            </Text>

            <View className="flex-row items-center justify-around mb-3">
                {/* Before */}
                <View className="items-center">
                    <Text className="text-3xl mb-1">{moodBefore.emoji}</Text>
                    <Text variant="caption-muted" className="text-xs text-ink-muted">Section start</Text>
                    <Text variant="body-bold" className="text-sm text-ink">{moodBefore.rating}/5</Text>
                </View>

                {/* Arrow */}
                <Text variant="h2" className="text-sage-300">→</Text>

                {/* After */}
                <View className="items-center">
                    <Text className="text-3xl mb-1">{moodAfter.emoji}</Text>
                    <Text variant="caption-muted" className="text-xs text-ink-muted">Now</Text>
                    <Text variant="body-bold" className="text-sm text-ink">{moodAfter.rating}/5</Text>
                </View>
            </View>

            <Text variant="label-bold" className="text-center text-sm text-sage-600">
                {improved
                    ? 'Your mood improved — great progress! 🌟'
                    : same
                        ? 'Your mood stayed steady — consistency is key! 🤝'
                        : 'Some sessions feel harder — and that\'s okay 💙'}
            </Text>
        </Card>
    );
}

/** XP earned badge */
function XPBadge({ xp }: { xp: number }): React.JSX.Element {
    const scale = useSharedValue<number>(0);

    useEffect(() => {
        scale.value = withDelay(800, withSpring(1, SPRING_GENTLE));
    }, [scale]);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={style} className="items-center mb-6">
            <View className="flex-row items-center gap-2 rounded-[22px] border-2 border-sage-200 bg-sage-50 px-6 py-3">
                <Text variant="h2" className="text-2xl">⚡</Text>
                <Text variant="body-bold" className="text-xl text-sage-700">+{xp} IP</Text>
            </View>
        </Animated.View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CheckpointRenderer({
    content,
    title,
    xpEarned,
    moodBefore,
    moodAfter,
    onComplete,
}: CheckpointRendererProps): React.JSX.Element {
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const isJourneyComplete: boolean = content.is_journey_complete ?? false;

    // Trigger confetti on mount
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleConfettiComplete = useCallback((): void => {
        setShowConfetti(false);
    }, []);

    const showMoodComparison: boolean =
        content.show_mood_comparison && moodBefore !== null && moodBefore !== undefined && moodAfter !== null && moodAfter !== undefined;

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                {/* Confetti overlay */}
                <ConfettiExplosion
                    isVisible={showConfetti}
                    count={30}
                    duration={1200}
                    onAnimationComplete={handleConfettiComplete}
                />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 }}
                >
                    {/* Animated title */}
                    <CelebrationTitle isJourneyComplete={isJourneyComplete} />

                    {/* Badge reveal */}
                    <BadgeReveal
                        badgeKey={content.badge_key}
                        badgeName={content.badge_name}
                    />

                    {/* Badge description */}
                    <Text variant="body" className="mb-6 px-4 text-center text-sm leading-5 text-ink-muted">
                        {content.badge_description}
                    </Text>

                    {/* XP earned */}
                    <XPBadge xp={xpEarned} />

                    {/* Skills recap */}
                    <SkillsRecap skills={content.skills_recap} />

                    {/* Mood comparison */}
                    {showMoodComparison && moodBefore && moodAfter ? (
                        <MoodComparison moodBefore={moodBefore} moodAfter={moodAfter} />
                    ) : null}

                    {/* Next journey suggestion (if journey complete) */}
                    {isJourneyComplete && content.next_journey_suggestion ? (
                        <Card variant="tile" className="mb-5 p-5" showDepth>
                            <Text variant="eyebrow" className="mb-2">
                                Recommended Next
                            </Text>
                            <Text variant="body-bold" className="mb-1 text-base text-ink">
                                {content.next_journey_suggestion.title}
                            </Text>
                            <Text variant="body" className="text-sm leading-5 text-ink-soft">
                                {content.next_journey_suggestion.reason}
                            </Text>
                        </Card>
                    ) : null}
                </ScrollView>

                {/* CTA button */}
                <View className="px-5 pb-4 pt-2">
                    <Button
                        label={isJourneyComplete ? 'Journey Complete!' : 'Continue'}
                        onPress={onComplete}
                        variant="primary"
                        rightIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={18} color={BRAND_SURFACE} />}
                        accessibilityLabel={
                            isJourneyComplete ? 'Complete journey' : 'Continue to next section'
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
