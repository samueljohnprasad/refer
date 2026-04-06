/**
 * ExerciseInputRating
 * 1-10 numbered scale (horizontal buttons) for exercise steps.
 * Features: animated selection, haptic on tap, min/max labels.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface ExerciseInputRatingProps {
    prompt: string;
    value: number | null;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    labelMin?: string;
    labelMax?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MIN: number = 1;
const DEFAULT_MAX: number = 10;

// ============================================================================
// Component
// ============================================================================

export default function ExerciseInputRating({
    prompt,
    value,
    onChange,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    labelMin,
    labelMax,
}: ExerciseInputRatingProps): React.JSX.Element {
    const count: number = max - min + 1;
    const numbers: number[] = Array.from(
        { length: count },
        (_, i: number) => min + i,
    );

    const handlePress = useCallback(
        (num: number): void => {
            onChange(num);
        },
        [onChange],
    );

    return (
        <View className="flex-1 justify-center">
            {/* Prompt */}
            <Text className="text-lg font-semibold text-slate-800 mb-6 leading-7">
                {prompt}
            </Text>

            {/* Selected value display */}
            {value !== null ? (
                <View className="items-center mb-6">
                    <View className="bg-purple-500 w-16 h-16 rounded-2xl items-center justify-center">
                        <Text className="text-2xl font-bold text-white">{value}</Text>
                    </View>
                </View>
            ) : (
                <View className="items-center mb-6">
                    <View className="bg-slate-100 w-16 h-16 rounded-2xl items-center justify-center">
                        <Text className="text-lg text-slate-400">?</Text>
                    </View>
                </View>
            )}

            {/* Rating buttons row */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 4,
                    gap: 8,
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                {numbers.map((num: number) => {
                    const isSelected: boolean = value === num;
                    return (
                        <Pressable
                            key={num}
                            onPress={() => handlePress(num)}
                            className={`w-11 h-11 rounded-xl items-center justify-center ${isSelected ? 'bg-purple-500' : 'bg-slate-100'
                                }`}
                            accessibilityLabel={`Rate ${num}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            <Text
                                className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-500'
                                    }`}
                            >
                                {num}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Min/Max labels */}
            <View className="flex-row items-center justify-between px-2 mt-3">
                <Text className="text-xs text-slate-400">
                    {labelMin ?? `${min} — Low`}
                </Text>
                <Text className="text-xs text-slate-400">
                    {labelMax ?? `${max} — High`}
                </Text>
            </View>
        </View>
    );
}
