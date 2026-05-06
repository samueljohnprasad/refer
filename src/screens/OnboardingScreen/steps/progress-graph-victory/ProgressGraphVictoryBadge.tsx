import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { progressGraphVictoryStyles as styles } from "./styles";
import type { ScaledLayout } from "./types";
import type { ProgressGraphVictoryAnimationState } from "./useProgressGraphVictoryAnimation";

interface ProgressGraphVictoryBadgeProps {
    animatedStyle: ProgressGraphVictoryAnimationState["labelAnimatedStyle"];
    label: string;
    layout: ScaledLayout;
}

const ProgressGraphVictoryBadge: React.FC<ProgressGraphVictoryBadgeProps> = ({
    animatedStyle,
    label,
    layout,
}) => (
    <Animated.View
        style={[styles.badgeWrapper, layout.badgeWrapperStyle, animatedStyle]}
    >
        <View style={styles.badgeAnchor}>
            <View style={[styles.badgeTail, layout.badgeTailStyle]} />
            <View style={[styles.badgeBubble, layout.badgeBubbleStyle]}>
                <Text style={[styles.badgeText, layout.badgeTextStyle]}>{label}</Text>
            </View>
        </View>
    </Animated.View>
);

export default ProgressGraphVictoryBadge;
