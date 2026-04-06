/**
 * JourneyCard (P1.2.3)
 * Reusable card shown in the journey catalog grid.
 *
 * Presentational only — receives all data via props.
 * Features:
 * - Journey icon + color theme background
 * - Title, description (2-line truncated)
 * - Metadata: estimated_days, total_nodes, difficulty badge
 * - Progress bar (if enrolled)
 * - Status badge: New / In Progress / Completed
 * - Press feedback with scale animation
 */

import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
    BookOpen02Icon,
    Target01Icon,
    Clock01Icon,
    CheckmarkCircle02Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import type { MentalHealthJourneyListItem } from "@/src/types/journey/mentalHealth";

// ============================================================================
// Types
// ============================================================================

export interface JourneyCardProps {
    journey: MentalHealthJourneyListItem;
    onPress: (journey: MentalHealthJourneyListItem) => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Color theme map — maps color_theme_key to gradient-like bg + accent */
const THEME_COLORS: Record<
    string,
    { bg: string; accent: string; text: string }
> = {
    blue: { bg: "bg-blue-50", accent: "bg-blue-500", text: "text-blue-700" },
    purple: {
        bg: "bg-purple-50",
        accent: "bg-purple-500",
        text: "text-purple-700",
    },
    green: { bg: "bg-green-50", accent: "bg-green-500", text: "text-green-700" },
    orange: {
        bg: "bg-orange-50",
        accent: "bg-orange-500",
        text: "text-orange-700",
    },
    pink: { bg: "bg-pink-50", accent: "bg-pink-500", text: "text-pink-700" },
};

/** Difficulty badge colors */
const DIFFICULTY_STYLES: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
};

// ============================================================================
// Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function JourneyCard({
    journey,
    onPress,
}: JourneyCardProps): React.JSX.Element {
    const scale = useSharedValue<number>(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback((): void => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePressOut = useCallback((): void => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePress = useCallback((): void => {
        onPress(journey);
    }, [onPress, journey]);

    const theme =
        THEME_COLORS[journey.colorThemeKey ?? journey.colorScheme] ??
        THEME_COLORS.blue;
    const progressPercent: number =
        journey.totalNodes > 0
            ? Math.round((journey.completedNodes / journey.totalNodes) * 100)
            : 0;

    const isEnrolled: boolean = journey.isEnrolled;
    const isCompleted: boolean = journey.enrollmentStatus === "completed";
    const isInProgress: boolean = isEnrolled && !isCompleted;

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={animatedStyle}
            className={`rounded-2xl ${theme.bg} p-4 mb-3 border border-slate-100`}
            accessibilityLabel={`${journey.title} journey`}
            accessibilityRole="button"
        >
            {/* Header: Icon + Status Badge */}
            <View className="flex-row items-start justify-between mb-3">
                {/* Icon circle */}
                <View
                    className={`w-12 h-12 rounded-xl ${theme.accent} items-center justify-center`}
                >
                    <HugeiconsIcon
                        icon={BookOpen02Icon}
                        size={24}
                        color="#FFFFFF"
                    />
                </View>

                {/* Status badge */}
                {isCompleted ? (
                    <View className="flex-row items-center bg-green-100 px-2.5 py-1 rounded-full">
                        <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={14}
                            color="#16A34A"
                        />
                        <Text className="text-xs font-semibold text-green-700 ml-1">
                            Completed
                        </Text>
                    </View>
                ) : isInProgress ? (
                    <View className="flex-row items-center bg-blue-100 px-2.5 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-blue-700">
                            In Progress
                        </Text>
                    </View>
                ) : (
                    <View className="bg-slate-100 px-2.5 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-slate-500">New</Text>
                    </View>
                )}
            </View>

            {/* Title */}
            <Text
                className="text-base font-bold text-slate-900 mb-1"
                numberOfLines={1}
            >
                {journey.title}
            </Text>

            {/* Description */}
            <Text
                className="text-sm text-slate-500 mb-3 leading-5"
                numberOfLines={2}
            >
                {journey.description}
            </Text>

            {/* Metadata row */}
            <View className="flex-row items-center gap-3 mb-3">
                {/* Duration */}
                {journey.estimatedDays ? (
                    <View className="flex-row items-center gap-1">
                        <HugeiconsIcon
                            icon={Clock01Icon}
                            size={14}
                            color="#94A3B8"
                        />
                        <Text className="text-xs text-slate-400">
                            {journey.estimatedDays}d
                        </Text>
                    </View>
                ) : null}

                {/* Node count */}
                <View className="flex-row items-center gap-1">
                    <HugeiconsIcon
                        icon={Target01Icon}
                        size={14}
                        color="#94A3B8"
                    />
                    <Text className="text-xs text-slate-400">
                        {journey.totalNodes} nodes
                    </Text>
                </View>

                {/* Difficulty badge */}
                <View
                    className={`px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[journey.difficulty] ?? DIFFICULTY_STYLES.beginner}`}
                >
                    <Text className="text-xs font-medium capitalize">
                        {journey.difficulty}
                    </Text>
                </View>
            </View>

            {/* Progress bar (if enrolled) */}
            {isEnrolled && !isCompleted ? (
                <View className="mb-2">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xs text-slate-400">
                            {journey.completedNodes}/{journey.totalNodes} nodes
                        </Text>
                        <Text className={`text-xs font-semibold ${theme.text}`}>
                            {progressPercent}%
                        </Text>
                    </View>
                    <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View
                            className={`h-full ${theme.accent} rounded-full`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </View>
                </View>
            ) : null}

            {/* CTA row */}
            {isInProgress ? (
                <View className="flex-row items-center justify-end mt-1">
                    <Text className={`text-sm font-semibold ${theme.text} mr-1`}>
                        Continue
                    </Text>
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        color="#3B82F6"
                    />
                </View>
            ) : null}
        </AnimatedPressable>
    );
}

export default React.memo(JourneyCard);
