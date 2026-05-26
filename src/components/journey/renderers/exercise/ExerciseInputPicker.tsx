/**
 * ExerciseInputPicker
 * Emotion picker grid — tap to select one or multiple options.
 * Renders options as tappable pill buttons in a flex-wrap grid.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { RendererSectionCard } from '../RendererFrame';

// ============================================================================
// Types
// ============================================================================

export interface ExerciseInputPickerProps {
    prompt: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    allowMultiple?: boolean;
    minSelections?: number;
}

// ============================================================================
// Component
// ============================================================================

export default function ExerciseInputPicker({
    prompt,
    options,
    value,
    onChange,
    allowMultiple = false,
    minSelections = 1,
}: ExerciseInputPickerProps): React.JSX.Element {
    const handleOptionPress = useCallback(
        (option: string): void => {
            if (allowMultiple) {
                const isSelected: boolean = value.includes(option);
                if (isSelected) {
                    onChange(value.filter((v: string) => v !== option));
                } else {
                    onChange([...value, option]);
                }
            } else {
                onChange([option]);
            }
        },
        [value, onChange, allowMultiple],
    );

    return (
        <View className="flex-1">
            <RendererSectionCard eyebrow="Now: choose yours">
                <Text className="happy-font-heading-bold mb-2 text-[23px] leading-8 text-ink">
                    {prompt}
                </Text>

                <Text className="happy-font-body-medium mb-5 text-sm text-ink-muted">
                    {allowMultiple
                        ? `Select ${minSelections > 1 ? `at least ${minSelections}` : 'one or more'}`
                        : 'Tap to select one'}
                </Text>

                <View className="flex-row flex-wrap gap-3">
                    {options.map((option: string) => {
                        const isSelected: boolean = value.includes(option);
                        return (
                            <Pressable
                                key={option}
                                onPress={() => handleOptionPress(option)}
                                className={`rounded-[22px] px-5 py-3 ${isSelected
                                    ? 'happy-brand-card-selected'
                                    : 'happy-brand-card'
                                    }`}
                                accessibilityLabel={`${option}${isSelected ? ', selected' : ''}`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text
                                    className={`happy-font-body-bold text-base ${isSelected ? 'text-sage-700' : 'text-ink-soft'
                                        }`}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </RendererSectionCard>

            {/* Selection count */}
            {allowMultiple && value.length > 0 ? (
                <Text className="happy-font-body-bold mt-3 text-xs text-sage-600">
                    {value.length} selected
                </Text>
            ) : null}
        </View>
    );
}
