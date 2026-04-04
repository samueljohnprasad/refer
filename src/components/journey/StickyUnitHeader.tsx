/**
 * StickyUnitHeader (Task 7)
 * Config-driven sticky header that replaces JourneyHeader.
 *
 * Matches Duolingo reference (Images 1, 3, 4):
 * - Gradient background from ColorThemeConfig (no hardcoded hex)
 * - "SECTION {N}, UNIT {M}" label + unit title
 * - Guide-book button to open section overview
 * - Stats row (streak, gems, hearts)
 * - Sticks to top of scroll view
 *
 * Colors resolved entirely from JourneyConfig via useColorTheme().
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import type { JourneyStats } from '@/src/types/journey/state';
import { useColorTheme } from '@/src/context/JourneyConfigContext';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StickyUnitHeaderProps {
    /** Section number for the label */
    sectionNumber: number;
    /** Unit number for the label */
    unitNumber: number;
    /** Unit title (e.g. "Order in a cafe") */
    unitTitle: string;
    /** Color theme key to resolve gradient colors */
    colorThemeKey: string;
    /** User stats (streak, gems, hearts) */
    stats: JourneyStats;
    /** Callback when guide-book button is pressed */
    onGuidePress?: () => void;
}

// ---------------------------------------------------------------------------
// StatBadge sub-component
// ---------------------------------------------------------------------------

interface StatBadgeProps {
    icon: string;
    value: number;
    label: string;
}

function StatBadge({ icon, value, label }: StatBadgeProps): React.JSX.Element {
    return (
        <View
            className="flex-row items-center gap-1"
            accessibilityRole="text"
            accessibilityLabel={`${label}: ${value}`}
        >
            <Text className="text-base" importantForAccessibility="no">
                {icon}
            </Text>
            <Text className="text-sm font-extrabold text-white">{value}</Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// StickyUnitHeader
// ---------------------------------------------------------------------------

function StickyUnitHeader({
    sectionNumber,
    unitNumber,
    unitTitle,
    colorThemeKey,
    stats,
    onGuidePress,
}: StickyUnitHeaderProps): React.JSX.Element {
    const theme = useColorTheme(colorThemeKey);

    return (
        <LinearGradient
            colors={[...theme.headerGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full px-5 pt-2 pb-5"
        >
            <SafeAreaView edges={['top']}>
                {/* Stats row */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg">🇫🇷</Text>
                    <View
                        className="flex-row items-center gap-4"
                        accessibilityRole="summary"
                        accessibilityLabel={`Stats: ${stats.streakDays} day streak, ${stats.wallet.gems} gems, ${stats.hearts} hearts`}
                    >
                        <StatBadge icon="🔥" value={stats.streakDays} label="Day streak" />
                        <StatBadge icon="💎" value={stats.wallet.gems} label="Gems" />
                        <StatBadge icon="❤️" value={stats.hearts} label="Hearts" />
                    </View>
                </View>

                {/* Section + Unit info */}
                <View
                    className="flex-row items-center justify-between"
                    accessibilityRole="header"
                    accessibilityLabel={`Section ${sectionNumber}, Unit ${unitNumber}: ${unitTitle}`}
                >
                    <View className="flex-1">
                        <Text
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.headerTextColor, opacity: 0.8 }}
                        >
                            {`SECTION ${sectionNumber}, UNIT ${unitNumber}`}
                        </Text>
                        <Text
                            className="text-xl font-extrabold"
                            style={{ color: theme.headerTextColor }}
                        >
                            {unitTitle}
                        </Text>
                    </View>
                    <Pressable
                        onPress={onGuidePress}
                        className="h-10 w-10 rounded-lg items-center justify-center ml-3"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                        accessibilityRole="button"
                        accessibilityLabel="Open section overview"
                    >
                        <Text className="text-lg" importantForAccessibility="no">
                            📋
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

export default React.memo(StickyUnitHeader);
