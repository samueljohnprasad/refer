/**
 * XPCounter (P1.5.2)
 *
 * Animated counter showing total Insight Points (IP).
 *
 * Features:
 * - ⚡ icon + total IP display
 * - On XP earn: animate number counting up from old → new value
 * - Small "+X" flyover animation (floats up and fades out)
 * - Tap → open XP detail (callback)
 * - Used alongside StreakBanner in headers
 *
 * Pure presentational — all data via props.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withSpring,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

// ============================================================================
// Types
// ============================================================================

/** A recent gain to show as a flyover */
export interface XPGain {
    id: string;
    amount: number;
    label: string;
}

export interface XPCounterProps {
    /** Total IP to display */
    totalIP: number;
    /** Recent gains to animate as flyovers */
    recentGains: XPGain[];
    /** Called when a gain flyover finishes (to clear it) */
    onGainDismissed?: (id: string) => void;
    /** Called when user taps the counter */
    onPress?: () => void;
    /** Compact mode (smaller text) */
    compact?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const COUNT_DURATION: number = 600;
const FLYOVER_DURATION: number = 1500;

// ============================================================================
// Sub-components
// ============================================================================

/** Animated counter that smoothly counts from prev → next */
function AnimatedNumber({
    value,
    compact,
}: {
    value: number;
    compact: boolean;
}): React.JSX.Element {
    const [displayValue, setDisplayValue] = useState<number>(value);
    const prevValueRef = useRef<number>(value);
    const scale = useSharedValue<number>(1);

    useEffect(() => {
        const prevValue: number = prevValueRef.current;
        prevValueRef.current = value;

        if (prevValue === value) return;

        // Bounce animation on change
        scale.value = withSequence(
            withSpring(1.2, { damping: 20, stiffness: 100, overshootClamping: true }),
            withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
        );

        // Count up animation
        const startTime: number = Date.now();
        const diff: number = value - prevValue;
        const interval = setInterval(() => {
            const elapsed: number = Date.now() - startTime;
            const fraction: number = Math.min(elapsed / COUNT_DURATION, 1);
            // Ease out cubic
            const eased: number = 1 - Math.pow(1 - fraction, 3);
            const current: number = Math.round(prevValue + diff * eased);
            setDisplayValue(current);
            if (fraction >= 1) clearInterval(interval);
        }, 16);

        return () => clearInterval(interval);
    }, [value, scale]);

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={scaleStyle}>
            <Text
                className={`font-bold text-amber-700 ${compact ? 'text-sm' : 'text-base'
                    }`}
            >
                {displayValue.toLocaleString()}
            </Text>
        </Animated.View>
    );
}

/** Single "+X" flyover that floats up and fades */
function GainFlyover({
    gain,
    onComplete,
}: {
    gain: XPGain;
    onComplete: (id: string) => void;
}): React.JSX.Element {
    const translateY = useSharedValue<number>(0);
    const opacity = useSharedValue<number>(1);

    useEffect(() => {
        translateY.value = withTiming(-40, {
            duration: FLYOVER_DURATION,
            easing: Easing.out(Easing.cubic),
        });
        opacity.value = withDelay(
            FLYOVER_DURATION * 0.6,
            withTiming(0, { duration: FLYOVER_DURATION * 0.4 }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)(gain.id);
                }
            }),
        );
    }, [gain.id, translateY, opacity, onComplete]);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[style, { position: 'absolute', top: -8, right: 0 }]}
            pointerEvents="none"
        >
            <View className="bg-green-500 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-bold text-white">
                    +{gain.amount}
                </Text>
            </View>
        </Animated.View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

function XPCounterInner({
    totalIP,
    recentGains,
    onGainDismissed,
    onPress,
    compact = false,
}: XPCounterProps): React.JSX.Element {
    const handleFlyoverComplete = useCallback(
        (id: string): void => {
            onGainDismissed?.(id);
        },
        [onGainDismissed],
    );

    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center gap-1 relative ${compact ? '' : 'bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl'
                }`}
            accessibilityLabel={`${totalIP} insight points. Tap for details.`}
            accessibilityRole="button"
        >
            {/* Lightning icon */}
            <Text style={{ fontSize: compact ? 14 : 16 }}>⚡</Text>

            {/* Animated number */}
            <AnimatedNumber value={totalIP} compact={compact} />

            {/* IP label (full mode only) */}
            {!compact ? (
                <Text className="text-xs text-ink-muted ml-0.5">IP</Text>
            ) : null}

            {/* Flyover animations */}
            {recentGains.slice(0, 3).map((gain: XPGain) => (
                <GainFlyover
                    key={gain.id}
                    gain={gain}
                    onComplete={handleFlyoverComplete}
                />
            ))}
        </Pressable>
    );
}

export const XPCounter = React.memo(XPCounterInner);
export default XPCounter;
