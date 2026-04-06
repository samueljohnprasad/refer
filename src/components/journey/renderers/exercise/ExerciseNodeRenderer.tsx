/**
 * ExerciseNodeRenderer (P1.3.2)
 * Step-by-step wizard for Exercise nodes.
 *
 * Features:
 * - One step per screen with progress bar at top
 * - Back/Next navigation with validation
 * - 5 input types: text, slider, picker, multi_choice, rating
 * - Summary screen at end with all answers compiled
 * - Stores all step responses in responseData JSONB on completion
 * - Keyboard-aware scrolling (KeyboardAvoidingView)
 * - Haptic feedback on step transitions
 * - Special exercise type detection (breathing, grounding, body_scan)
 * - Accessibility: step announcements, input labels
 *
 * This is the Presentation layer. The parent provides ExerciseContent
 * and handles node completion.
 */

import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Dumbbell01Icon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

import type {
    ExerciseContent,
    ExerciseStep,
    ExerciseInputType,
    ExerciseResponseData,
} from "@/src/types/journey/mentalHealth";
import { PressableScale } from "@/src/components/ui/PressableScale";

import ExerciseInputText from "./ExerciseInputText";
import ExerciseInputSlider from "./ExerciseInputSlider";
import ExerciseInputPicker from "./ExerciseInputPicker";
import ExerciseInputMultiChoice from "./ExerciseInputMultiChoice";
import ExerciseInputRating from "./ExerciseInputRating";
import ExerciseSummary, { type StepResponse } from "./ExerciseSummary";

// ============================================================================
// Types
// ============================================================================

export interface ExerciseNodeRendererProps {
    /** Exercise node content from the template JSONB */
    content: ExerciseContent;
    /** Node title (shown in header) */
    title: string;
    /** Called when user completes the exercise */
    onComplete: (responseData: ExerciseResponseData) => void;
    /** Called when user taps back button (exit exercise) */
    onBack: () => void;
}

/** Internal state for all step responses */
interface StepState {
    textValues: Record<number, string>;
    sliderValues: Record<number, number>;
    pickerValues: Record<number, string[]>;
    multiChoiceValues: Record<number, number[]>;
    ratingValues: Record<number, number | null>;
}

// ============================================================================
// Constants
// ============================================================================

const HAPTIC_MAP: Record<string, Haptics.ImpactFeedbackStyle> = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

// ============================================================================
// Helpers
// ============================================================================

/** Check if a step has valid input */
function isStepValid(
    step: ExerciseStep,
    stepIndex: number,
    state: StepState,
): boolean {
    switch (step.input_type) {
        case "text":
            return (state.textValues[stepIndex] ?? "").trim().length > 0;
        case "slider":
            return state.sliderValues[stepIndex] !== undefined;
        case "picker": {
            const selected: string[] = state.pickerValues[stepIndex] ?? [];
            const minRequired: number = step.min_selections ?? 1;
            return selected.length >= minRequired;
        }
        case "multi_choice": {
            const chosen: number[] = state.multiChoiceValues[stepIndex] ?? [];
            return chosen.length > 0;
        }
        case "rating":
            return (
                state.ratingValues[stepIndex] !== undefined &&
                state.ratingValues[stepIndex] !== null
            );
        default:
            return true;
    }
}

/** Build the final responseData from all step states */
function buildResponseData(
    steps: ExerciseStep[],
    state: StepState,
): ExerciseResponseData {
    const stepResponses: Array<{
        stepIndex: number;
        value: string | number | string[];
    }> = steps.map((step: ExerciseStep, index: number) => {
        switch (step.input_type) {
            case "text":
                return { stepIndex: index, value: state.textValues[index] ?? "" };
            case "slider":
                return { stepIndex: index, value: state.sliderValues[index] ?? 0 };
            case "picker":
                return { stepIndex: index, value: state.pickerValues[index] ?? [] };
            case "multi_choice": {
                const indices: number[] = state.multiChoiceValues[index] ?? [];
                const selectedLabels: string[] = indices.map(
                    (i: number) => step.options?.[i] ?? "",
                );
                return { stepIndex: index, value: selectedLabels };
            }
            case "rating":
                return { stepIndex: index, value: state.ratingValues[index] ?? 0 };
            default:
                return { stepIndex: index, value: "" };
        }
    });

    return { steps: stepResponses };
}

/** Build StepResponse array for the summary screen */
function buildStepResponses(
    steps: ExerciseStep[],
    state: StepState,
): StepResponse[] {
    return steps.map(
        (_: ExerciseStep, index: number): StepResponse => ({
            stepIndex: index,
            inputType: steps[index].input_type,
            textValue: state.textValues[index],
            sliderValue: state.sliderValues[index],
            pickerValue: state.pickerValues[index],
            multiChoiceValue: state.multiChoiceValues[index],
            ratingValue: state.ratingValues[index],
        }),
    );
}

// ============================================================================
// Sub-components
// ============================================================================

