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
import { View, Text, TextInput, Image, Platform } from 'react-native';
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

// ============================================================================
// Types
// ============================================================================

export interface MoodCheckRendererProps {
    /** Mood check node content from template JSONB */
    content: MoodCheckContent;
    /** Node title */
    title: string;
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
                padding: 8,
                minWidth: 64,
                minHeight: 64,
            }}
            accessibilityLabel={`${label} mood, rating ${rating} of 5`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
        >
            <Animated.View style={animStyle}>
                <View
                    className={`w-16 h-16 rounded-2xl items-center justify-center ${isSelected
                        ? 'bg-purple-50 border-2 border-purple-300'
                        : 'bg-slate-50 border-2 border-transparent'
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
                className={`text-xs mt-1 font-medium ${isSelected ? 'text-purple-600' : 'text-slate-400'
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            {/* Minimal content — centered */}
            <View className="flex-1 justify-center px-6">
                {/* Prompt */}
                <Text className="text-2xl font-bold text-slate-900 text-center mb-2 leading-9">
                    {content.prompt}
                </Text>

                <Text className="text-sm text-slate-400 text-center mb-10">
                    Tap how you're feeling right now
                </Text>

                {/* Emoji selector row */}
                <View className="flex-row items-center justify-center gap-1 mb-10">
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

                {/* Optional note */}
                {content.note_enabled ? (
                    <View className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Anything you'd like to add? (optional)"
                            placeholderTextColor="#94A3B8"
                            maxLength={200}
                            className="text-base text-slate-700"
                            style={{ minHeight: 40 }}
                            accessibilityLabel="Optional note about your mood"
                        />
                    </View>
                ) : null}
            </View>

            {/* Bottom buttons */}
            <View className="flex-row items-center gap-3 px-5 pb-4 pt-2">
                <PressableScale
                    onPress={onBack}
                    scale={0.96}
                    hapticStyle="light"
                    style={{
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        borderRadius: 14,
                        backgroundColor: '#F1F5F9',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Text className="text-sm font-semibold text-slate-500">Back</Text>
                </PressableScale>

                <PressableScale
                    onPress={handleComplete}
                    scale={0.96}
                    hapticStyle="medium"
                    disabled={!canContinue}
                    style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 14,
                        backgroundColor: canContinue ? '#8B5CF6' : '#E2E8F0',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: canContinue ? 4 : 0,
                        borderBottomColor: '#7C3AED',
                        opacity: canContinue ? 1 : 0.6,
                    }}
                    accessibilityLabel="Continue"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !canContinue }}
                >
                    <Text
                        className={`text-base font-bold ${canContinue ? 'text-white' : 'text-slate-400'
                            }`}
                    >
                        Continue
                    </Text>
                </PressableScale>
            </View>
        </SafeAreaView>
    );
}
