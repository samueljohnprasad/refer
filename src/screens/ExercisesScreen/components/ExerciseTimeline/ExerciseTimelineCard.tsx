/**
 * ExerciseTimelineCard
 *
 * Premium card rendered for each exercise in the timeline.
 *
 * Layout:
 *  ┌──────────────────────────────┐
 *  │  Title (Nunito-Bold 14)      │
 *  │  Category (Nunito-Semi 12)   │
 *  │  [ShiftBadge] (conditional)  │
 *  └──────────────────────────────┘
 *
 * - Multi-layer subtle shadow (no hard borders)
 * - Spring press animation (0.97 scale)
 * - Only shows ShiftBadge when both ratings are present
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { format } from "date-fns";
import { SAGE, INK_MUTED } from "@/lib/tokens";
import { ShiftBadge } from "./ShiftBadge";
import type { ExerciseTimelineItem } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseTimelineCardProps {
  readonly item: ExerciseTimelineItem;
}

const ExerciseTimelineCard: React.FC<ExerciseTimelineCardProps> = React.memo(
  ({ item }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, [scale]);

    const hasShift: boolean =
      item.beforeRating !== undefined &&
      item.afterRating !== undefined &&
      item.ratingLabel !== undefined;

    return (
      <View>
        <AnimatedPressable
          style={[styles.card, animatedStyle]}
          onPress={item.onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Category label */}
          <Text style={styles.category} numberOfLines={1}>
            {item.categoryLabel}
          </Text>

          {/* Shift badge (conditional) */}
          {hasShift && (
            <View style={styles.badgeRow}>
              <ShiftBadge
                label={item.ratingLabel!}
                before={item.beforeRating!}
                after={item.afterRating!}
                invertScale={item.invertScale}
              />
            </View>
          )}
        </AnimatedPressable>
        <Text style={styles.timestamp}>
          {format(new Date(item.date), "dd EEE, HH:mm")}
        </Text>
      </View>
    );
  },
);

ExerciseTimelineCard.displayName = "ExerciseTimelineCard";
export { ExerciseTimelineCard };

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    // Multi-layer shadow for premium depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: "#2C2C2E",
    lineHeight: 18,
  },
  category: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: SAGE[600],
    lineHeight: 16,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 8,
  },
  timestamp: {
    fontFamily: "Nunito-Medium",
    fontSize: 8,
    color: "#C7C7CC",
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
