/**
 * EmotionTagSelector
 * Optional emotion tag picker shown after writing.
 * Tap to toggle tags like happy, sad, anxious, calm, etc.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface EmotionTagSelectorProps {
    value: string[];
    onChange: (tags: string[]) => void;
}

// ============================================================================
// Constants
// ============================================================================

const EMOTION_TAGS: Array<{ key: string; emoji: string; label: string }> = [
    { key: 'happy', emoji: '😊', label: 'Happy' },
    { key: 'calm', emoji: '😌', label: 'Calm' },
    { key: 'grateful', emoji: '🙏', label: 'Grateful' },
    { key: 'hopeful', emoji: '🌟', label: 'Hopeful' },
    { key: 'sad', emoji: '😢', label: 'Sad' },
    { key: 'anxious', emoji: '😰', label: 'Anxious' },
    { key: 'angry', emoji: '😤', label: 'Angry' },
    { key: 'confused', emoji: '😕', label: 'Confused' },
    { key: 'tired', emoji: '😴', label: 'Tired' },
    { key: 'motivated', emoji: '💪', label: 'Motivated' },
    { key: 'relieved', emoji: '😮‍💨', label: 'Relieved' },
    { key: 'neutral', emoji: '😐', label: 'Neutral' },
];

// ============================================================================
// Component
// ============================================================================

export default function EmotionTagSelector({
    value,
    onChange,
}: EmotionTagSelectorProps): React.JSX.Element {
    const handleToggle = useCallback(
        (key: string): void => {
            const isSelected: boolean = value.includes(key);
            if (isSelected) {
                onChange(value.filter((v: string) => v !== key));
            } else {
                onChange([...value, key]);
            }
        },
        [value, onChange],
    );

    return (
        <View className="mb-4">
            <Text className="happy-font-body-bold mb-3 text-sm text-ink-soft">
                How are you feeling? (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {EMOTION_TAGS.map((tag) => {
                    const isSelected: boolean = value.includes(tag.key);
                    return (
                        <Pressable
                            key={tag.key}
                            onPress={() => handleToggle(tag.key)}
                            className={`flex-row items-center rounded-full px-3 py-2 ${isSelected
                                ? 'happy-brand-card-selected'
                                : 'happy-brand-card'
                                }`}
                            accessibilityLabel={`${tag.label}${isSelected ? ', selected' : ''}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Text className="text-sm mr-1">{tag.emoji}</Text>
                            <Text
                                className={`happy-font-body-bold text-xs ${isSelected ? 'text-sage-600' : 'text-ink-muted'
                                    }`}
                            >
                                {tag.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
