/**
 * StickyUnitHeader (Task 7 + Task 19 redesign)
 * Config-driven sticky header matching the Duolingo reference:
 *
 * ┌─────────────────────────────────────────────┐
 * │  🇩🇪 5    💧 0    💎 500    ⚡ 25           │  ← stats row (dark bg)
 * │                                             │
 * │  ┌─────────────────────────────┬──────┐     │
 * │  │ SECTION 1, UNIT 1           │  📋  │     │  ← green rounded card
 * │  │ Order in a cafe             │      │     │
 * │  └─────────────────────────────┴──────┘     │
 * └─────────────────────────────────────────────┘
 *
 * Colors resolved entirely from JourneyConfig via useColorTheme().
 */

import React from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import type { JourneyStats } from "@/src/types/journey/state";
import {
    useColorTheme,
    useJourneyConfig,
} from "@/src/context/JourneyConfigContext";
import type { ColorThemeConfig } from "@/src/types/journey";
import Animated, {
    useAnimatedStyle,
    interpolateColor,
    SharedValue,
} from "react-native-reanimated";

export interface UnitHeaderBreakpoint {
    yOffset: number;
    colorThemeKey: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    /** Callback when flag icon is pressed (opens journey switcher) */
    onFlagPress?: () => void;
    /** Scroll position for color interpolation */
    scrollY?: SharedValue<number>;
    /** Breakpoints for calculating color transition points */
    unitBreakpoints?: UnitHeaderBreakpoint[];
}

// ---------------------------------------------------------------------------
// StatBadge — icon + value pill matching Duolingo reference
// ---------------------------------------------------------------------------

interface StatBadgeProps {
    /** Emoji or icon string */
    icon: string;
    /** Numeric value */
    value: number;
    /** Accessibility label */
    label: string;
    /** Icon background color */
    iconBgColor: string;
    /** Value text color */
    valueColor: string;
}

function StatBadge({
    icon,
    value,
    label,
    iconBgColor,
    valueColor,
}: StatBadgeProps): React.JSX.Element {
    return (
        <View
            className="flex-row items-center gap-1.5"
            accessibilityRole="text"
            accessibilityLabel={`${label}: ${value}`}
        >
            <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: iconBgColor }}
            >
                <Text
                    className="text-sm"
                    importantForAccessibility="no"
                >
                    {icon}
                </Text>
            </View>
            <Text
                className="text-base font-extrabold"
                style={{ color: valueColor }}
            >
                {value}
            </Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// StickyUnitHeader — matches Duolingo reference image exactly
// ---------------------------------------------------------------------------

