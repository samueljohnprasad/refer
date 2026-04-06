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
                    <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} color="#16A34A" />
                    </View>
                    <Text className="text-xl font-bold text-slate-900 mb-1">
                        Exercise Complete!
                    </Text>
                    <Text className="text-sm text-slate-400 text-center">
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
                                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                            >
                                <View className="flex-row items-start justify-between mb-2">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="w-6 h-6 rounded-full bg-purple-100 items-center justify-center">
                                            <Text className="text-xs font-bold text-purple-600">
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <Text
                                            className="text-sm font-semibold text-slate-700 flex-1"
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
                                            backgroundColor: '#F1F5F9',
                                        }}
                                        accessibilityLabel={`Edit step ${index + 1}`}
                                        accessibilityRole="button"
                                    >
                                        <Text className="text-xs font-medium text-slate-500">
                                            Edit
                                        </Text>
                                    </PressableScale>
                                </View>

                                {/* Response value */}
                                <Text
                                    className="text-sm text-slate-600 leading-5 ml-8"
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
                        backgroundColor: '#16A34A',
                        paddingVertical: 16,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 4,
                        borderBottomColor: '#15803D',
                    }}
                    accessibilityLabel="Complete this exercise"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#FFFFFF" />
                    <Text className="text-base font-bold text-white ml-2">
                        Complete Exercise
                    </Text>
                </PressableScale>
            </View>
        </View>
    );
}
