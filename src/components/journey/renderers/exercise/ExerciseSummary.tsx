/**
 * ExerciseSummary
 * Final summary screen shown after all exercise steps are complete.
 * Displays all answers compiled and "Complete Exercise" CTA.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

import type { ExerciseStep, ExerciseInputType } from '@/src/types/journey/mentalHealth';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { BRAND_SURFACE, SAGE } from '@/lib/tokens';

// ============================================================================
// Types
// ============================================================================

/** A single step's stored response */
export interface StepResponse {
    stepIndex: number;
    inputType: ExerciseInputType;
    textValue?: string;
    sliderValue?: number;
    pickerValue?: string[];
    multiChoiceValue?: number[];
    ratingValue?: number | null;
}

export interface ExerciseSummaryProps {
    steps: ExerciseStep[];
    responses: StepResponse[];
    onComplete: () => void;
    onEditStep: (stepIndex: number) => void;
}

// ============================================================================
// Helpers
// ============================================================================

function formatResponse(step: ExerciseStep, response: StepResponse): string {
    switch (response.inputType) {
        case 'text':
            return response.textValue ?? '(empty)';
        case 'slider':
            return String(response.sliderValue ?? 0);
        case 'picker':
            return (response.pickerValue ?? []).join(', ') || '(none selected)';
        case 'multi_choice': {
            const indices: number[] = response.multiChoiceValue ?? [];
            return (
                indices
                    .map((i: number) => step.options?.[i] ?? `Option ${i + 1}`)
                    .join(', ') || '(none selected)'
            );
        }
        case 'rating':
            return response.ratingValue !== null && response.ratingValue !== undefined
                ? String(response.ratingValue)
                : '(not rated)';
        default:
            return '—';
    }
}

// ============================================================================
// Component
// ============================================================================

export default function ExerciseSummary({
    steps,
    responses,
    onComplete,
    onEditStep,
}: ExerciseSummaryProps): React.JSX.Element {
    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Header */}
                <View className="items-center mb-6">
                    <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-sage-pill">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} color={SAGE[600]} />
                    </View>
                    <Text className="happy-font-heading-bold mb-1 text-[26px] leading-8 text-ink">
                        Exercise Complete!
                    </Text>
                    <Text className="happy-font-body-medium text-center text-sm text-ink-muted">
                        Here's a summary of your responses
                    </Text>
                </View>

                {/* Responses list */}
                <View className="gap-3">
                    {steps.map((step: ExerciseStep, index: number) => {
                        const response: StepResponse | undefined = responses.find(
                            (r: StepResponse) => r.stepIndex === index,
                        );
                        const displayValue: string = response
                            ? formatResponse(step, response)
                            : '(skipped)';

                        return (
                            <View
                                key={index}
                                className="happy-brand-card rounded-[24px] p-4"
                            >
                                <View className="flex-row items-start justify-between mb-2">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="h-6 w-6 items-center justify-center rounded-full bg-sage-pill">
                                            <Text className="happy-font-body-bold text-xs text-sage-600">
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <Text
                                            className="happy-font-body-bold flex-1 text-sm text-ink"
                                            numberOfLines={2}
                                        >
                                            {step.prompt}
                                        </Text>
                                    </View>
                                    <PressableScale
                                        onPress={() => onEditStep(index)}
                                        scale={0.95}
                                        hapticStyle="light"
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 8,
                                            backgroundColor: SAGE.pill,
                                        }}
                                        accessibilityLabel={`Edit step ${index + 1}`}
                                        accessibilityRole="button"
                                    >
                                        <Text className="happy-font-body-bold text-xs text-sage-600">
                                            Edit
                                        </Text>
                                    </PressableScale>
                                </View>

                                {/* Response value */}
                                <Text
                                    className="happy-font-body-medium ml-8 text-sm leading-5 text-ink-soft"
                                    numberOfLines={step.input_type === 'text' ? 4 : 2}
                                >
                                    {displayValue}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Complete button — fixed at bottom */}
            <View className="pt-4 pb-2">
                <PressableScale
                    onPress={onComplete}
                    scale={0.96}
                    hapticStyle="medium"
                    style={{
                        backgroundColor: SAGE[500],
                        paddingVertical: 16,
                        borderRadius: 22,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 4,
                        borderBottomColor: SAGE[700],
                    }}
                    accessibilityLabel="Complete this exercise"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={BRAND_SURFACE} />
                    <Text className="happy-font-body-bold ml-2 text-base text-brand-surface">
                        Complete Exercise
                    </Text>
                </PressableScale>
            </View>
        </View>
    );
}
