/**
 * JourneyMapHeader (P1.5.4)
 *
 * Sticky header above the scrollable journey map.
 * Contains: back button, journey title, progress (X/N nodes),
 * StreakBanner (compact), XPCounter (compact).
 * Thin progress bar under the header, colored by journey theme.
 *
 * Pure presentational — all data via props.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import { StreakBanner } from './StreakBanner';
import { XPCounter } from './XPCounter';
import type { XPGain } from './XPCounter';

// ============================================================================
// Types
// ============================================================================

export interface JourneyMapHeaderProps {
    /** Journey title */
    title: string;
    /** Total nodes in the journey */
    totalNodes: number;
    /** Completed nodes */
    completedNodes: number;
    /** Current streak days */
    streakDays: number;
    /** Streak freezes available */
    streakFreezes: number;
    /** Whether streak is at risk */
    streakAtRisk: boolean;
    /** Total Insight Points */
    totalIP: number;
    /** Recent IP gains for flyover animations */
    recentGains: XPGain[];
    /** Theme color for the progress bar (hex) */
    themeColor: string;
    /** Called when back button is pressed */
    onBack: () => void;
    /** Called when streak banner is tapped */
    onStreakPress?: () => void;
    /** Called when XP counter is tapped */
    onXPPress?: () => void;
    /** Called when a gain flyover completes */
    onGainDismissed?: (id: string) => void;
}

// ============================================================================
// Component
// ============================================================================

function JourneyMapHeaderInner({
    title,
    totalNodes,
    completedNodes,
    streakDays,
    streakFreezes,
    streakAtRisk,
    totalIP,
    recentGains,
    themeColor,
    onBack,
    onStreakPress,
    onXPPress,
    onGainDismissed,
}: JourneyMapHeaderProps): React.JSX.Element {
    const progressFraction: number = totalNodes > 0 ? completedNodes / totalNodes : 0;
    const progressPercent: number = Math.round(progressFraction * 100);

    return (
        <SafeAreaView className="bg-white border-b border-slate-100" edges={['top']}>
            {/* Main row */}
            <View className="flex-row items-center px-4 py-2 gap-2">
                {/* Back button */}
                <Pressable
                    onPress={onBack}
                    className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center"
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color="#64748B" />
                </Pressable>

                {/* Title + progress */}
                <View className="flex-1 ml-1">
                    <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className="text-xs text-slate-400">
                        {completedNodes}/{totalNodes} completed
                    </Text>
                </View>

                {/* Streak (compact) */}
                <StreakBanner
                    currentStreak={streakDays}
                    freezesAvailable={streakFreezes}
                    isAtRisk={streakAtRisk}
                    compact
                    onPress={onStreakPress}
                />

                {/* XP (compact) */}
                <XPCounter
                    totalIP={totalIP}
                    recentGains={recentGains}
                    onGainDismissed={onGainDismissed}
                    onPress={onXPPress}
                    compact
                />
            </View>

            {/* Thin progress bar */}
            <View className="h-1 bg-slate-100">
                <View
                    style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: themeColor,
                        borderTopRightRadius: 2,
                        borderBottomRightRadius: 2,
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

export const JourneyMapHeader = React.memo(JourneyMapHeaderInner);
export default JourneyMapHeader;
