/**
 * MoodPicker
 * 5-level emoji mood picker using existing emoji assets.
 * Reusable for mood_before and mood_after in journal nodes.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { Emotion, emotions } from '@/assets/emojis';

// ============================================================================
// Types
// ============================================================================

export interface MoodPickerProps {
    label: string;
    value: Emotion | null;
    onChange: (mood: Emotion) => void;
}

// ============================================================================
// Constants
// ============================================================================

const MOOD_OPTIONS: Array<{ key: Emotion; label: string }> = [
    { key: Emotion.Terrible, label: 'Terrible' },
    { key: Emotion.Bad, label: 'Bad' },
    { key: Emotion.Fine, label: 'Okay' },
    { key: Emotion.Good, label: 'Good' },
    { key: Emotion.Great, label: 'Great' },
];

// ============================================================================
// Component
// ============================================================================

export default function MoodPicker({
    label,
    value,
    onChange,
}: MoodPickerProps): React.JSX.Element {
    const handlePress = useCallback(
        (mood: Emotion): void => {
            onChange(mood);
        },
        [onChange],
    );

    return (
        <View className="mb-6">
            <Text className="happy-font-heading-bold mb-4 text-center text-[21px] leading-7 text-ink">
                {label}
            </Text>

            <View className="flex-row items-start justify-between">
                {MOOD_OPTIONS.map((option) => {
                    const isSelected: boolean = value === option.key;
                    const source: ImageSourcePropType = emotions[option.key];

                    return (
                        <Pressable
                            key={option.key}
                            onPress={() => handlePress(option.key)}
                            className={`items-center rounded-[22px] p-2 ${isSelected
                                ? 'happy-brand-card-selected'
                                : 'happy-brand-card'
                                }`}
                            accessibilityLabel={`${option.label} mood`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Image
                                source={source}
                                className="h-11 w-11"
                                resizeMode="contain"
                            />
                            <Text
                                className={`happy-font-body-bold mt-2 text-xs ${isSelected ? 'text-sage-600' : 'text-ink-muted'
                                    }`}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
