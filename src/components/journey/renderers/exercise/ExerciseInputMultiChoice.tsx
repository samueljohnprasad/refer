/**
 * ExerciseInputMultiChoice
 * List of options for "Spot the Distortion" style exercises.
 * Supports single or multiple selection, optional correct answer reveal.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';

// ============================================================================
// Types
// ============================================================================

export interface ExerciseInputMultiChoiceProps {
    prompt: string;
    options: string[];
    value: number[];
    onChange: (value: number[]) => void;
    allowMultiple?: boolean;
    correctIndex?: number;
    explanation?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function ExerciseInputMultiChoice({
    prompt,
    options,
    value,
    onChange,
    allowMultiple = false,
    correctIndex,
    explanation,
}: ExerciseInputMultiChoiceProps): React.JSX.Element {
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const hasCorrectAnswer: boolean = correctIndex !== undefined;

    const handleOptionPress = useCallback(
        (index: number): void => {
            // If scored and already answered, don't allow changes
            if (hasCorrectAnswer && hasAnswered) return;

            if (allowMultiple) {
                const isSelected: boolean = value.includes(index);
                const newValue: number[] = isSelected
                    ? value.filter((v: number) => v !== index)
                    : [...value, index];
                onChange(newValue);
            } else {
                onChange([index]);
                if (hasCorrectAnswer) {
                    setHasAnswered(true);
                }
            }
        },
        [value, onChange, allowMultiple, hasCorrectAnswer, hasAnswered],
    );

    const getOptionState = (
        index: number,
    ): 'default' | 'selected' | 'correct' | 'incorrect' => {
        const isSelected: boolean = value.includes(index);

        if (!hasAnswered || !hasCorrectAnswer) {
            return isSelected ? 'selected' : 'default';
        }

        // After answering a scored question
        if (index === correctIndex) return 'correct';
        if (isSelected && index !== correctIndex) return 'incorrect';
        return 'default';
    };

    const OPTION_STYLES: Record<string, { container: string; text: string }> = {
        default: {
            container: 'bg-white border-slate-100',
            text: 'text-slate-700',
        },
        selected: {
            container: 'bg-purple-50 border-purple-400',
            text: 'text-purple-700',
        },
        correct: {
            container: 'bg-green-50 border-green-400',
            text: 'text-green-700',
        },
        incorrect: {
            container: 'bg-red-50 border-red-400',
            text: 'text-red-700',
        },
    };

    return (
        <View className="flex-1">
            {/* Prompt */}
            <Text className="text-lg font-semibold text-slate-800 mb-5 leading-7">
                {prompt}
            </Text>

            {/* Options list */}
            <View className="gap-3">
                {options.map((option: string, index: number) => {
                    const state = getOptionState(index);
                    const styles = OPTION_STYLES[state];

                    return (
                        <Pressable
                            key={index}
                            onPress={() => handleOptionPress(index)}
                            className={`flex-row items-center p-4 rounded-2xl border-2 ${styles.container}`}
                            accessibilityLabel={`Option ${index + 1}: ${option}${value.includes(index) ? ', selected' : ''
                                }`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: value.includes(index) }}
                            disabled={hasCorrectAnswer && hasAnswered}
                        >
                            {/* Index indicator */}
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${state === 'selected'
                                    ? 'bg-purple-500'
                                    : state === 'correct'
                                        ? 'bg-green-500'
                                        : state === 'incorrect'
                                            ? 'bg-red-500'
                                            : 'bg-slate-100'
                                    }`}
                            >
                                {state === 'correct' ? (
                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#FFFFFF" />
                                ) : state === 'incorrect' ? (
                                    <HugeiconsIcon icon={Cancel01Icon} size={16} color="#FFFFFF" />
                                ) : (
                                    <Text
                                        className={`text-sm font-bold ${state === 'selected' ? 'text-white' : 'text-slate-400'
                                            }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </Text>
                                )}
                            </View>

                            {/* Option text */}
                            <Text className={`flex-1 text-base font-medium ${styles.text}`}>
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Explanation (shown after answering a scored question) */}
            {hasAnswered && explanation ? (
                <View className="mt-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <Text className="text-sm font-semibold text-blue-700 mb-1">
                        Explanation
                    </Text>
                    <Text className="text-sm text-blue-600 leading-5">
                        {explanation}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}
