/**
 * JourneyOnboardingScreen
 * Welcoming onboarding view for new users with 0 enrollments.
 * Replaces raw journey catalog dump to reduce choice paralysis.
 *
 * Flow:
 * 1. Welcome hero with illustration
 * 2. Quick 2-question quiz to determine starter journey
 * 3. Auto-enroll into recommended journey
 *
 * Pure presentational — all data and actions via props.
 */

import React, { useCallback, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single quiz question with selectable options */
export interface OnboardingQuestion {
    id: string;
    title: string;
    subtitle: string;
    options: OnboardingOption[];
}

/** A quiz option that maps to journey categories */
export interface OnboardingOption {
    id: string;
    label: string;
    emoji: string;
    description: string;
    /** Categories this option maps to (for recommendation scoring) */
    categories: string[];
}

export interface JourneyOnboardingScreenProps {
    /** Quiz questions to display */
    questions: OnboardingQuestion[];
    /** Called when user completes the quiz with selected option IDs */
    onQuizComplete: (answers: Record<string, string>) => void;
    /** Called when user taps "Skip — browse all journeys" */
    onSkip: () => void;
    /** Whether the auto-enrollment is in progress */
    isEnrolling: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Welcome hero section shown before quiz starts */
function WelcomeHero({
    onStart,
}: {
    onStart: () => void;
}): React.JSX.Element {
    return (
        <View className="flex-1 items-center justify-center px-8">
            {/* Hero illustration */}
            <View className="w-28 h-28 rounded-full bg-purple-50 items-center justify-center mb-6">
                <Text className="text-5xl">🧭</Text>
            </View>

            <Text className="text-3xl font-bold text-ink text-center mb-3">
                Find Your Path
            </Text>
            <Text className="text-base text-ink-soft text-center leading-6 mb-8 px-4">
                Answer 2 quick questions and we'll recommend the perfect journey to
                start your mental wellness practice.
            </Text>

            {/* Start quiz CTA */}
            <Pressable
                onPress={onStart}
                className="bg-purple-600 rounded-2xl py-4 px-10 mb-4"
                accessibilityRole="button"
                accessibilityLabel="Start quiz to find your journey"
            >
                <Text className="text-base font-bold text-white">
                    Let's Get Started
                </Text>
            </Pressable>

            {/* Skip link */}
            <Text className="text-sm text-ink-muted">
                Takes less than 30 seconds
            </Text>
        </View>
    );
}

/** Single quiz question card */
function QuestionCard({
    question,
    selectedOptionId,
    onSelect,
}: {
    question: OnboardingQuestion;
    selectedOptionId: string | null;
    onSelect: (optionId: string) => void;
}): React.JSX.Element {
    return (
        <View className="flex-1 px-6 pt-6">
            <Text className="text-2xl font-bold text-ink mb-2">
                {question.title}
            </Text>
            <Text className="text-sm text-ink-muted mb-6">
                {question.subtitle}
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {question.options.map(
                    (option: OnboardingOption): React.JSX.Element => {
                        const isSelected: boolean = selectedOptionId === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => onSelect(option.id)}
                                className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${isSelected
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-100 bg-brand-surface"
                                    }`}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: isSelected }}
                                accessibilityLabel={`${option.label}: ${option.description}`}
                            >
                                <View
                                    className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${isSelected ? "bg-purple-100" : "bg-brand-canvas"
                                        }`}
                                >
                                    <Text className="text-2xl">{option.emoji}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text
                                        className={`text-base font-bold ${isSelected ? "text-ink" : "text-ink"
                                            }`}
                                    >
                                        {option.label}
                                    </Text>
                                    <Text className="text-sm text-ink-muted mt-0.5">
                                        {option.description}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <View className="w-6 h-6 rounded-full bg-purple-500 items-center justify-center">
                                        <Feather name="check" size={14} color="white" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    },
                )}
            </ScrollView>
        </View>
    );
}

