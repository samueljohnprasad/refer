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
import { View, Text, ScrollView } from "react-native";
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
import { BRAND_SURFACE, INK_MUTED, SAGE, TERRACOTTA } from "@/lib/tokens";
import {
    RendererPrimaryCTA,
    RendererSectionCard,
    RendererTitleBlock,
    RendererTopProgress,
} from "../RendererFrame";

import QuizOptionCard, { type OptionState } from "./QuizOptionCard";
import QuizScoreSummary, { type QuizAnswer } from "./QuizScoreSummary";
import { Card } from "@/src/components/ui/Card";

import { useAudioPlayer } from "expo-audio";

// ============================================================================
// Types
// ============================================================================

export interface QuizNodeRendererProps {
    /** Quiz node content from template JSONB */
    content: QuizContent;
    /** Node title (shown in header) */
    title: string;
    /** XP reward displayed in the renderer header */
    xpReward?: number;
    /** Called when user completes the quiz */
    onComplete: (responseData: QuizResponseData) => void | Promise<void>;
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
        <View className="flex-row items-center px-5 pb-4 pt-4">
            <PressableScale
                onPress={onBack}
                scale={0.9}
                hapticStyle="light"
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: SAGE.pill,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                accessibilityLabel="Go back"
                accessibilityRole="button"
            >
                <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={20}
                    color={INK_MUTED}
                />
            </PressableScale>

            <View className="flex-1 mx-3">
                <Text
                    className="happy-font-body-bold text-sm text-ink"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text className="happy-font-body-medium text-xs text-ink-muted">
                    {showingSummary
                        ? "Results"
                        : `Question ${currentQuestion + 1} of ${totalQuestions}`}
                </Text>
            </View>

            <View className="happy-brand-status-chip px-3 py-1.5">
                <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={16}
                    color={SAGE[600]}
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
        <View className="mx-5 h-1.5 overflow-hidden rounded-full bg-sage-100">
            <View
                className="h-full rounded-full bg-sage-500"
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
        <Card
            variant={isCorrect ? "answer-selected" : "tile"}
            radius="xl"
            showDepth={false}
            className={isCorrect ? "mt-4" : "mt-4 border-2 border-terracotta-light bg-brand-surface"}
            contentClassName="p-4"
        >
            <Text
                className={`happy-font-body-bold mb-1 text-base ${isCorrect ? "text-sage-700" : "text-terracotta"
                    }`}
            >
                {isCorrect ? "Correct! 🎉" : "That's okay! 💪"}
            </Text>
            <Text
                className={`happy-font-body-medium text-sm leading-5 ${isCorrect ? "text-sage-600" : "text-ink-soft"
                    }`}
            >
                {explanation}
            </Text>
        </Card>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function QuizNodeRenderer({
    content,
    title,
    xpReward,
    onComplete,
    onBack,
}: QuizNodeRendererProps): React.JSX.Element {
    const questions: QuizQuestion[] = content.questions;
    const totalQuestions: number = questions.length;

    // ── Sounds ──
    const correctSound = useAudioPlayer(require("@/assets/sounds/correct.mp3"));
    const incorrectSound = useAudioPlayer(require("@/assets/sounds/incorrect.wav"));

    // ── State ──
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [questionState, setQuestionState] =
        useState<QuestionState>("answering");
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [showingSummary, setShowingSummary] = useState<boolean>(false);
    const [isCompleting, setIsCompleting] = useState<boolean>(false);

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

        // Sound and haptic feedback
        if (correct) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            correctSound.seekTo(0);
            correctSound.play();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            incorrectSound.seekTo(0);
            incorrectSound.play();
        }

        // Record answer
        const answer: QuizAnswer = {
            questionIndex: currentIndex,
            selectedIndex: selectedOption,
            correct,
        };
        setAnswers((prev: QuizAnswer[]) => [...prev, answer]);
        setQuestionState("feedback");
    }, [selectedOption, currentQuestion, currentIndex, correctSound, incorrectSound]);

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

    const handleComplete = useCallback(async (): Promise<void> => {
        if (isCompleting) return;
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

        setIsCompleting(true);
        try {
            await onComplete(responseData);
        } finally {
            setIsCompleting(false);
        }
    }, [answers, totalQuestions, isCompleting, onComplete]);

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
            <View className="happy-brand-screen flex-1">
                <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
                <RendererTopProgress
                    progress={1}
                    xpReward={xpReward}
                    onClose={onBack}
                />
                <RendererTitleBlock
                    eyebrow="Results"
                    title="Quiz complete."
                    subtitle="Review what landed, then keep moving."
                />

                <View className="flex-1 px-7">
                    <QuizScoreSummary
                        questions={questions}
                        answers={answers}
                        score={score}
                        total={totalQuestions}
                        isPerfect={isPerfect}
                        isCompleting={isCompleting}
                        onComplete={handleComplete}
                    />
                </View>
                </SafeAreaView>
            </View>
        );
    }

    // ── Question screen ──
    if (!currentQuestion) return <View />;

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <RendererTopProgress
                progress={totalQuestions > 0 ? (currentIndex + 1) / (totalQuestions + 1) : 0}
                xpReward={xpReward}
                onClose={onBack}
            />

            <RendererTitleBlock
                eyebrow={`Quiz ${currentIndex + 1} of ${totalQuestions}`}
                title={title}
                subtitle="Pick the answer that fits best."
            />

            {/* Question content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Score counter */}
                <View className="flex-row items-center justify-end mb-4">
                    <View className="happy-brand-status-chip px-3 py-1">
                        <Text className="happy-font-body-bold text-xs text-sage-600">
                            {score} correct
                        </Text>
                    </View>
                </View>

                <RendererSectionCard eyebrow="Question">
                    <Text className="happy-font-heading-bold mb-4 text-[21px] leading-7 text-ink">
                        {currentQuestion.text}
                    </Text>

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
                </RendererSectionCard>

                {/* Feedback banner */}
                {questionState === "feedback" ? (
                    <FeedbackBanner
                        isCorrect={isCorrectAnswer}
                        explanation={currentQuestion.explanation}
                    />
                ) : null}
            </ScrollView>

            {/* Bottom buttons */}
            <View className="px-7 pb-4 pt-2">
                {questionState === "answering" ? (
                    /* Check Answer button — only shown after selecting */
                    <RendererPrimaryCTA
                        label="Check Answer"
                        onPress={handleCheckAnswer}
                        disabled={selectedOption === null}
                    />
                ) : (
                    /* Continue button — shown after feedback */
                    <RendererPrimaryCTA
                        label={currentIndex === totalQuestions - 1 ? "See Results" : "Continue"}
                        onPress={handleContinue}
                        tone={isCorrectAnswer ? "sage" : "terracotta"}
                    />
                )}
            </View>
            </SafeAreaView>
        </View>
    );
}
