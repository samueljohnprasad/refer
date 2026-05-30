/**
 * ExerciseInputMultiChoice
 * List of options for "Spot the Distortion" style exercises.
 * Supports single or multiple selection, optional correct answer reveal.
 */

import React, { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { BRAND_SURFACE } from '@/lib/tokens';
import { RendererSectionCard } from '../RendererFrame';
import { Card } from '@/src/components/ui/Card';

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
            container: 'happy-brand-card',
            text: 'text-ink',
        },
        selected: {
            container: 'happy-brand-card-selected',
            text: 'text-sage-700',
        },
        correct: {
            container: 'happy-brand-card-selected',
            text: 'text-sage-700',
        },
        incorrect: {
            container: 'border-2 border-terracotta-light bg-brand-surface',
            text: 'text-terracotta',
        },
    };

    return (
        <View className="w-full">
            <RendererSectionCard eyebrow="Now: choose yours">
                <Text variant="h3" className="mb-4">
                    {prompt}
                </Text>

                <View className="gap-3">
                    {options.map((option: string, index: number) => {
                        const state = getOptionState(index);
                        const styles = OPTION_STYLES[state];

                        return (
                            <Pressable
                                key={index}
                                onPress={() => handleOptionPress(index)}
                                className={`flex-row items-center rounded-[24px] px-4 py-3 ${styles.container}`}
                                accessibilityLabel={`Option ${index + 1}: ${option}${value.includes(index) ? ', selected' : ''
                                    }`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: value.includes(index) }}
                                disabled={hasCorrectAnswer && hasAnswered}
                            >
                                <View
                                    className={`mr-3 h-7 w-7 items-center justify-center rounded-full ${state === 'selected'
                                        ? 'bg-sage-500'
                                        : state === 'correct'
                                            ? 'bg-sage-500'
                                            : state === 'incorrect'
                                                ? 'bg-terracotta'
                                                : 'bg-sage-50'
                                        }`}
                                >
                                    {state === 'correct' ? (
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color={BRAND_SURFACE} />
                                    ) : state === 'incorrect' ? (
                                        <HugeiconsIcon icon={Cancel01Icon} size={16} color={BRAND_SURFACE} />
                                    ) : (
                                        <Text
                                            variant="body-bold"
                                            color={state === 'selected' ? 'surface' : 'muted'}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </Text>
                                    )}
                                </View>

                                <Text className={`happy-font-body-semibold flex-1 text-[14px] leading-5 ${styles.text}`}>
                                    {option}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </RendererSectionCard>

            {/* Explanation (shown after answering a scored question) */}
            {hasAnswered && explanation ? (
                <Card variant="tile" radius="xl" showDepth={false} className="mt-4" contentClassName="p-4">
                    <Text variant="label-bold" color="sage" className="mb-1">
                        Explanation
                    </Text>
                    <Text variant="body" className="text-sm leading-5">
                        {explanation}
                    </Text>
                </Card>
            ) : null}
        </View>
    );
}
