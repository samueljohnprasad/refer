/**
 * ExerciseInputSlider
 * Labeled slider input for exercise steps (e.g., "Rate your emotion 0-100").
 * Features: animated value label, min/max labels, step increments.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { RendererSectionCard } from '../RendererFrame';

// ============================================================================
// Types
// ============================================================================

export interface ExerciseInputSliderProps {
    prompt: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    labelMin?: string;
    labelMax?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MIN: number = 0;
const DEFAULT_MAX: number = 100;
const DEFAULT_STEP: number = 1;
const TRACK_SEGMENTS: number = 20;

// ============================================================================
// Component
// ============================================================================

export default function ExerciseInputSlider({
    prompt,
    value,
    onChange,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    step = DEFAULT_STEP,
    labelMin,
    labelMax,
}: ExerciseInputSliderProps): React.JSX.Element {
    const range: number = max - min;
    const normalizedValue: number = range > 0 ? (value - min) / range : 0;
    const fillPercent: number = Math.round(normalizedValue * 100);

    // Generate step buttons for a segmented slider
    const stepCount: number = Math.min(Math.floor(range / step) + 1, TRACK_SEGMENTS + 1);
    const steps: number[] = Array.from(
        { length: stepCount },
        (_, i: number) => min + i * Math.ceil(range / (stepCount - 1)),
    ).map((v: number) => Math.min(v, max));

    // Deduplicate and ensure max is included
    const uniqueSteps: number[] = [...new Set([...steps, max])].sort(
        (a: number, b: number) => a - b,
    );

    const handleStepPress = useCallback(
        (stepValue: number): void => {
            onChange(stepValue);
        },
        [onChange],
    );

    return (
        <View className="flex-1 justify-center">
            <RendererSectionCard eyebrow="Now: rate yours">
                <Text className="happy-font-heading-bold mb-4 text-[20px] leading-7 text-ink">
                    {prompt}
                </Text>

                <View className="items-center mb-8">
                    <View className="happy-brand-score-badge px-6 py-3">
                        <Text className="happy-font-heading-bold text-2xl text-sage-700">{value}</Text>
                    </View>
                </View>

                <View className="px-2 mb-3">
                    <View className="h-3 overflow-hidden rounded-full bg-sage-100">
                        <View
                            className="h-full rounded-full bg-sage-500"
                            style={{ width: `${fillPercent}%` }}
                        />
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-between px-1 mb-4 gap-1">
                    {uniqueSteps.map((stepVal: number) => {
                        const isSelected: boolean = stepVal === value;
                        return (
                            <Pressable
                                key={stepVal}
                                onPress={() => handleStepPress(stepVal)}
                                className={`h-9 min-w-[36px] items-center justify-center rounded-lg ${isSelected ? 'bg-sage-500' : 'bg-sage-50'
                                    }`}
                                accessibilityLabel={`Set value to ${stepVal}`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text
                                    className={`happy-font-body-bold text-xs ${isSelected ? 'text-brand-surface' : 'text-ink-muted'
                                        }`}
                                >
                                    {stepVal}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View className="flex-row items-center justify-between px-2">
                    <Text className="happy-font-body-medium text-xs text-ink-muted">
                        {labelMin ?? String(min)}
                    </Text>
                    <Text className="happy-font-body-medium text-xs text-ink-muted">
                        {labelMax ?? String(max)}
                    </Text>
                </View>
            </RendererSectionCard>
        </View>
    );
}
