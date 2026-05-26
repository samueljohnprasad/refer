/**
 * MoodCheckRenderer (P1.3.5)
 * Quick mood entry — must be fast (30 seconds max).
 *
 * Features:
 * - Prompt text at top
 * - 5 emoji mood selector (large touch targets ≥48dp)
 * - Selected emoji scales up with spring animation
 * - Haptic feedback on selection
 * - Optional one-line note
 * - "Continue" auto-enabled on emoji selection
 * - Minimal UI — no distractions
 */

import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type {
    MoodCheckContent,
    MoodCheckResponseData,
} from '@/src/types/journey/mentalHealth';
import { Emotion, emotions } from '@/assets/emojis';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { INK_MUTED } from '@/lib/tokens';
import {
    RendererPrimaryCTA,
    RendererSectionCard,
    RendererTitleBlock,
    RendererTopProgress,
} from '../RendererFrame';

// ============================================================================
// Types
// ============================================================================

export interface MoodCheckRendererProps {
    /** Mood check node content from template JSONB */
    content: MoodCheckContent;
    /** Node title */
    title: string;
    /** XP reward displayed in the renderer header */
    xpReward?: number;
    /** Called when user taps continue */
    onComplete: (responseData: MoodCheckResponseData) => void;
    /** Called when user taps back */
    onBack: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/** 5-level mood options mapped to existing emoji assets and 1-5 rating */
const MOOD_OPTIONS: Array<{
    rating: number;
    emotion: Emotion;
    label: string;
}> = [
        { rating: 1, emotion: Emotion.Terrible, label: 'Terrible' },
        { rating: 2, emotion: Emotion.Bad, label: 'Bad' },
        { rating: 3, emotion: Emotion.Fine, label: 'Okay' },
        { rating: 4, emotion: Emotion.Good, label: 'Good' },
        { rating: 5, emotion: Emotion.Great, label: 'Great' },
    ];

const SPRING_CONFIG = { damping: 10, stiffness: 180 };

// ============================================================================
// Sub-components
// ============================================================================

/** Animated emoji button */
function MoodEmojiButton({
    rating,
    emotion,
    label,
    isSelected,
    onPress,
}: {
    rating: number;
    emotion: Emotion;
    label: string;
    isSelected: boolean;
    onPress: (rating: number) => void;
}): React.JSX.Element {
    const scale = useSharedValue<number>(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Animate on selection change
    React.useEffect(() => {
        scale.value = withSpring(isSelected ? 1.2 : 1, SPRING_CONFIG);
    }, [isSelected, scale]);

    const handlePress = useCallback((): void => {
        onPress(rating);
    }, [rating, onPress]);

    return (
        <PressableScale
            onPress={handlePress}
            scale={0.9}
            hapticStyle="light"
            style={{
                alignItems: 'center',
                width: 60,
                minHeight: 76,
                paddingVertical: 4,
            }}
            accessibilityLabel={`${label} mood, rating ${rating} of 5`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
        >
            <Animated.View style={animStyle}>
                <View
                    className={`h-[58px] w-[58px] items-center justify-center rounded-[22px] ${isSelected
                        ? 'happy-brand-card-selected'
                        : 'happy-brand-card'
                        }`}
                >
                    <Image
                        source={emotions[emotion]}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                </View>
            </Animated.View>
            <Text
                numberOfLines={1}
                className={`happy-font-body-bold mt-2 text-xs ${isSelected ? 'text-sage-600' : 'text-ink-muted'
                    }`}
            >
                {label}
            </Text>
        </PressableScale>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function MoodCheckRenderer({
    content,
    title,
    xpReward,
    onComplete,
    onBack,
}: MoodCheckRendererProps): React.JSX.Element {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [note, setNote] = useState<string>('');

    const canContinue: boolean = selectedRating !== null;

    const handleSelectMood = useCallback((rating: number): void => {
        setSelectedRating(rating);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const handleComplete = useCallback((): void => {
        if (selectedRating === null) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const responseData: MoodCheckResponseData = {
            moodRating: selectedRating,
            note: note.trim().length > 0 ? note.trim() : null,
        };

        onComplete(responseData);
    }, [selectedRating, note, onComplete]);

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                <RendererTopProgress
                    progress={selectedRating ? 0.75 : 0.35}
                    xpReward={xpReward}
                    onClose={onBack}
                />
                <RendererTitleBlock
                    eyebrow="Check in"
                    title={content.prompt || title}
                    subtitle="Name what is here. No need to fix it yet."
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 justify-between px-7 pb-5">
                        <View>
                            <RendererSectionCard eyebrow="Now: name yours">
                                <Text className="happy-font-heading-bold mb-4 text-[21px] leading-7 text-ink">
                                    How are you, really?
                                </Text>
                                <View className="flex-row items-start justify-between">
                                {MOOD_OPTIONS.map((option) => (
                                    <MoodEmojiButton
                                        key={option.rating}
                                        rating={option.rating}
                                        emotion={option.emotion}
                                        label={option.label}
                                        isSelected={selectedRating === option.rating}
                                        onPress={handleSelectMood}
                                    />
                                ))}
                                </View>
                            </RendererSectionCard>

                            {content.note_enabled ? (
                                <View className="happy-brand-preview-tile mt-10 rounded-[24px] px-4 py-3">
                                    <TextInput
                                        value={note}
                                        onChangeText={setNote}
                                        placeholder="Anything you'd like to add? (optional)"
                                        placeholderTextColor={INK_MUTED}
                                        maxLength={200}
                                        className="happy-font-body-medium text-base text-ink"
                                        style={{ minHeight: 44 }}
                                        accessibilityLabel="Optional note about your mood"
                                    />
                                </View>
                            ) : null}
                        </View>

                        <RendererPrimaryCTA
                            label="Continue"
                            onPress={handleComplete}
                            disabled={!canContinue}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
