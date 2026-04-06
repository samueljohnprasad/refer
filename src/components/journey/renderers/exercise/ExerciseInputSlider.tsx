/**
 * ExerciseInputSlider
 * Labeled slider input for exercise steps (e.g., "Rate your emotion 0-100").
 * Features: animated value label, min/max labels, step increments.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

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
            {/* Prompt */}
            <Text className="text-lg font-semibold text-slate-800 mb-6 leading-7">
                {prompt}
            </Text>

            {/* Animated value display */}
            <View className="items-center mb-8">
                <View className="bg-purple-500 px-6 py-3 rounded-2xl">
                    <Text className="text-3xl font-bold text-white">{value}</Text>
                </View>
            </View>

            {/* Track */}
            <View className="px-2 mb-3">
                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${fillPercent}%` }}
                    />
                </View>
            </View>

            {/* Step buttons row */}
            <View className="flex-row flex-wrap justify-between px-1 mb-4 gap-1">
                {uniqueSteps.map((stepVal: number) => {
                    const isSelected: boolean = stepVal === value;
                    return (
                        <Pressable
                            key={stepVal}
                            onPress={() => handleStepPress(stepVal)}
                            className={`min-w-[36px] h-9 items-center justify-center rounded-lg ${isSelected ? 'bg-purple-500' : 'bg-slate-100'
                                }`}
                            accessibilityLabel={`Set value to ${stepVal}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Text
                                className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-500'
                                    }`}
                            >
                                {stepVal}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Min/Max labels */}
            <View className="flex-row items-center justify-between px-2">
                <Text className="text-xs text-slate-400">
                    {labelMin ?? String(min)}
                </Text>
                <Text className="text-xs text-slate-400">
                    {labelMax ?? String(max)}
                </Text>
            </View>
        </View>
    );
}
