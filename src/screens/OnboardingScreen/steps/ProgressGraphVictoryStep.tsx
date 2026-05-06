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
    primaryLabel = "Your weight",
    comparisonLabel = "Other apps",
    productLabel = "Happy",
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const cardWidth = Math.min(screenWidth - 40, 352);
    const cardHeight = cardWidth * 0.9;
    const scale = cardWidth / 320;
    const chartHeight = cardHeight * 0.72;
    const layout = getScaledLayout(scale, cardWidth, cardHeight, chartHeight);
    const animationState = useProgressGraphVictoryAnimation();

    return (
        <View style={styles.screen}>
            <Animated.View entering={FadeInUp.duration(560).springify()} style={styles.header}>
                <Text style={styles.title}>See your progress unfold</Text>
                <Text style={styles.subtitle}>
                    Happy helps you spot emotional patterns at a glance, not just
                    collect entries.
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

                        <Text style={[styles.timeLabel, layout.timeLabelStyle]}>Time</Text>

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