/** Enrolling state — shown after quiz completes while auto-enrolling */
function EnrollingState(): React.JSX.Element {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-6">
                <Text className="text-4xl">✨</Text>
            </View>
            <Text className="text-xl font-bold text-ink mb-2">
                Setting up your journey...
            </Text>
            <Text className="text-sm text-ink-muted text-center">
                We're preparing your personalized learning path
            </Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

type ScreenState = "welcome" | "quiz" | "enrolling";

export default function JourneyOnboardingScreen({
    questions,
    onQuizComplete,
    onSkip,
    isEnrolling,
}: JourneyOnboardingScreenProps): React.JSX.Element {
    const [screenState, setScreenState] = useState<ScreenState>("welcome");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentQuestion: OnboardingQuestion | undefined =
        questions[currentQuestionIndex];
    const totalQuestions: number = questions.length;
    const isLastQuestion: boolean = currentQuestionIndex === totalQuestions - 1;

    const handleStart = useCallback((): void => {
        setScreenState("quiz");
    }, []);

    const handleSelectOption = useCallback(
        (optionId: string): void => {
            if (!currentQuestion) return;

            const updatedAnswers: Record<string, string> = {
                ...answers,
                [currentQuestion.id]: optionId,
            };
            setAnswers(updatedAnswers);

            // Auto-advance after a brief delay for visual feedback
            setTimeout(() => {
                if (isLastQuestion) {
                    setScreenState("enrolling");
                    onQuizComplete(updatedAnswers);
                } else {
                    setCurrentQuestionIndex((prev: number) => prev + 1);
                }
            }, 400);
        },
        [currentQuestion, answers, isLastQuestion, onQuizComplete],
    );

    // Enrolling state
    if (screenState === "enrolling" || isEnrolling) {
        return (
            <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
                <EnrollingState />
            </SafeAreaView>
        );
    }

    // Welcome hero
    if (screenState === "welcome") {
        return (
            <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
                <WelcomeHero onStart={handleStart} />
                {/* Skip at bottom */}
                <View className="px-8 pb-8">
                    <Pressable
                        onPress={onSkip}
                        className="py-3 items-center"
                        accessibilityRole="button"
                        accessibilityLabel="Skip quiz and browse all journeys"
                    >
                        <Text className="text-sm font-medium text-ink">
                            Skip — browse all journeys
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Quiz flow
    return (
        <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
            {/* Progress bar + back/skip */}
            <View className="px-6 pt-4 pb-2">
                <View className="flex-row items-center justify-between mb-3">
                    {/* Back button */}
                    {currentQuestionIndex > 0 ? (
                        <Pressable
                            onPress={() =>
                                setCurrentQuestionIndex((prev: number) =>
                                    Math.max(0, prev - 1),
                                )
                            }
                            className="w-9 h-9 rounded-full bg-brand-canvas items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel="Previous question"
                        >
                            <Feather name="arrow-left" size={18} color="#64748B" />
                        </Pressable>
                    ) : (
                        <View className="w-9" />
                    )}

                    {/* Step indicator */}
                    <Text className="text-sm font-semibold text-ink-muted">
                        {currentQuestionIndex + 1} of {totalQuestions}
                    </Text>

                    {/* Skip */}
                    <Pressable
                        onPress={onSkip}
                        accessibilityRole="button"
                        accessibilityLabel="Skip quiz"
                    >
                        <Text className="text-sm font-medium text-ink">Skip</Text>
                    </Pressable>
                </View>

                {/* Progress bar */}
                <View className="h-1.5 bg-sage-50 rounded-full">
                    <View
                        className="h-1.5 bg-purple-500 rounded-full"
                        style={{
                            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                        }}
                    />
                </View>
            </View>

            {/* Question */}
            {currentQuestion && (
                <QuestionCard
                    question={currentQuestion}
                    selectedOptionId={answers[currentQuestion.id] ?? null}
                    onSelect={handleSelectOption}
                />
            )}
        </SafeAreaView>
    );
}
