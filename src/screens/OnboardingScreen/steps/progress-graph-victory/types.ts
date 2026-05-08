import type { TextStyle, ViewStyle } from "react-native";

export type StressProjectionDatum = {
    x: number;
    happy: number;
    other: number;
};

export type ChartPoint = {
    x: number;
    y: number | null | undefined;
};

export type ChartSeriesPoints = {
    happy: ChartPoint[];
    other: ChartPoint[];
};

export type ChartRenderProps = {
    points: ChartSeriesPoints;
};

export type AnimatedScalar = {
    value: number;
};

export type ScaledLayout = {
    screenStyle: ViewStyle;
    headerStyle: ViewStyle;
    titleStyle: TextStyle;
    subtitleStyle: TextStyle;
    stagePaddingVertical: number;
    shellWidth: number;
    shellHeight: number;
    outerGlowRadius: number;
    underlayStyle: ViewStyle;
    cardStyle: ViewStyle;
    primaryLabelStyle: TextStyle;
    comparisonLabelStyle: TextStyle;
    chartContainerStyle: ViewStyle;
    axisVerticalStyle: ViewStyle;
    axisHorizontalStyle: ViewStyle;
    chartPadding: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    timeLabelStyle: TextStyle;
    badgeWrapperStyle: ViewStyle;
    badgeTailStyle: ViewStyle;
    badgeBubbleStyle: ViewStyle;
    badgeTextStyle: TextStyle;
};

export interface ProgressGraphVictoryStepProps {
    primaryLabel?: string;
    comparisonLabel?: string;
    productLabel?: string;
}
