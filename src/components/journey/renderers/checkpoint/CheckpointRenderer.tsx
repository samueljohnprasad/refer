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
import { View, Text, ScrollView } from 'react-native';
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
import { CheckpointContent } from '@/src/types/journey';

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

const SPRING_BOUNCY = { damping: 8, stiffness: 100 };
const SPRING_GENTLE = { damping: 15, stiffness: 120 };

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
                style={[glowStyle, { position: 'absolute', width: 140, height: 140, borderRadius: 70 }]}
                className="bg-yellow-200"
            />

            {/* Badge */}
            <Animated.View
                style={badgeStyle}
                className="w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-300 items-center justify-center"
            >
                <Text style={{ fontSize: 52 }}>{emoji}</Text>
            </Animated.View>

            {/* Badge name */}
            <Animated.View style={badgeStyle}>
                <Text className="text-lg font-bold text-amber-700 mt-3 text-center">
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
            <Text className="text-3xl font-bold text-slate-900 text-center">
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
        <View className="bg-slate-50 rounded-2xl p-5 mb-5 border border-slate-100">
            <Text className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                Skills You've Learned
            </Text>
            <View className="gap-2">
                {skills.map((skill: string, index: number) => (
                    <View key={index} className="flex-row items-start gap-2">
                        <View className="w-5 h-5 rounded-full bg-green-100 items-center justify-center mt-0.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} color="#16A34A" />
                        </View>
                        <Text className="flex-1 text-sm text-slate-600 leading-5">
                            {skill}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
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
        <View className="bg-blue-50 rounded-2xl p-5 mb-5 border border-blue-100">
            <Text className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3">
                Your Mood Journey
            </Text>

            <View className="flex-row items-center justify-around mb-3">
                {/* Before */}
                <View className="items-center">
                    <Text className="text-3xl mb-1">{moodBefore.emoji}</Text>
                    <Text className="text-xs text-slate-500">Section start</Text>
                    <Text className="text-sm font-bold text-slate-700">{moodBefore.rating}/5</Text>
                </View>

                {/* Arrow */}
                <Text className="text-2xl text-blue-300">→</Text>

                {/* After */}
                <View className="items-center">
                    <Text className="text-3xl mb-1">{moodAfter.emoji}</Text>
                    <Text className="text-xs text-slate-500">Now</Text>
                    <Text className="text-sm font-bold text-slate-700">{moodAfter.rating}/5</Text>
                </View>
            </View>

            <Text className="text-sm text-blue-600 text-center font-medium">
                {improved
                    ? 'Your mood improved — great progress! 🌟'
                    : same
                        ? 'Your mood stayed steady — consistency is key! 🤝'
                        : 'Some sessions feel harder — and that\'s okay 💙'}
            </Text>
        </View>
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
            <View className="bg-amber-50 border-2 border-amber-200 px-6 py-3 rounded-2xl flex-row items-center gap-2">
                <Text className="text-2xl">⚡</Text>
                <Text className="text-xl font-bold text-amber-700">+{xp} IP</Text>
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
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
                <Text className="text-sm text-slate-400 text-center mb-6 px-4">
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
                    <View className="bg-purple-50 rounded-2xl p-5 mb-5 border border-purple-100">
                        <Text className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">
                            Recommended Next
                        </Text>
                        <Text className="text-base font-semibold text-purple-800 mb-1">
                            {content.next_journey_suggestion.title}
                        </Text>
                        <Text className="text-sm text-purple-600 leading-5">
                            {content.next_journey_suggestion.reason}
                        </Text>
                    </View>
                ) : null}
            </ScrollView>

            {/* CTA button */}
            <View className="px-5 pb-4 pt-2">
                <PressableScale
                    onPress={onComplete}
                    scale={0.96}
                    hapticStyle="medium"
                    style={{
                        backgroundColor: isJourneyComplete ? '#8B5CF6' : '#16A34A',
                        paddingVertical: 16,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 4,
                        borderBottomColor: isJourneyComplete ? '#7C3AED' : '#15803D',
                    }}
                    accessibilityLabel={
                        isJourneyComplete ? 'Complete journey' : 'Continue to next section'
                    }
                    accessibilityRole="button"
                >
                    <Text className="text-base font-bold text-white mr-1">
                        {isJourneyComplete ? 'Journey Complete!' : 'Continue'}
                    </Text>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#FFFFFF" />
                </PressableScale>
            </View>
        </SafeAreaView>
    );
}
