/**
 * SpotlightTooltip (P1.6.3)
 *
 * Dims the entire screen except for a spotlight cutout around the
 * target UI element, with a tooltip bubble pointing at it.
 *
 * Features:
 * - Dims background (semi-transparent overlay)
 * - Spotlight cutout (circular or rectangular)
 * - Tooltip bubble with message + "Got it" button
 * - Animated entrance (fade + scale)
 * - Dismissible on tap anywhere or "Got it"
 * - Points up or down based on target position
 *
 * Pure presentational — all data via props.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// ============================================================================
// Types
// ============================================================================

/** Position and size of the spotlight target */
export interface SpotlightTarget {
    /** Center X of the target */
    x: number;
    /** Center Y of the target */
    y: number;
    /** Width of the spotlight cutout */
    width: number;
    /** Height of the spotlight cutout */
    height: number;
}

export interface SpotlightTooltipProps {
    /** Whether the tooltip is visible */
    visible: boolean;
    /** Tooltip message */
    message: string;
    /** Target element position (if null, shows centered without spotlight) */
    target: SpotlightTarget | null;
    /** Called when user dismisses (tap anywhere or "Got it") */
    onDismiss: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const TOOLTIP_MAX_WIDTH: number = 280;
const SPOTLIGHT_PADDING: number = 12;
const TOOLTIP_OFFSET: number = 16;

// ============================================================================
// Component
// ============================================================================

export default function SpotlightTooltip({
    visible,
    message,
    target,
    onDismiss,
}: SpotlightTooltipProps): React.JSX.Element | null {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const overlayOpacity = useSharedValue<number>(0);
    const tooltipScale = useSharedValue<number>(0.8);
    const tooltipOpacity = useSharedValue<number>(0);

    useEffect(() => {
        if (visible) {
            overlayOpacity.value = withTiming(1, { duration: 300 });
            tooltipScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }));
            tooltipOpacity.value = withDelay(200, withTiming(1, { duration: 250 }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            overlayOpacity.value = withTiming(0, { duration: 200 });
            tooltipScale.value = 0.8;
            tooltipOpacity.value = 0;
        }
    }, [visible, overlayOpacity, tooltipScale, tooltipOpacity]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const tooltipAnimStyle = useAnimatedStyle(() => ({
        opacity: tooltipOpacity.value,
        transform: [{ scale: tooltipScale.value }],
    }));

    if (!visible) return null;

    // Determine tooltip position relative to target
    const hasTarget: boolean = target !== null;
    const targetCenterY: number = target ? target.y : screenHeight / 2;
    const showBelow: boolean = targetCenterY < screenHeight / 2;

    // Tooltip placement
    const tooltipTop: number = hasTarget
        ? showBelow
            ? target!.y + target!.height / 2 + SPOTLIGHT_PADDING + TOOLTIP_OFFSET
            : target!.y - target!.height / 2 - SPOTLIGHT_PADDING - TOOLTIP_OFFSET - 120
        : screenHeight / 2 - 60;

    const tooltipLeft: number = Math.max(
        16,
        Math.min(
            hasTarget ? target!.x - TOOLTIP_MAX_WIDTH / 2 : (screenWidth - TOOLTIP_MAX_WIDTH) / 2,
            screenWidth - TOOLTIP_MAX_WIDTH - 16,
        ),
    );

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
            }}
            pointerEvents="box-none"
        >
            {/* Overlay (tappable to dismiss) */}
            <Pressable
                onPress={onDismiss}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                accessibilityLabel="Dismiss tooltip"
                accessibilityRole="button"
            >
                <Animated.View
                    style={[overlayStyle, { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }]}
                />
            </Pressable>

            {/* Spotlight cutout (white circle over the target) */}
            {hasTarget ? (
                <View
                    style={{
                        position: 'absolute',
                        left: target!.x - (target!.width / 2 + SPOTLIGHT_PADDING),
                        top: target!.y - (target!.height / 2 + SPOTLIGHT_PADDING),
                        width: target!.width + SPOTLIGHT_PADDING * 2,
                        height: target!.height + SPOTLIGHT_PADDING * 2,
                        borderRadius: (target!.width + SPOTLIGHT_PADDING * 2) / 2,
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        borderColor: 'rgba(255,255,255,0.8)',
                    }}
                    pointerEvents="none"
                />
            ) : null}

            {/* Tooltip bubble */}
            <Animated.View
                style={[
                    tooltipAnimStyle,
                    {
                        position: 'absolute',
                        top: tooltipTop,
                        left: tooltipLeft,
                        width: TOOLTIP_MAX_WIDTH,
                    },
                ]}
                pointerEvents="box-none"
            >
                {/* Arrow (pointing up or down) */}
                {hasTarget ? (
                    <View
                        style={{
                            alignSelf: 'center',
                            width: 0,
                            height: 0,
                            borderLeftWidth: 8,
                            borderRightWidth: 8,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            ...(showBelow
                                ? { borderBottomWidth: 8, borderBottomColor: '#FFFFFF', marginBottom: -1 }
                                : { borderTopWidth: 8, borderTopColor: '#FFFFFF', marginTop: -1 }),
                        }}
                    />
                ) : null}

                {/* Bubble */}
                <View className="bg-brand-surface rounded-2xl px-5 py-4" style={{ elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
                    <Text className="text-sm text-ink leading-5 mb-3 text-center">
                        {message}
                    </Text>

                    <Pressable
                        onPress={onDismiss}
                        className="bg-violet-600 py-2.5 px-6 rounded-xl self-center"
                        accessibilityLabel="Got it"
                        accessibilityRole="button"
                    >
                        <Text className="text-sm font-bold text-white">Got it</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}
