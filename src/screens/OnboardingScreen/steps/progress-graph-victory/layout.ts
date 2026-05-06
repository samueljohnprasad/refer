import { COLORS } from "./constants";
import type { ScaledLayout } from "./types";

export const getScaledLayout = (
    scale: number,
    cardWidth: number,
    cardHeight: number,
    chartHeight: number,
): ScaledLayout => ({
    stagePaddingVertical: 14 * scale,
    shellWidth: cardWidth + 40 * scale,
    shellHeight: cardHeight + 44 * scale,
    outerGlowRadius: 44 * scale,
    underlayStyle: {
        width: cardWidth + 14 * scale,
        height: cardHeight + 18 * scale,
        borderRadius: 42 * scale,
        borderCurve: "continuous",
    },
    cardStyle: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: 34 * scale,
        borderCurve: "continuous",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.16,
        shadowRadius: 28,
        elevation: 8,
    },
    primaryLabelStyle: {
        left: 28 * scale,
        top: 68 * scale,
        fontSize: 16.5 * scale,
        letterSpacing: -0.3,
    },
    comparisonLabelStyle: {
        right: 38 * scale,
        top: 34 * scale,
        fontSize: 15.5 * scale,
        letterSpacing: -0.2,
    },
    chartContainerStyle: {
        left: 32 * scale,
        right: 22 * scale,
        top: 52 * scale,
        height: chartHeight,
    },
    axisVerticalStyle: {
        left: 14 * scale,
        bottom: 20 * scale,
        width: 1.4,
        height: 126 * scale,
        backgroundColor: COLORS.axis,
    },
    axisHorizontalStyle: {
        left: 14 * scale,
        right: 10 * scale,
        bottom: 20 * scale,
        height: 1.4,
        backgroundColor: COLORS.axis,
    },
    chartPadding: {
        left: 14 * scale,
        right: 16 * scale,
        top: 6 * scale,
        bottom: 20 * scale,
    },
    timeLabelStyle: {
        left: 58 * scale,
        bottom: 30 * scale,
        fontSize: 13.5 * scale,
    },
    badgeWrapperStyle: {
        right: 24 * scale,
        bottom: 92 * scale,
    },
    badgeTailStyle: {
        right: 24 * scale,
        bottom: -7 * scale,
        width: 18 * scale,
        height: 18 * scale,
        borderRadius: 4 * scale,
    },
    badgeBubbleStyle: {
        borderRadius: 18 * scale,
        borderCurve: "continuous",
        shadowColor: COLORS.happy,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 6,
    },
    badgeTextStyle: {
        fontSize: 15 * scale,
        letterSpacing: -0.2,
    },
});
