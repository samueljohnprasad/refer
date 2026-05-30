/**
 * ExerciseInputSlider
 * Labeled slider input for exercise steps (e.g., "Rate your emotion 0-100").
 * Features: animated value label, min/max labels, step increments.
 */

import React, { useCallback } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text } from '@/src/components/ui/Text';
import { RendererSectionCard } from '../RendererFrame';
import { SAGE } from '@/lib/tokens';

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
    const handleSliderChange = useCallback(
        (sliderValue: number): void => {
            onChange(sliderValue);
        },
        [onChange],
    );

    return (
        <View className="w-full">
            <RendererSectionCard eyebrow="Now: rate yours">
                <Text variant="h3" className="mb-4">
                    {prompt}
                </Text>

                <View className="items-center mb-8">
                    <View className="happy-brand-score-badge px-6 py-3">
                        <Text variant="h2" color="sage">{value}</Text>
                    </View>
                </View>

                <View className="px-2 mb-6">
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={min}
                        maximumValue={max}
                        step={step}
                        value={value}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor={SAGE[500]}
                        maximumTrackTintColor={SAGE[100]}
                        thumbTintColor="#FFFFFF"
                    />
                </View>

                <View className="flex-row items-center justify-between px-2">
                    <Text variant="caption-muted">
                        {labelMin ?? String(min)}
                    </Text>
                    <Text variant="caption-muted">
                        {labelMax ?? String(max)}
                    </Text>
                </View>
            </RendererSectionCard>
        </View>
    );
}
