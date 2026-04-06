/**
 * QuizNodeRenderer (P1.3.4)
 * Duolingo-style interactive quiz with instant feedback.
 *
 * Flow per question:
 * 1. Show question + option cards (A, B, C, D)
 * 2. User taps an option → "Check Answer" button appears
 * 3. User taps Check → instant feedback (correct/incorrect) with animation
 * 4. "Continue" button → next question
 * 5. After last question → QuizScoreSummary
 *
 * Features:
 * - One question per screen
 * - Progress bar at top
 * - Shake animation on wrong answer
 * - Green flash + haptic on correct
 * - Never punishes — wrong answers don't subtract XP
 * - Score summary with perfect bonus detection
 */

import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

import type {
    QuizContent,
    QuizQuestion,
    QuizResponseData,
} from "@/src/types/journey/mentalHealth";
import { PressableScale } from "@/src/components/ui/PressableScale";

import QuizOptionCard, { type OptionState } from "./QuizOptionCard";
import QuizScoreSummary, { type QuizAnswer } from "./QuizScoreSummary";

// ============================================================================
// Types
// ============================================================================

export interface QuizNodeRendererProps {
    /** Quiz node content from template JSONB */
    content: QuizContent;
    /** Node title (shown in header) */
    title: string;
    /** Called when user completes the quiz */
    onComplete: (responseData: QuizResponseData) => void;
    /** Called when user taps back */
    onBack: () => void;
}

/** Question-level state machine */
type QuestionState = "answering" | "checked" | "feedback";

// ============================================================================
// Sub-components
// ============================================================================

/** Header */
function QuizHeader({
    title,
    currentQuestion,
    totalQuestions,
    showingSummary,
    onBack,
}: {
    title: string;
    currentQuestion: number;
    totalQuestions: number;
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
                        ? "Results"
                        : `Question ${currentQuestion + 1} of ${totalQuestions}`}
                </Text>
            </View>

            <View className="bg-amber-50 px-3 py-1.5 rounded-full">
                <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={16}
                    color="#D97706"
                />
            </View>
        </View>
    );
}

