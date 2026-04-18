/**
 * UnitDivider (Task 6)
 * Visual divider rendered between units in the scrollable journey path.
 *
 * Matches Duolingo reference (Images 3 & 4):
 * - Horizontal line with centered unit title text
 * - Optional "JUMP HERE?" speech bubble badge
 * - Fast-forward ⏩ button with configurable color
 *
 * All props driven by UnitDividerConfig — no hardcoded values.
 */

import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UnitDividerProps {
    /** Title shown in the divider (e.g. "Describe your family") */
    title: string;
    /** Whether to show "JUMP HERE?" badge */
    showJumpHere: boolean;
    /** Color of the jump button and divider accent */
    accentColor: string;
    /** Callback when "JUMP HERE?" is pressed */
    onJumpPress?: () => void;
}

// ---------------------------------------------------------------------------
// JumpHereBadge sub-component
// ---------------------------------------------------------------------------

interface JumpHereBadgeProps {
    accentColor: string;
    onPress?: () => void;
}

function JumpHereBadge({ accentColor, onPress }: JumpHereBadgeProps): React.JSX.Element {
    const reducedMotion: boolean = useReducedMotion();
    const pulseProgress = useSharedValue(0);

    useEffect(() => {
        if (reducedMotion) return;
        pulseProgress.value = withRepeat(
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, [pulseProgress, reducedMotion]);

    const pulseStyle = useAnimatedStyle(() => {
        const scale: number = interpolate(pulseProgress.value, [0, 1], [1, 1.08]);
        return { transform: [{ scale }] };
    });

    return (
        <View className="items-center mt-4 mb-2">
            {/* Speech bubble */}
            <View
                className="bg-white rounded-xl px-4 py-2 mb-2"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <Text className="text-sm font-bold tracking-wide" style={{ color: accentColor }}>
                    JUMP HERE?
                </Text>
                {/* Arrow pointing down */}
                <View
                    className="absolute -bottom-1.5 self-center w-3 h-3 bg-white"
                    style={{ transform: [{ rotate: '45deg' }], left: '42%' }}
                />
            </View>

            {/* Fast-forward button */}
            <Animated.View style={pulseStyle}>
                <Pressable
                    onPress={onPress}
                    accessibilityRole="button"
                    accessibilityLabel={`Jump to this unit`}
                    className="items-center justify-center rounded-full"
                    style={{
                        width: 56,
                        height: 56,
                        backgroundColor: accentColor,
                        shadowColor: accentColor,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                    }}
                >
                    <Feather name="chevrons-down" size={32} color="white" />
                </Pressable>
            </Animated.View>
        </View>
    );
}

// ---------------------------------------------------------------------------
// UnitDivider
// ---------------------------------------------------------------------------

function UnitDivider({
    title,
    showJumpHere,
    accentColor,
    onJumpPress,
}: UnitDividerProps): React.JSX.Element {
    return (
        <View
            className="w-full px-4 justify-end items-center h-full"
            style={{
                paddingTop: showJumpHere ? 14 : 4,
                paddingBottom: showJumpHere ? 6 : 2,
            }}
        >
            {/* Quiet divider with low-contrast title */}
            <View className="flex-row items-center px-1">
                <View
                    className="flex-1 h-px"
                    style={{ backgroundColor: 'rgba(203, 213, 225, 0.92)' }}
                />
                <View
                    className="mx-3 rounded-full px-2.5 py-1"
                    style={{
                        backgroundColor: 'rgba(203, 213, 225, 0.12)',
                    }}
                >
                    <Text
                        className="text-[14px] font-medium text-center"
                        style={{ color: '#64748B', letterSpacing: -0.1 }}
                        accessibilityRole="header"
                    >
                        {title}
                    </Text>
                </View>
                <View
                    className="flex-1 h-px"
                    style={{ backgroundColor: 'rgba(203, 213, 225, 0.92)' }}
                />
            </View>

            {/* Jump Here badge (conditional from config) */}
            {showJumpHere && (
                <JumpHereBadge accentColor={accentColor} onPress={onJumpPress} />
            )}
        </View>
    );
}

export default React.memo(UnitDivider);
