import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface SkeletonProps {
    width?: number | string;
    height?: number;
    radius?: number;
    className?: string;
}

export function Skeleton({
    width = "100%",
    height = 16,
    radius = 8,
    className,
}: SkeletonProps) {
    const reducedMotion = useReducedMotion();
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        if (reducedMotion) return;
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.4, { duration: 800 }),
            ),
            -1,
            true,
        );
    }, []);

    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            style={[style, { width: width as any, height, borderRadius: radius }]}
            className={`bg-sage-100 ${className || ""}`}
        />
    );
}

interface SkeletonCardProps {
    lines?: number;
    className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
    return (
        <View className={`rounded-xl border-2 border-brand-border bg-brand-surface p-4 ${className || ""}`}>
            <Skeleton height={14} width="65%" className="mb-3" />
            {Array.from({ length: lines - 1 }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={12}
                    width={i === lines - 2 ? "45%" : "90%"}
                    className="mb-2"
                />
            ))}
        </View>
    );
}

interface SkeletonListProps {
    count?: number;
    cardHeight?: number;
    className?: string;
}

export function SkeletonList({ count = 3, className }: SkeletonListProps) {
    return (
        <View className={`gap-3 ${className || ""}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </View>
    );
}