/** Header with back, title, step counter */
function ExerciseHeader({
    title,
    currentStep,
    totalSteps,
    showingSummary,
    onBack,
}: {
    title: string;
    currentStep: number;
    totalSteps: number;
    showingSummary: boolean;
    onBack: () => void;
}): React.JSX.Element {
    return (
        <View className="flex-row items-center px-4 pt-2 pb-3">
            <PressableScale
                onPress={onBack}
                scale={0.9}
                hapticStyle="light"
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#F1F5F9",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                accessibilityLabel="Go back"
                accessibilityRole="button"
            >
                <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={20}
                    color="#475569"
                />
            </PressableScale>

            <View className="flex-1 mx-3">
                <Text
                    className="text-sm font-bold text-slate-800"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text className="text-xs text-slate-400">
                    {showingSummary
                        ? "Summary"
                        : `Step ${currentStep + 1} of ${totalSteps}`}
                </Text>
            </View>

            <View className="bg-green-50 px-3 py-1.5 rounded-full">
                <HugeiconsIcon
                    icon={Dumbbell01Icon}
                    size={16}
                    color="#16A34A"
                />
            </View>
        </View>
    );
}

/** Progress bar */
function StepProgressBar({
    current,
    total,
    showingSummary,
}: {
    current: number;
    total: number;
    showingSummary: boolean;
}): React.JSX.Element {
    const progressPercent: number = showingSummary
        ? 100
        : total > 0
            ? ((current + 1) / (total + 1)) * 100
            : 0;

    return (
        <View className="h-1 bg-slate-100 mx-4 rounded-full overflow-hidden">
            <View
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ExerciseNodeRenderer({
    content,
    title,
    onComplete,
    onBack,
}: ExerciseNodeRendererProps): React.JSX.Element {
    const steps: ExerciseStep[] = content.steps;
    const totalSteps: number = steps.length;

    // ── Wizard state ──
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showingSummary, setShowingSummary] = useState<boolean>(false);

    // ── Input state (all steps) ──
    const [stepState, setStepState] = useState<StepState>({
        textValues: {},
        sliderValues: {},
        pickerValues: {},
        multiChoiceValues: {},
        ratingValues: {},
    });

    const currentExerciseStep: ExerciseStep | undefined = steps[currentStep];
    const canGoNext: boolean = currentExerciseStep
        ? isStepValid(currentExerciseStep, currentStep, stepState)
        : false;
    const canGoBack: boolean = currentStep > 0;

    // ── State updaters (stable references) ──
    const updateText = useCallback(
        (value: string): void => {
            setStepState((prev: StepState) => ({
                ...prev,
                textValues: { ...prev.textValues, [currentStep]: value },
            }));
        },
        [currentStep],
    );

    const updateSlider = useCallback(
        (value: number): void => {
            setStepState((prev: StepState) => ({
                ...prev,
                sliderValues: { ...prev.sliderValues, [currentStep]: value },
            }));
        },
        [currentStep],
    );

    const updatePicker = useCallback(
        (value: string[]): void => {
            setStepState((prev: StepState) => ({
                ...prev,
                pickerValues: { ...prev.pickerValues, [currentStep]: value },
            }));
        },
        [currentStep],
    );

    const updateMultiChoice = useCallback(
        (value: number[]): void => {
            setStepState((prev: StepState) => ({
                ...prev,
                multiChoiceValues: { ...prev.multiChoiceValues, [currentStep]: value },
            }));
        },
        [currentStep],
    );

    const updateRating = useCallback(
        (value: number): void => {
            setStepState((prev: StepState) => ({
                ...prev,
                ratingValues: { ...prev.ratingValues, [currentStep]: value },
            }));
        },
        [currentStep],
    );

    // ── Navigation ──
    const handleNext = useCallback((): void => {
        const step: ExerciseStep | undefined = steps[currentStep];
        const hapticLevel = step?.haptic ?? "medium";
        Haptics.impactAsync(
            HAPTIC_MAP[hapticLevel] ?? Haptics.ImpactFeedbackStyle.Medium,
        );

        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev: number) => prev + 1);
        } else {
            setShowingSummary(true);
        }
    }, [currentStep, totalSteps, steps]);

    const handleBack = useCallback((): void => {
        if (showingSummary) {
            setShowingSummary(false);
            return;
        }
        if (currentStep > 0) {
            setCurrentStep((prev: number) => prev - 1);
        } else {
            onBack();
        }
    }, [showingSummary, currentStep, onBack]);

    const handleEditStep = useCallback((stepIndex: number): void => {
        setShowingSummary(false);
        setCurrentStep(stepIndex);
    }, []);

    const handleComplete = useCallback((): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const responseData: ExerciseResponseData = buildResponseData(
            steps,
            stepState,
        );
        onComplete(responseData);
    }, [steps, stepState, onComplete]);

    // ── Build summary responses ──
    const summaryResponses: StepResponse[] = useMemo(
        () => buildStepResponses(steps, stepState),
        [steps, stepState],
    );

    // ── Render current step input ──
    const renderStepInput = (): React.JSX.Element | null => {
        if (!currentExerciseStep) return null;

        switch (currentExerciseStep.input_type) {
            case "text":
                return (
                    <ExerciseInputText
                        prompt={currentExerciseStep.prompt}
                        placeholder={currentExerciseStep.placeholder}
                        value={stepState.textValues[currentStep] ?? ""}
                        onChange={updateText}
                    />
                );

            case "slider":
                return (
                    <ExerciseInputSlider
                        prompt={currentExerciseStep.prompt}
                        value={
                            stepState.sliderValues[currentStep] ??
                            currentExerciseStep.min ??
                            0
                        }
                        onChange={updateSlider}
                        min={currentExerciseStep.min}
                        max={currentExerciseStep.max}
                        step={currentExerciseStep.step}
                        labelMin={currentExerciseStep.label_min}
                        labelMax={currentExerciseStep.label_max}
                    />
                );

            case "picker":
                return (
                    <ExerciseInputPicker
                        prompt={currentExerciseStep.prompt}
                        options={currentExerciseStep.options ?? []}
                        value={stepState.pickerValues[currentStep] ?? []}
                        onChange={updatePicker}
                        allowMultiple={currentExerciseStep.allow_multiple}
                        minSelections={currentExerciseStep.min_selections}
                    />
                );

            case "multi_choice":
                return (
                    <ExerciseInputMultiChoice
                        prompt={currentExerciseStep.prompt}
                        options={currentExerciseStep.options ?? []}
                        value={stepState.multiChoiceValues[currentStep] ?? []}
                        onChange={updateMultiChoice}
                        allowMultiple={currentExerciseStep.allow_multiple}
                        correctIndex={currentExerciseStep.correct_index}
                        explanation={currentExerciseStep.explanation}
                    />
                );

            case "rating":
                return (
                    <ExerciseInputRating
                        prompt={currentExerciseStep.prompt}
                        value={stepState.ratingValues[currentStep] ?? null}
                        onChange={updateRating}
                        min={currentExerciseStep.min ?? 1}
                        max={currentExerciseStep.max ?? 10}
                        labelMin={currentExerciseStep.label_min}
                        labelMax={currentExerciseStep.label_max}
                    />
                );

            default:
                return (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-slate-400">
                            Unknown input type: {currentExerciseStep.input_type}
                        </Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            edges={["top", "bottom"]}
        >
            {/* Header */}
            <ExerciseHeader
                title={title}
                currentStep={currentStep}
                totalSteps={totalSteps}
                showingSummary={showingSummary}
                onBack={handleBack}
            />

            {/* Progress bar */}
            <StepProgressBar
                current={currentStep}
                total={totalSteps}
                showingSummary={showingSummary}
            />

            {/* Content area */}
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                {showingSummary ? (
                    <View className="flex-1 px-5 pt-5">
                        <ExerciseSummary
                            steps={steps}
                            responses={summaryResponses}
                            onComplete={handleComplete}
                            onEditStep={handleEditStep}
                        />
                    </View>
                ) : (
                    <>
                        {/* Step content */}
                        <ScrollView
                            className="flex-1 px-5 pt-5"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        >
                            {renderStepInput()}
                        </ScrollView>

                        {/* Navigation buttons */}
                        <View className="flex-row items-center gap-3 px-5 pb-4 pt-2">
                            {/* Back button */}
                            {canGoBack ? (
                                <PressableScale
                                    onPress={handleBack}
                                    scale={0.96}
                                    hapticStyle="light"
                                    style={{
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        borderRadius: 14,
                                        backgroundColor: "#F1F5F9",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    accessibilityLabel="Go to previous step"
                                    accessibilityRole="button"
                                >
                                    <HugeiconsIcon
                                        icon={ArrowLeft01Icon}
                                        size={18}
                                        color="#64748B"
                                    />
                                    <Text className="text-sm font-semibold text-slate-500 ml-1">
                                        Back
                                    </Text>
                                </PressableScale>
                            ) : (
                                <View style={{ width: 80 }} />
                            )}

                            {/* Next / Review button */}
                            <PressableScale
                                onPress={handleNext}
                                scale={0.96}
                                hapticStyle="medium"
                                disabled={!canGoNext}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 14,
                                    backgroundColor: canGoNext ? "#16A34A" : "#E2E8F0",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderBottomWidth: canGoNext ? 4 : 0,
                                    borderBottomColor: "#15803D",
                                    opacity: canGoNext ? 1 : 0.6,
                                }}
                                accessibilityLabel={
                                    currentStep === totalSteps - 1
                                        ? "Review answers"
                                        : "Next step"
                                }
                                accessibilityRole="button"
                                accessibilityState={{ disabled: !canGoNext }}
                            >
                                <Text
                                    className={`text-base font-bold ${canGoNext ? "text-white" : "text-slate-400"
                                        } mr-1`}
                                >
                                    {currentStep === totalSteps - 1 ? "Review" : "Next"}
                                </Text>
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    size={18}
                                    color={canGoNext ? "#FFFFFF" : "#94A3B8"}
                                />
                            </PressableScale>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
