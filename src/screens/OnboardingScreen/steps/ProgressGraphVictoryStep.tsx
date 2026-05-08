import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { OUTER_GRADIENT_COLORS } from "./progress-graph-victory/constants";
import { getScaledLayout } from "./progress-graph-victory/layout";
import ProgressGraphVictoryBadge from "./progress-graph-victory/ProgressGraphVictoryBadge";
import ProgressGraphVictoryChart from "./progress-graph-victory/ProgressGraphVictoryChart";
import { progressGraphVictoryStyles as styles } from "./progress-graph-victory/styles";
import type { ProgressGraphVictoryStepProps } from "./progress-graph-victory/types";
import { useProgressGraphVictoryAnimation } from "./progress-graph-victory/useProgressGraphVictoryAnimation";

const ProgressGraphVictoryStep: React.FC<ProgressGraphVictoryStepProps> = ({
    primaryLabel = "Your mood",
    comparisonLabel = "Without journaling",
    productLabel = "Happy",
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isCompactScreen = screenWidth < 390 || screenHeight < 880;
    const horizontalPadding = isCompactScreen ? 12 : 16;
    const maxCardWidth = isCompactScreen ? 332 : 352;
    const cardWidth = Math.max(
        Math.min(screenWidth - horizontalPadding * 2 - 8, maxCardWidth),
        288,
    );
    const cardHeight = cardWidth * (isCompactScreen ? 0.87 : 0.9);
    const scale = cardWidth / 320;
    const chartHeight = cardHeight * (isCompactScreen ? 0.68 : 0.72);
    const layout = getScaledLayout({
        scale,
        cardWidth,
        cardHeight,
        chartHeight,
        isCompact: isCompactScreen,
    });
    const animationState = useProgressGraphVictoryAnimation();

    return (
        <View style={[styles.screen, layout.screenStyle]}>
            <Animated.View
                entering={FadeInUp.duration(560).springify()}
                style={[styles.header, layout.headerStyle]}
            >
                <Text style={[styles.title, layout.titleStyle]}>See your journaling impact</Text>
                <Text style={[styles.subtitle, layout.subtitleStyle]}>
                    Watch how consistent journaling can steady your emotions over
                    time, instead of letting tough days pile up unnoticed.
                </Text>
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(420).delay(180)}
                style={[styles.cardStage, { paddingVertical: layout.stagePaddingVertical }]}
            >
                <View
                    style={[
                        styles.cardShell,
                        {
                            width: layout.shellWidth,
                            height: layout.shellHeight,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={OUTER_GRADIENT_COLORS}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.absoluteFill,
                            {
                                borderRadius: layout.outerGlowRadius,
                                opacity: 0.96,
                            },
                        ]}
                    />

                    <View style={[styles.cardUnderlay, layout.underlayStyle]} />

                    <View style={[styles.card, layout.cardStyle]}>
                        <Text style={[styles.primaryLabel, layout.primaryLabelStyle]}>
                            {primaryLabel}
                        </Text>

                        <Text style={[styles.comparisonLabel, layout.comparisonLabelStyle]}>
                            {comparisonLabel}
                        </Text>

                        <ProgressGraphVictoryChart
                            comparisonDashOpacity={animationState.comparisonDashOpacity}
                            comparisonDotOpacity={animationState.comparisonDotOpacity}
                            comparisonProjectionEnd={animationState.comparisonProjectionEnd}
                            endDotOpacity={animationState.endDotOpacity}
                            happyProjectionEnd={animationState.happyProjectionEnd}
                            layout={layout}
                            startDotOpacity={animationState.startDotOpacity}
                        />

                        <Text style={[styles.timeLabel, layout.timeLabelStyle]}>Journal entries</Text>

                        <ProgressGraphVictoryBadge
                            animatedStyle={animationState.labelAnimatedStyle}
                            label={productLabel}
                            layout={layout}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default React.memo(ProgressGraphVictoryStep);
