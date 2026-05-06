import { useEffect } from "react";
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { GRAPH_ANIMATION } from "./constants";
import type { AnimatedScalar } from "./types";

const animateScalarToOne = (
    sharedValue: AnimatedScalar,
    delay: number,
    duration: number,
): void => {
    sharedValue.value = withDelay(
        delay,
        withTiming(1, {
            duration,
            easing: Easing.out(Easing.cubic),
        }),
    );
};

export const useProgressGraphVictoryAnimation = () => {
    const comparisonProjectionEnd = useSharedValue(0);
    const comparisonDashOpacity = useSharedValue(0);
    const happyProjectionEnd = useSharedValue(0);
    const startDotOpacity = useSharedValue(0);
    const comparisonDotOpacity = useSharedValue(0);
    const endDotOpacity = useSharedValue(0);
    const labelProgress = useSharedValue(0);

    useEffect(() => {
        animateScalarToOne(
            startDotOpacity as AnimatedScalar,
            GRAPH_ANIMATION.startDotDelay,
            GRAPH_ANIMATION.startDotDuration,
        );
        animateScalarToOne(
            comparisonProjectionEnd as AnimatedScalar,
            GRAPH_ANIMATION.comparisonLineDelay,
            GRAPH_ANIMATION.comparisonLineDuration,
        );
        animateScalarToOne(
            comparisonDashOpacity as AnimatedScalar,
            GRAPH_ANIMATION.comparisonDashDelay,
            GRAPH_ANIMATION.comparisonDashDuration,
        );
        animateScalarToOne(
            comparisonDotOpacity as AnimatedScalar,
            GRAPH_ANIMATION.comparisonDotDelay,
            GRAPH_ANIMATION.comparisonDotDuration,
        );
        animateScalarToOne(
            happyProjectionEnd as AnimatedScalar,
            GRAPH_ANIMATION.happyLineDelay,
            GRAPH_ANIMATION.happyLineDuration,
        );
        animateScalarToOne(
            endDotOpacity as AnimatedScalar,
            GRAPH_ANIMATION.endDotDelay,
            GRAPH_ANIMATION.endDotDuration,
        );
        animateScalarToOne(
            labelProgress as AnimatedScalar,
            GRAPH_ANIMATION.badgeDelay,
            GRAPH_ANIMATION.badgeDuration,
        );
    }, [
        comparisonDashOpacity,
        comparisonDotOpacity,
        comparisonProjectionEnd,
        endDotOpacity,
        happyProjectionEnd,
        labelProgress,
        startDotOpacity,
    ]);

    const labelAnimatedStyle = useAnimatedStyle(() => ({
        opacity: labelProgress.value,
        transform: [
            { translateY: 10 * (1 - labelProgress.value) },
            { scale: 0.92 + labelProgress.value * 0.08 },
        ],
    }));

    return {
        comparisonProjectionEnd: comparisonProjectionEnd as AnimatedScalar,
        comparisonDashOpacity: comparisonDashOpacity as AnimatedScalar,
        happyProjectionEnd: happyProjectionEnd as AnimatedScalar,
        startDotOpacity: startDotOpacity as AnimatedScalar,
        comparisonDotOpacity: comparisonDotOpacity as AnimatedScalar,
        endDotOpacity: endDotOpacity as AnimatedScalar,
        labelAnimatedStyle,
    };
};

export type ProgressGraphVictoryAnimationState = ReturnType<
    typeof useProgressGraphVictoryAnimation
>;
