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
        transform: [{ scale: withDelay(200, withSpring(1, { damping: 8, stiffness: 100 })) }],
        opacity: withDelay(200, withSpring(1)),
    }));

    const percentage: number = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <Animated.View
            style={[animatedStyle, { transform: [{ scale: 0.5 }], opacity: 0 }]}
            className="items-center mb-6"
        >
            <View
                className={`w-28 h-28 rounded-full items-center justify-center ${isPerfect ? 'bg-yellow-100' : percentage >= 70 ? 'bg-green-100' : 'bg-blue-100'
                    }`}
            >
                <Text
                    className={`text-3xl font-bold ${isPerfect ? 'text-yellow-600' : percentage >= 70 ? 'text-green-600' : 'text-blue-600'
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
                <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
                    {headlineText}
                </Text>
                <Text className="text-sm text-slate-400 text-center mb-6 leading-5 px-4">
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
                                className={`rounded-2xl p-4 border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                                    }`}
                            >
                                {/* Question header */}
                                <View className="flex-row items-start gap-2 mb-2">
                                    <View
                                        className={`w-6 h-6 rounded-full items-center justify-center mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    >
                                        {isCorrect ? (
                                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#FFFFFF" />
                                        ) : (
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} color="#FFFFFF" />
                                        )}
                                    </View>
                                    <Text
                                        className={`flex-1 text-sm font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'
                                            }`}
                                    >
                                        {question.text}
                                    </Text>
                                </View>

                                {/* Answer details */}
                                {!isCorrect && selectedOption ? (
                                    <View className="ml-8 mb-1">
                                        <Text className="text-xs text-red-500">
                                            Your answer: {selectedOption}
                                        </Text>
                                        <Text className="text-xs text-green-600 font-medium">
                                            Correct: {correctOption}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Explanation */}
                                <Text
                                    className={`text-xs ml-8 leading-4 ${isCorrect ? 'text-green-600' : 'text-red-600'
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
                        backgroundColor: isPerfect ? '#EAB308' : '#16A34A',
                        paddingVertical: 16,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 4,
                        borderBottomColor: isPerfect ? '#CA8A04' : '#15803D',
                    }}
                    accessibilityLabel="Complete quiz and continue"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#FFFFFF" />
                    <Text className="text-base font-bold text-white ml-2">
                        Continue
                    </Text>
                </PressableScale>
            </View>
        </View>
    );
}
