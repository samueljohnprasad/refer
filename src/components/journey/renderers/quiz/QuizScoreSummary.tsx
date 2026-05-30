/**
 * QuizScoreSummary
 * End-of-quiz score screen with question review.
 * Shows score, celebration/encouragement, question list with ✓/✗.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withDelay,
} from 'react-native-reanimated';

import type { QuizQuestion } from '@/src/types/journey/mentalHealth';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { BRAND_SURFACE, GOLD, SAGE } from '@/lib/tokens';
import { SPRING_BOUNCY } from '@/src/utils/motionTokens';

// ============================================================================
// Types
// ============================================================================

export interface QuizAnswer {
    questionIndex: number;
    selectedIndex: number;
    correct: boolean;
}

export interface QuizScoreSummaryProps {
    questions: QuizQuestion[];
    answers: QuizAnswer[];
    score: number;
    total: number;
    isPerfect: boolean;
    onComplete: () => void;
}

// ============================================================================
// Sub-components
// ============================================================================

/** Animated score circle */
function ScoreCircle({
    score,
    total,
    isPerfect,
}: {
    score: number;
    total: number;
    isPerfect: boolean;
}): React.JSX.Element {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withDelay(200, withSpring(1, SPRING_BOUNCY)) }],
        opacity: withDelay(200, withSpring(1)),
    }));

    const percentage: number = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <Animated.View
            style={[animatedStyle, { transform: [{ scale: 0.5 }], opacity: 0 }]}
            className="items-center mb-6"
        >
            <View
                className={`h-28 w-28 items-center justify-center rounded-full ${isPerfect ? 'bg-sage-pill' : percentage >= 70 ? 'bg-sage-selected' : 'bg-brand-surface-soft'
                    }`}
            >
                <Text
                    className={`happy-font-heading-bold text-3xl ${isPerfect ? 'text-gold' : percentage >= 70 ? 'text-sage-600' : 'text-ink-muted'
                        }`}
                >
                    {score}/{total}
                </Text>
            </View>
        </Animated.View>
    );
}

// ============================================================================
// Component
// ============================================================================

export default function QuizScoreSummary({
    questions,
    answers,
    score,
    total,
    isPerfect,
    onComplete,
}: QuizScoreSummaryProps): React.JSX.Element {
    const percentage: number = total > 0 ? Math.round((score / total) * 100) : 0;

    const headlineText: string = isPerfect
        ? 'Perfect Score! 🎉'
        : percentage >= 70
            ? 'Great Job! 🌟'
            : 'Good Effort! 💪';

    const subText: string = isPerfect
        ? 'You nailed every question — bonus XP earned!'
        : percentage >= 70
            ? 'You\'re building strong knowledge. Keep it up!'
            : 'Review the explanations below to strengthen your understanding.';

    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Score display */}
                <ScoreCircle score={score} total={total} isPerfect={isPerfect} />

                {/* Headline */}
                <Text className="happy-font-heading-bold mb-2 text-center text-[26px] leading-8 text-ink">
                    {headlineText}
                </Text>
                <Text className="happy-font-body-medium mb-6 px-4 text-center text-sm leading-5 text-ink-muted">
                    {subText}
                </Text>

                {/* Question review list */}
                <View className="gap-3">
                    {questions.map((question: QuizQuestion, qIndex: number) => {
                        const answer: QuizAnswer | undefined = answers.find(
                            (a: QuizAnswer) => a.questionIndex === qIndex,
                        );
                        const isCorrect: boolean = answer?.correct ?? false;
                        const selectedOption: string | undefined =
                            answer !== undefined ? question.options[answer.selectedIndex] : undefined;
                        const correctOption: string = question.options[question.correct_index];

                        return (
                            <View
                                key={qIndex}
                                className={`rounded-[24px] p-4 ${isCorrect ? 'happy-brand-card-selected' : 'border-2 border-terracotta-light bg-brand-surface'
                                    }`}
                            >
                                {/* Question header */}
                                <View className="flex-row items-start gap-2 mb-2">
                                    <View
                                        className={`mt-0.5 h-6 w-6 items-center justify-center rounded-full ${isCorrect ? 'bg-sage-500' : 'bg-terracotta'
                                            }`}
                                    >
                                        {isCorrect ? (
                                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color={BRAND_SURFACE} />
                                        ) : (
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} color={BRAND_SURFACE} />
                                        )}
                                    </View>
                                    <Text
                                        className={`happy-font-body-bold flex-1 text-sm ${isCorrect ? 'text-sage-800' : 'text-terracotta'
                                            }`}
                                    >
                                        {question.text}
                                    </Text>
                                </View>

                                {/* Answer details */}
                                {!isCorrect && selectedOption ? (
                                    <View className="ml-8 mb-1">
                                        <Text className="happy-font-body-medium text-xs text-terracotta">
                                            Your answer: {selectedOption}
                                        </Text>
                                        <Text className="happy-font-body-semibold text-xs text-sage-600">
                                            Correct: {correctOption}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Explanation */}
                                <Text
                                    className={`happy-font-body-medium ml-8 text-xs leading-4 ${isCorrect ? 'text-sage-600' : 'text-ink-soft'
                                        }`}
                                >
                                    {question.explanation}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Complete button */}
            <View className="pt-4 pb-2">
                <PressableScale
                    onPress={onComplete}
                    scale={0.96}
                    hapticStyle="medium"
                    style={{
                        backgroundColor: isPerfect ? GOLD : SAGE[500],
                        paddingVertical: 16,
                        borderRadius: 22,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 4,
                        borderBottomColor: isPerfect ? GOLD : SAGE[700],
                    }}
                    accessibilityLabel="Complete quiz and continue"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={BRAND_SURFACE} />
                    <Text className="happy-font-body-bold ml-2 text-base text-brand-surface">
                        Continue
                    </Text>
                </PressableScale>
            </View>
        </View>
    );
}
