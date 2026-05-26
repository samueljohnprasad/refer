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
import { BRAND_SURFACE } from '@/lib/tokens';

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
        container: 'happy-brand-card',
        badge: 'bg-sage-50',
        text: 'text-ink',
    },
    selected: {
        container: 'happy-brand-card-selected',
        badge: 'bg-sage-500',
        text: 'text-sage-700',
    },
    correct: {
        container: 'happy-brand-card-selected',
        badge: 'bg-sage-500',
        text: 'text-sage-800',
    },
    incorrect: {
        container: 'border-2 border-terracotta-light bg-brand-surface',
        badge: 'bg-terracotta',
        text: 'text-terracotta',
    },
    missed_correct: {
        container: 'border-2 border-sage-300 bg-sage-50',
        badge: 'bg-sage-400',
        text: 'text-sage-700',
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
            className={`mb-3 flex-row items-center rounded-[24px] p-4 ${styles.container}`}
            accessibilityLabel={`Option ${letter}: ${text}${state === 'selected' ? ', selected' : ''
                }${state === 'correct' ? ', correct' : ''}${state === 'incorrect' ? ', incorrect' : ''
                }`}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected', disabled }}
        >
            {/* Letter badge / icon */}
            <View
                className={`mr-3 h-9 w-9 items-center justify-center rounded-full ${styles.badge}`}
            >
                {showCheckmark ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color={BRAND_SURFACE} />
                ) : showX ? (
                    <HugeiconsIcon icon={Cancel01Icon} size={18} color={BRAND_SURFACE} />
                ) : (
                    <Text
                        className={`happy-font-body-bold text-sm ${state === 'selected' ? 'text-brand-surface' : 'text-ink-muted'
                            }`}
                    >
                        {letter}
                    </Text>
                )}
            </View>

            {/* Option text */}
            <Text className={`happy-font-body-semibold flex-1 text-base leading-6 ${styles.text}`}>
                {text}
            </Text>
        </AnimatedPressable>
    );
}