/** Progress bar */
function QuizProgressBar({
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
            ? (current / total) * 100
            : 0;

    return (
        <View className="h-1.5 bg-slate-100 mx-4 rounded-full overflow-hidden">
            <View
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </View>
    );
}

/** Feedback banner (shown after checking answer) */
function FeedbackBanner({
    isCorrect,
    explanation,
}: {
    isCorrect: boolean;
    explanation: string;
}): React.JSX.Element {
    return (
        <View
            className={`rounded-2xl p-4 mt-4 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
        >
            <Text
                className={`text-base font-bold mb-1 ${isCorrect ? "text-green-700" : "text-red-700"
                    }`}
            >
                {isCorrect ? "Correct! 🎉" : "That's okay! 💪"}
            </Text>
            <Text
                className={`text-sm leading-5 ${isCorrect ? "text-green-600" : "text-red-600"
                    }`}
            >
                {explanation}
            </Text>
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function QuizNodeRenderer({
    content,
    title,
    onComplete,
    onBack,
}: QuizNodeRendererProps): React.JSX.Element {
    const questions: QuizQuestion[] = content.questions;
    const totalQuestions: number = questions.length;

    // ── State ──
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [questionState, setQuestionState] =
        useState<QuestionState>("answering");
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [showingSummary, setShowingSummary] = useState<boolean>(false);

    const currentQuestion: QuizQuestion | undefined = questions[currentIndex];
    const isCorrectAnswer: boolean =
        selectedOption !== null && currentQuestion
            ? selectedOption === currentQuestion.correct_index
            : false;

    // ── Derived score ──
    const score: number = answers.filter((a: QuizAnswer) => a.correct).length;
    const isPerfect: boolean = score === totalQuestions && totalQuestions > 0;

    // ── Option state resolver ──
    const getOptionState = useCallback(
        (optionIndex: number): OptionState => {
            if (questionState === "answering") {
                return optionIndex === selectedOption ? "selected" : "default";
            }

            // After checking
            if (optionIndex === currentQuestion?.correct_index) {
                return "correct";
            }
            if (optionIndex === selectedOption && !isCorrectAnswer) {
                return "incorrect";
            }
            return "default";
        },
        [questionState, selectedOption, currentQuestion, isCorrectAnswer],
    );

    // ── Handlers ──
    const handleOptionPress = useCallback(
        (optionIndex: number): void => {
            if (questionState !== "answering") return;
            setSelectedOption(optionIndex);
        },
        [questionState],
    );

    const handleCheckAnswer = useCallback((): void => {
        if (selectedOption === null || !currentQuestion) return;

        const correct: boolean = selectedOption === currentQuestion.correct_index;

        // Haptic feedback
        if (correct) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        // Record answer
        const answer: QuizAnswer = {
            questionIndex: currentIndex,
            selectedIndex: selectedOption,
            correct,
        };
        setAnswers((prev: QuizAnswer[]) => [...prev, answer]);
        setQuestionState("feedback");
    }, [selectedOption, currentQuestion, currentIndex]);

    const handleContinue = useCallback((): void => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev: number) => prev + 1);
            setSelectedOption(null);
            setQuestionState("answering");
        } else {
            // Show summary
            setShowingSummary(true);
        }
    }, [currentIndex, totalQuestions]);

    const handleComplete = useCallback((): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const finalScore: number = answers.filter(
            (a: QuizAnswer) => a.correct,
        ).length;
        const perfect: boolean = finalScore === totalQuestions;

        const responseData: QuizResponseData = {
            answers: answers.map((a: QuizAnswer) => ({
                questionIndex: a.questionIndex,
                selectedIndex: a.selectedIndex,
                correct: a.correct,
            })),
            score: finalScore,
            total: totalQuestions,
            perfectBonus: perfect,
        };

        onComplete(responseData);
    }, [answers, totalQuestions, onComplete]);

    const handleBack = useCallback((): void => {
        if (showingSummary) {
            // Don't allow going back from summary (quiz is done)
            return;
        }
        onBack();
    }, [showingSummary, onBack]);

    // ── Score summary ──
    if (showingSummary) {
        return (
            <SafeAreaView
                className="flex-1 bg-white"
                edges={["top", "bottom"]}
            >
                <QuizHeader
                    title={title}
                    currentQuestion={currentIndex}
                    totalQuestions={totalQuestions}
                    showingSummary
                    onBack={handleBack}
                />
                <QuizProgressBar
                    current={totalQuestions}
                    total={totalQuestions}
                    showingSummary
                />

                <View className="flex-1 px-5 pt-5">
                    <QuizScoreSummary
                        questions={questions}
                        answers={answers}
                        score={score}
                        total={totalQuestions}
                        isPerfect={isPerfect}
                        onComplete={handleComplete}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // ── Question screen ──
    if (!currentQuestion) return <View />;

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            edges={["top", "bottom"]}
        >
            {/* Header */}
            <QuizHeader
                title={title}
                currentQuestion={currentIndex}
                totalQuestions={totalQuestions}
                showingSummary={false}
                onBack={handleBack}
            />

            {/* Progress bar */}
            <QuizProgressBar
                current={currentIndex}
                total={totalQuestions}
                showingSummary={false}
            />

            {/* Question content */}
            <View className="flex-1 px-5 pt-6">
                {/* Score counter */}
                <View className="flex-row items-center justify-end mb-4">
                    <View className="bg-green-50 px-3 py-1 rounded-full">
                        <Text className="text-xs font-bold text-green-600">
                            {score} correct
                        </Text>
                    </View>
                </View>

                {/* Question text */}
                <Text className="text-xl font-bold text-slate-900 mb-6 leading-8">
                    {currentQuestion.text}
                </Text>

                {/* Options */}
                <View>
                    {currentQuestion.options.map((option: string, optIndex: number) => (
                        <QuizOptionCard
                            key={optIndex}
                            index={optIndex}
                            text={option}
                            state={getOptionState(optIndex)}
                            disabled={questionState === "feedback"}
                            onPress={handleOptionPress}
                        />
                    ))}
                </View>

                {/* Feedback banner */}
                {questionState === "feedback" ? (
                    <FeedbackBanner
                        isCorrect={isCorrectAnswer}
                        explanation={currentQuestion.explanation}
                    />
                ) : null}
            </View>

            {/* Bottom buttons */}
            <View className="px-5 pb-4 pt-2">
                {questionState === "answering" ? (
                    /* Check Answer button — only shown after selecting */
                    <PressableScale
                        onPress={handleCheckAnswer}
                        scale={0.96}
                        hapticStyle="light"
                        disabled={selectedOption === null}
                        style={{
                            backgroundColor: selectedOption !== null ? "#D97706" : "#E2E8F0",
                            paddingVertical: 16,
                            borderRadius: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomWidth: selectedOption !== null ? 4 : 0,
                            borderBottomColor: "#B45309",
                            opacity: selectedOption !== null ? 1 : 0.6,
                        }}
                        accessibilityLabel="Check your answer"
                        accessibilityRole="button"
                        accessibilityState={{ disabled: selectedOption === null }}
                    >
                        <Text
                            className={`text-base font-bold ${selectedOption !== null ? "text-white" : "text-slate-400"
                                }`}
                        >
                            Check Answer
                        </Text>
                    </PressableScale>
                ) : (
                    /* Continue button — shown after feedback */
                    <PressableScale
                        onPress={handleContinue}
                        scale={0.96}
                        hapticStyle="medium"
                        style={{
                            backgroundColor: isCorrectAnswer ? "#16A34A" : "#3B82F6",
                            paddingVertical: 16,
                            borderRadius: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomWidth: 4,
                            borderBottomColor: isCorrectAnswer ? "#15803D" : "#2563EB",
                        }}
                        accessibilityLabel={
                            currentIndex === totalQuestions - 1
                                ? "See your results"
                                : "Continue to next question"
                        }
                        accessibilityRole="button"
                    >
                        <Text className="text-base font-bold text-white mr-1">
                            {currentIndex === totalQuestions - 1 ? "See Results" : "Continue"}
                        </Text>
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={18}
                            color="#FFFFFF"
                        />
                    </PressableScale>
                )}
            </View>
        </SafeAreaView>
    );
}
