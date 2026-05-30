/**
 * ExerciseInputPicker
 * Emotion picker grid — tap to select one or multiple options.
 * Renders options as tappable pill buttons in a flex-wrap grid.
 */

import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/Text';
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
        <View className="w-full">
            <RendererSectionCard eyebrow="Now: choose yours">
                <Text variant="h3" className="mb-2">
                    {prompt}
                </Text>

                <Text variant="caption-muted" className="mb-5">
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
                                className={`rounded-[22px] px-4 py-2.5 ${isSelected
                                    ? 'happy-brand-card-selected'
                                    : 'happy-brand-card'
                                    }`}
                                accessibilityLabel={`${option}${isSelected ? ', selected' : ''}`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text
                                    variant="body-bold"
                                    color={isSelected ? "sage" : "soft"}
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
                <Text variant="label-bold" color="sage" className="mt-3">
                    {value.length} selected
                </Text>
            ) : null}
        </View>
    );
}
