/**
 * ExerciseInputPicker
 * Emotion picker grid — tap to select one or multiple options.
 * Renders options as tappable pill buttons in a flex-wrap grid.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

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
            {/* Prompt */}
            <Text className="text-lg font-semibold text-slate-800 mb-2 leading-7">
                {prompt}
            </Text>

            {/* Selection hint */}
            <Text className="text-sm text-slate-400 mb-5">
                {allowMultiple
                    ? `Select ${minSelections > 1 ? `at least ${minSelections}` : 'one or more'}`
                    : 'Tap to select one'}
            </Text>

            {/* Options grid */}
            <View className="flex-row flex-wrap gap-3">
                {options.map((option: string) => {
                    const isSelected: boolean = value.includes(option);
                    return (
                        <Pressable
                            key={option}
                            onPress={() => handleOptionPress(option)}
                            className={`px-5 py-3 rounded-2xl border-2 ${isSelected
                                ? 'bg-purple-50 border-purple-400'
                                : 'bg-white border-slate-100'
                                }`}
                            accessibilityLabel={`${option}${isSelected ? ', selected' : ''}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Text
                                className={`text-base font-medium ${isSelected ? 'text-purple-700' : 'text-slate-600'
                                    }`}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Selection count */}
            {allowMultiple && value.length > 0 ? (
                <Text className="text-xs text-purple-500 font-medium mt-3">
                    {value.length} selected
                </Text>
            ) : null}
        </View>
    );
}