function StickyUnitHeader({
    sectionNumber,
    unitNumber,
    unitTitle,
    colorThemeKey,
    stats,
    onGuidePress,
    onFlagPress,
    scrollY,
    unitBreakpoints,
}: StickyUnitHeaderProps): React.JSX.Element {
    const theme: ColorThemeConfig = useColorTheme(colorThemeKey);
    const config = useJourneyConfig();

    // Compute interpolation ranges based on all units
    const { inputRange, outputBackgrounds, outputShadows } = React.useMemo(() => {
        if (!unitBreakpoints || unitBreakpoints.length === 0) {
            return {
                inputRange: [0],
                outputBackgrounds: [theme.headerGradient[0]],
                outputShadows: [theme.headerGradient[1]],
            };
        }

        const ranges: number[] = [];
        const bgs: string[] = [];
        const shadows: string[] = [];

        unitBreakpoints.forEach((bp) => {
            const y = bp.yOffset;
            const unitTheme = config.colorThemes[bp.colorThemeKey];
            const bg = unitTheme.headerGradient[0];
            const shadow = unitTheme.headerGradient[1];

            // Transition happens quickly when UnitDivider text (yOffset - 170) hits the header
            const transitionY = Math.max(0, y - 170);

            if (ranges.length === 0 || transitionY > ranges[ranges.length - 1]) {
                if (ranges.length > 0) {
                    // Make it a fast transition (sharp) over 5 pixels
                    ranges.push(transitionY - 5);
                    bgs.push(bgs[bgs.length - 1]);
                    shadows.push(shadows[shadows.length - 1]);
                }
                ranges.push(transitionY);
                bgs.push(bg);
                shadows.push(shadow);
            }
        });

        // Ensure we always have at least two points for interpolation
        if (ranges.length === 1) {
            ranges.push(ranges[0] + 1);
            bgs.push(bgs[0]);
            shadows.push(shadows[0]);
        }

        return {
            inputRange: ranges,
            outputBackgrounds: bgs,
            outputShadows: shadows,
        };
    }, [unitBreakpoints, config, theme]);

    const animatedStyle = useAnimatedStyle(() => {
        if (!scrollY) return {};

        return {
            backgroundColor: interpolateColor(
                scrollY.value,
                inputRange,
                outputBackgrounds,
            ),
            shadowColor: interpolateColor(scrollY.value, inputRange, outputShadows),
        };
    }, [scrollY, inputRange, outputBackgrounds, outputShadows]);

    return (
        <View className="w-full">
            <SafeAreaView edges={["top"]}>
                {/* ── Stats row ── */}
                <View
                    className="flex-row items-center justify-between px-5 py-2.5"
                    accessibilityRole="summary"
                    accessibilityLabel={`Stats: ${stats.streakDays} day streak, ${stats.wallet.gems} gems, ${stats.totalXP} XP`}
                >
                    {/* Flag — opens journey switcher */}
                    <Pressable
                        onPress={onFlagPress}
                        className="flex-row items-center gap-1.5"
                        accessibilityRole="button"
                        accessibilityLabel="Switch journey"
                        accessibilityHint="Opens the journey switcher"
                    >
                        <Text className="text-xl">�️</Text>
                        <Text
                            className="text-base font-extrabold"
                            style={{ color: "#4A5568" }}
                        >
                            {stats.streakDays}
                        </Text>
                    </Pressable>

                    {/* Stats badges */}
                    <StatBadge
                        icon="💧"
                        value={0}
                        label="Streak freeze"
                        iconBgColor="#E0F2FE"
                        valueColor="#718096"
                    />
                    <StatBadge
                        icon="💎"
                        value={stats.wallet.gems}
                        label="Gems"
                        iconBgColor="#DBEAFE"
                        valueColor="#1CB0F6"
                    />
                    <StatBadge
                        icon="⚡"
                        value={stats.totalXP}
                        label="XP"
                        iconBgColor="#FDE8EF"
                        valueColor="#FF86D0"
                    />
                </View>

                {/* ── Section / Unit card ── */}
                <AnimatedPressable
                    onPress={onGuidePress}
                    className="mx-4 rounded-2xl overflow-hidden flex-row"
                    style={[
                        {
                            backgroundColor: theme.headerGradient[0],
                            shadowColor: theme.headerGradient[1],
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 6,
                        },
                        animatedStyle,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Section ${sectionNumber}, Unit ${unitNumber}: ${unitTitle}. Tap to open section overview.`}
                >
                    {/* Left: section + unit label */}
                    <View className="flex-1 py-3.5 pl-5 pr-3 justify-center">
                        <Text
                            className="text-xs font-bold uppercase tracking-widest mb-0.5"
                            style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                            {`SECTION ${sectionNumber}, UNIT ${unitNumber}`}
                        </Text>
                        <Text
                            className="text-lg font-extrabold"
                            style={{ color: "#FFFFFF" }}
                        >
                            {unitTitle}
                        </Text>
                    </View>

                    {/* Vertical separator */}
                    <View
                        className="w-px my-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                    />

                    {/* Right: guide-book icon */}
                    <View className="w-14 items-center justify-center">
                        <Text
                            className="text-xl"
                            importantForAccessibility="no"
                        >
                            📋
                        </Text>
                    </View>
                </AnimatedPressable>
            </SafeAreaView>
        </View>
    );
}

export default React.memo(StickyUnitHeader);
