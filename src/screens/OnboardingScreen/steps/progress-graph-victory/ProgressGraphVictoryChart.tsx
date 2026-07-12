import React from "react";
import { View } from "react-native";
import { Circle, DashPathEffect } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native-v4";
import {
    CHART_DOMAIN,
    CHART_DATA,
    CHART_Y_KEYS,
    COLORS,
    CURVE_TYPE,
    DASH_INTERVALS,
    MARKER_RADII,
} from "./constants";
import { progressGraphVictoryStyles as styles } from "./styles";
import type { AnimatedScalar, ChartPoint, ChartRenderProps, ScaledLayout } from "./types";

const VictoryCartesianChart = CartesianChart as unknown as React.ComponentType<any>;
const VictoryLine = Line as unknown as React.ComponentType<any>;

interface ProgressGraphVictoryChartProps {
    comparisonDashOpacity: AnimatedScalar;
    comparisonDotOpacity: AnimatedScalar;
    comparisonProjectionEnd: AnimatedScalar;
    endDotOpacity: AnimatedScalar;
    happyProjectionEnd: AnimatedScalar;
    layout: ScaledLayout;
    startDotOpacity: AnimatedScalar;
}

const renderRingMarker = ({
    point,
    outerColor,
    outerRadius,
    innerColor,
    innerRadius,
    opacity,
}: {
    point: ChartPoint | undefined;
    outerColor: string;
    outerRadius: number;
    innerColor?: string;
    innerRadius?: number;
    opacity: AnimatedScalar;
}): React.ReactNode => {
    if (!point || point.y == null) {
        return null;
    }

    return (
        <>
            <Circle
                cx={point.x}
                cy={point.y}
                r={outerRadius}
                color={outerColor}
                opacity={opacity}
            />
            {innerColor && innerRadius ? (
                <Circle
                    cx={point.x}
                    cy={point.y}
                    r={innerRadius}
                    color={innerColor}
                    opacity={opacity}
                />
            ) : null}
        </>
    );
};

const ProgressGraphVictoryChart: React.FC<ProgressGraphVictoryChartProps> = ({
    comparisonDashOpacity,
    comparisonDotOpacity,
    comparisonProjectionEnd,
    endDotOpacity,
    happyProjectionEnd,
    layout,
    startDotOpacity,
}) => {
    const renderOutsideDots = ({ points }: ChartRenderProps): React.ReactNode => {
        const happyStart = points.happy[0];
        const happyEnd = points.happy[points.happy.length - 1];
        const otherEnd = points.other[points.other.length - 1];

        return (
            <>
                {renderRingMarker({
                    point: happyStart,
                    outerColor: COLORS.happy,
                    outerRadius: MARKER_RADII.greenOuter,
                    innerColor: COLORS.white,
                    innerRadius: MARKER_RADII.greenInner,
                    opacity: startDotOpacity,
                })}
                {renderRingMarker({
                    point: happyEnd,
                    outerColor: COLORS.happy,
                    outerRadius: MARKER_RADII.greenOuter,
                    innerColor: COLORS.white,
                    innerRadius: MARKER_RADII.greenInner,
                    opacity: endDotOpacity,
                })}
                {renderRingMarker({
                    point: otherEnd,
                    outerColor: COLORS.comparison,
                    outerRadius: MARKER_RADII.comparison,
                    opacity: comparisonDotOpacity,
                })}
            </>
        );
    };

    const renderChartLines = ({ points }: ChartRenderProps): React.ReactNode => (
        <>
            <VictoryLine
                points={points.other}
                color={COLORS.comparison}
                strokeWidth={4.6}
                curveType={CURVE_TYPE}
                end={comparisonProjectionEnd}
                opacity={COLORS.comparisonGhost}
                strokeCap="round"
                strokeJoin="round"
            />

            <VictoryLine
                points={points.other}
                color={COLORS.comparison}
                strokeWidth={4.6}
                curveType={CURVE_TYPE}
                end={comparisonProjectionEnd}
                opacity={comparisonDashOpacity}
                strokeCap="round"
                strokeJoin="round"
            >
                <DashPathEffect intervals={DASH_INTERVALS} />
            </VictoryLine>

            <VictoryLine
                points={points.happy}
                color={COLORS.happy}
                strokeWidth={7}
                curveType={CURVE_TYPE}
                end={happyProjectionEnd}
                strokeCap="round"
                strokeJoin="round"
            />
        </>
    );

    return (
        <View
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Projected 30-day clarity growth chart comparing progress with Happy versus without journaling"
            style={[styles.chartContainer, layout.chartContainerStyle]}
        >
            <View style={[styles.axisVertical, layout.axisVerticalStyle]} />
            <View style={[styles.axisHorizontal, layout.axisHorizontalStyle]} />

            <VictoryCartesianChart
                data={CHART_DATA}
                xKey="x"
                yKeys={CHART_Y_KEYS}
                domain={{ x: [0, CHART_DOMAIN.x], y: [0, CHART_DOMAIN.y] }}
                padding={layout.chartPadding}
                axisOptions={{
                    lineColor: "transparent",
                    labelColor: "transparent",
                    tickCount: { x: 0, y: 0 },
                    labelOffset: { x: 0, y: 0 },
                }}
                frame={{ lineWidth: 0, lineColor: "transparent" }}
                renderOutside={renderOutsideDots}
            >
                {renderChartLines}
            </VictoryCartesianChart>
        </View>
    );
};

export default ProgressGraphVictoryChart;
