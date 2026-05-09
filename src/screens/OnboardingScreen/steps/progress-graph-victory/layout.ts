import { CHART_DOMAIN, COLORS, HAPPY_END_POINT } from "./constants";
import type { ScaledLayout } from "./types";

interface ScaledLayoutParams {
    scale: number;
    cardWidth: number;
    cardHeight: number;
    chartHeight: number;
    isCompact: boolean;
}

export const getScaledLayout = (
    {
        scale,
        cardWidth,
        cardHeight,
        chartHeight,
        isCompact,
    }: ScaledLayoutParams,
): ScaledLayout => {
    const chartContainerLeft = 28 * scale;
    const chartContainerRight = (isCompact ? 18 : 22) * scale;
    const chartContainerTop = (isCompact ? 44 : 52) * scale;
    const chartPaddingLeft = 14 * scale;
    const chartPaddingRight = (isCompact ? 12 : 16) * scale;
    const chartPaddingTop = 6 * scale;
    const chartPaddingBottom = 20 * scale;
    const chartWidth = cardWidth - chartContainerLeft - chartContainerRight;
    const plotWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
    const plotHeight = chartHeight - chartPaddingTop - chartPaddingBottom;
    const happyEndX =
        chartContainerLeft +
        chartPaddingLeft +
        (HAPPY_END_POINT.x / CHART_DOMAIN.x) * plotWidth;
    const happyEndY =
        chartContainerTop +
        chartPaddingTop +
        (1 - HAPPY_END_POINT.y / CHART_DOMAIN.y) * plotHeight;

    return {
        screenStyle: {
            paddingHorizontal: isCompact ? 12 : 16,
            paddingTop: isCompact ? 16 : 24,
        },
        headerStyle: {
            gap: isCompact ? 8 : 12,
            marginBottom: isCompact ? 18 : 24,
        },
        titleStyle: {
            fontSize: isCompact ? 26 : 30,
            lineHeight: isCompact ? 32 : 36,
        },
        subtitleStyle: {
            fontSize: isCompact ? 13 : 14,
            lineHeight: isCompact ? 18 : 20,
            paddingHorizontal: isCompact ? 8 : 20,
        },
        stagePaddingVertical: (isCompact ? 8 : 14) * scale,
        shellWidth: cardWidth + (isCompact ? 30 : 40) * scale,
        shellHeight: cardHeight + (isCompact ? 34 : 44) * scale,
        outerGlowRadius: (isCompact ? 38 : 44) * scale,
        underlayStyle: {
            width: cardWidth + (isCompact ? 10 : 14) * scale,
            height: cardHeight + (isCompact ? 14 : 18) * scale,
            borderRadius: (isCompact ? 36 : 42) * scale,
            borderCurve: "continuous",
        },
        cardStyle: {
            width: cardWidth,
            height: cardHeight,
            borderRadius: (isCompact ? 30 : 34) * scale,
            borderCurve: "continuous",
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.16,
            shadowRadius: 28,
            elevation: 8,
        },
        primaryLabelStyle: {
            left: 24 * scale,
            top: (isCompact ? 60 : 68) * scale,
            maxWidth: cardWidth * 0.38,
            fontSize: (isCompact ? 15.5 : 16.5) * scale,
            lineHeight: (isCompact ? 18 : 20) * scale,
            letterSpacing: -0.3,
        },
        comparisonLabelStyle: {
            right: (isCompact ? 28 : 38) * scale,
            top: (isCompact ? 28 : 34) * scale,
            maxWidth: cardWidth * (isCompact ? 0.44 : 0.42),
            fontSize: (isCompact ? 14 : 15.5) * scale,
            lineHeight: (isCompact ? 16 : 18) * scale,
            letterSpacing: -0.2,
            textAlign: "right",
        },
        chartContainerStyle: {
            left: chartContainerLeft,
            right: chartContainerRight,
            top: chartContainerTop,
            height: chartHeight,
        },
        axisVerticalStyle: {
            left: 14 * scale,
            bottom: 20 * scale,
            width: 1.4,
            height: (isCompact ? 116 : 126) * scale,
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
            left: chartPaddingLeft,
            right: chartPaddingRight,
            top: chartPaddingTop,
            bottom: chartPaddingBottom,
        },
        timeLabelStyle: {
            left: 52 * scale,
            bottom: 30 * scale,
            fontSize: (isCompact ? 12.5 : 13.5) * scale,
        },
        badgeWrapperStyle: {
            left: happyEndX - 58 * scale,
            top: happyEndY - 58 * scale,
        },
        badgeTailStyle: {
            right: 24 * scale,
            bottom: -7 * scale,
            width: 18 * scale,
            height: 18 * scale,
            borderRadius: 4 * scale,
        },
        badgeBubbleStyle: {
            borderRadius: (isCompact ? 16 : 18) * scale,
            borderCurve: "continuous",
            shadowColor: COLORS.happy,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 6,
        },
        badgeTextStyle: {
            fontSize: (isCompact ? 14 : 15) * scale,
            letterSpacing: -0.2,
        },
    };
};
