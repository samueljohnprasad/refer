/**
 * ExerciseInputRating
 * 1-10 numbered scale (horizontal buttons) for exercise steps.
 * Features: animated selection, haptic on tap, min/max labels.
 */

import React, { useCallback } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { RendererSectionCard } from '../RendererFrame';

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
        <View className="w-full">
            <RendererSectionCard eyebrow="Now: rate yours">
                <Text variant="h3" className="mb-4">
                    {prompt}
                </Text>

                {value !== null ? (
                    <View className="items-center mb-6">
                        <View className="happy-brand-score-badge h-16 w-16 items-center justify-center">
                            <Text variant="h2" color="sage">{value}</Text>
                        </View>
                    </View>
                ) : (
                    <View className="items-center mb-6">
                        <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-sage-50">
                            <Text variant="h2" color="muted">?</Text>
                        </View>
                    </View>
                )}

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
                                className={`h-11 w-11 items-center justify-center rounded-xl ${isSelected ? 'bg-sage-500' : 'bg-sage-50'
                                    }`}
                                accessibilityLabel={`Rate ${num}`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text
                                    variant="body-bold"
                                    color={isSelected ? "surface" : "muted"}
                                >
                                    {num}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                <View className="flex-row items-center justify-between px-2 mt-3">
                    <Text variant="caption-muted">
                        {labelMin ?? `${min} - Low`}
                    </Text>
                    <Text variant="caption-muted">
                        {labelMax ?? `${max} - High`}
                    </Text>
                </View>
            </RendererSectionCard>
        </View>
    );
}
