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
            <Text className="text-lg font-semibold text-slate-800 mb-4 text-center">
                {label}
            </Text>

            <View className="flex-row items-center justify-center gap-3">
                {MOOD_OPTIONS.map((option) => {
                    const isSelected: boolean = value === option.key;
                    const source: ImageSourcePropType = emotions[option.key];

                    return (
                        <Pressable
                            key={option.key}
                            onPress={() => handlePress(option.key)}
                            className={`items-center p-2 rounded-2xl ${isSelected
                                ? 'bg-purple-50 border-2 border-purple-300'
                                : 'border-2 border-transparent'
                                }`}
                            accessibilityLabel={`${option.label} mood`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Image
                                source={source}
                                className="w-12 h-12"
                                resizeMode="contain"
                            />
                            <Text
                                className={`text-xs mt-1 font-medium ${isSelected ? 'text-purple-600' : 'text-slate-400'
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
