/**
 * DailyPracticeBonusNode (P1.4.6)
 *
 * Special "Daily Practice" node injected at the top of the journey map.
 * - Content: rotating exercise from completed sections
 * - Replayable — can be completed once per day
 * - Bonus XP: +15 IP
 * - Distinct visual: sparkle icon, different color than regular nodes
 *
 * Pure presentational — all data and actions via props.
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';

import { PressableScale } from '@/src/components/ui/PressableScale';

// ============================================================================
// Types
// ============================================================================

export interface DailyPracticeBonusNodeProps {
    /** Title of today's exercise (e.g., "Today: Try Box Breathing") */
    exerciseTitle: string;
    /** Whether this has already been completed today */
    completedToday: boolean;
    /** XP reward amount */
    xpReward: number;
    /** Called when user taps the bonus node */
    onPress: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const SPARKLE_DURATION: number = 2000;

// ============================================================================
// Component
// ============================================================================

function DailyPracticeBonusNodeInner({
    exerciseTitle,
    completedToday,
    xpReward,
    onPress,
}: DailyPracticeBonusNodeProps): React.JSX.Element {
    const sparkleRotate = useSharedValue<number>(0);
    const glowScale = useSharedValue<number>(1);

    // Sparkle animation (only when not completed)
    useEffect(() => {
        if (!completedToday) {
            sparkleRotate.value = withRepeat(
                withTiming(360, { duration: 4000, easing: Easing.linear }),
                -1,
                false,
            );
            glowScale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: SPARKLE_DURATION / 2 }),
                    withTiming(1, { duration: SPARKLE_DURATION / 2 }),
                ),
                -1,
                true,
            );
        }
    }, [completedToday, sparkleRotate, glowScale]);

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
    }));

    return (
        <View className="w-full items-center py-3">
            <PressableScale
                onPress={onPress}
                scale={0.95}
                hapticStyle="light"
                disabled={completedToday}
                style={{ alignItems: 'center', opacity: completedToday ? 0.6 : 1 }}
                accessibilityLabel={
                    completedToday
                        ? 'Daily practice completed'
                        : `Daily practice: ${exerciseTitle}. Tap to start.`
                }
                accessibilityRole="button"
                accessibilityState={{ disabled: completedToday }}
            >
                {/* Glow ring (animated) */}
                {!completedToday ? (
                    <Animated.View
                        style={[glowStyle, { position: 'absolute', width: 80, height: 80, borderRadius: 40 }]}
                        className="bg-amber-100"
                        pointerEvents="none"
                    />
                ) : null}

                {/* Node circle */}
                <View
                    className={`w-16 h-16 rounded-full items-center justify-center border-2 ${completedToday
                            ? 'bg-green-100 border-green-300'
                            : 'bg-amber-50 border-amber-300'
                        }`}
                >
                    <Text style={{ fontSize: 28 }}>
                        {completedToday ? '✅' : '✨'}
                    </Text>
                </View>

                {/* Label */}
                <Text
                    className={`text-xs font-bold mt-2 text-center ${completedToday ? 'text-green-600' : 'text-amber-700'
                        }`}
                >
                    {completedToday ? 'Done for Today!' : 'Daily Practice'}
                </Text>

                {/* Exercise title */}
                <Text
                    className="text-xs text-slate-500 mt-0.5 text-center px-4"
                    numberOfLines={1}
                >
                    {exerciseTitle}
                </Text>

                {/* XP badge */}
                {!completedToday ? (
                    <View className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mt-2">
                        <Text className="text-xs font-bold text-amber-600">
                            +{xpReward} IP
                        </Text>
                    </View>
                ) : null}
            </PressableScale>
        </View>
    );
}

export const DailyPracticeBonusNode = React.memo(DailyPracticeBonusNodeInner);
export default DailyPracticeBonusNode;
