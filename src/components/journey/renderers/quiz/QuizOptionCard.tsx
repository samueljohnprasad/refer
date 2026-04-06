/**
 * QuizOptionCard
 * Single answer option card with states: default, selected, correct, incorrect.
 * Includes letter index (A, B, C, D), text, and animated feedback.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    CheckmarkCircle02Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';

// ============================================================================
// Types
// ============================================================================

export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'missed_correct';

export interface QuizOptionCardProps {
    index: number;
    text: string;
    state: OptionState;
    disabled: boolean;
    onPress: (index: number) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STATE_STYLES: Record<OptionState, { container: string; badge: string; text: string }> = {
    default: {
        container: 'bg-white border-slate-200',
        badge: 'bg-slate-100',
        text: 'text-slate-700',
    },
    selected: {
        container: 'bg-blue-50 border-blue-400',
        badge: 'bg-blue-500',
        text: 'text-blue-800',
    },
    correct: {
        container: 'bg-green-50 border-green-400',
        badge: 'bg-green-500',
        text: 'text-green-800',
    },
    incorrect: {
        container: 'bg-red-50 border-red-400',
        badge: 'bg-red-500',
        text: 'text-red-800',
    },
    missed_correct: {
        container: 'bg-green-50 border-green-300',
        badge: 'bg-green-400',
        text: 'text-green-700',
    },
};

const SPRING_CONFIG = { damping: 12, stiffness: 200 };

// ============================================================================
// Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuizOptionCard({
    index,
    text,
    state,
    disabled,
    onPress,
}: QuizOptionCardProps): React.JSX.Element {
    const scale = useSharedValue<number>(1);
    const translateX = useSharedValue<number>(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateX: translateX.value }],
    }));

    const handlePressIn = useCallback((): void => {
        if (!disabled) {
            scale.value = withSpring(0.97, SPRING_CONFIG);
        }
    }, [disabled, scale]);

    const handlePressOut = useCallback((): void => {
        scale.value = withSpring(1, SPRING_CONFIG);
    }, [scale]);

    const handlePress = useCallback((): void => {
        if (!disabled) {
            onPress(index);
        }
    }, [disabled, index, onPress]);

    // Shake animation for incorrect
    React.useEffect(() => {
        if (state === 'incorrect') {
            translateX.value = withSequence(
                withTiming(-8, { duration: 50 }),
                withTiming(8, { duration: 50 }),
                withTiming(-6, { duration: 50 }),
                withTiming(6, { duration: 50 }),
                withTiming(0, { duration: 50 }),
            );
        }
    }, [state, translateX]);

    const styles = STATE_STYLES[state];
    const letter: string = String.fromCharCode(65 + index);

    const showCheckmark: boolean = state === 'correct' || state === 'missed_correct';
    const showX: boolean = state === 'incorrect';

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={animatedStyle}
            className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${styles.container}`}
            accessibilityLabel={`Option ${letter}: ${text}${state === 'selected' ? ', selected' : ''
                }${state === 'correct' ? ', correct' : ''}${state === 'incorrect' ? ', incorrect' : ''
                }`}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected', disabled }}
        >
            {/* Letter badge / icon */}
            <View
                className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${styles.badge}`}
            >
                {showCheckmark ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="#FFFFFF" />
                ) : showX ? (
                    <HugeiconsIcon icon={Cancel01Icon} size={18} color="#FFFFFF" />
                ) : (
                    <Text
                        className={`text-sm font-bold ${state === 'selected' ? 'text-white' : 'text-slate-500'
                            }`}
                    >
                        {letter}
                    </Text>
                )}
            </View>

            {/* Option text */}
            <Text className={`flex-1 text-base font-medium leading-6 ${styles.text}`}>
                {text}
            </Text>
        </AnimatedPressable>
    );
}
