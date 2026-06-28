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

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  LayoutAnimation,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import { format } from "date-fns";
import { SAGE, INK_MUTED } from "@/lib/tokens";
import { ShiftBadge } from "./ShiftBadge";
import type { ExerciseTimelineItem } from "./types";
import { Feather } from "@expo/vector-icons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseTimelineCardProps {
  readonly item: ExerciseTimelineItem;
}

const ExerciseTimelineCard: React.FC<ExerciseTimelineCardProps> = React.memo(
  ({ item }) => {
    const scale = useSharedValue(1);
    const [isExpanded, setIsExpanded] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.ease) });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
    }, [scale]);

    const chevronStyle = useAnimatedStyle(() => ({
      transform: [
        {
          rotate: withTiming(isExpanded ? "180deg" : "0deg", { duration: 300 }),
        },
      ],
    }));

    const handlePress = useCallback((e: any) => {
      if (
        item.expandedText ||
        item.tags?.length ||
        item.gratitudeEntries?.length ||
        item.emotions?.length
      ) {
        setIsExpanded((prev) => !prev);
      } else {
        item.onPress(e);
      }
    }, [item, isExpanded]);

    const hasShift: boolean =
      (item.beforeRating !== undefined || item.afterRating !== undefined) &&
      item.ratingLabel !== undefined;
    const hasAccordion: boolean = !!(
      item.expandedText ||
      item.tags?.length ||
      item.gratitudeEntries?.length ||
      item.emotions?.length
    );

    return (
      <View>
        <AnimatedPressable
          style={[styles.card, animatedStyle]}
          layout={LinearTransition.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.category} numberOfLines={1}>
                {item.categoryLabel}
              </Text>
            </View>
            {hasAccordion && (
              <Animated.View style={[styles.chevron, chevronStyle]}>
                <Feather name="chevron-down" size={20} color={INK_MUTED} />
              </Animated.View>
            )}
          </View>

          {/* Preview Text */}
          {item.previewText && !isExpanded && (
            <Text style={styles.previewText} numberOfLines={2}>
              "{item.previewText}"
            </Text>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View
              style={styles.expandedContent}
              layout={LinearTransition.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
            >
              {item.previewText && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Situation / Thought</Text>
                  <Text style={styles.previewTextExpanded}>
                    "{item.previewText}"
                  </Text>
                </View>
              )}

              {/* Emotions */}
              {item.emotions && item.emotions.length > 0 && (
                <View style={styles.emotionsContainer}>
                  <Text style={styles.sectionLabel}>Emotions</Text>
                  {item.emotions.map((e, idx) => (
                    <View key={idx} style={styles.emotionBarRow}>
                      <Text style={styles.emotionText}>{e.emotion}</Text>
                      <View style={styles.emotionBarBg}>
                        <View
                          style={[
                            styles.emotionBarFill,
                            { width: `${(e.intensity / 10) * 100}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.emotionIntensity}>
                        {e.intensity}/10
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Cognitive Distortions */}
              {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <Text style={styles.sectionLabel}>Cognitive Distortions</Text>
                  <View style={styles.tagsContainer}>
                    {item.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Gratitude Entries */}
              {item.gratitudeEntries && item.gratitudeEntries.length > 0 && (
                <View style={styles.gratitudeContainer}>
                  {item.gratitudeEntries.map((entry, idx) => (
                    <View key={idx} style={styles.gratitudeRow}>
                      <Feather
                        name="heart"
                        size={14}
                        color={SAGE[500]}
                        style={styles.gratitudeIcon}
                      />
                      <Text style={styles.gratitudeText}>{entry}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Balanced Thought / Alternative Belief */}
              {item.expandedText && (
                <View style={styles.balancedThoughtContainer}>
                  <Text style={styles.sectionLabel}>Reframed Perspective</Text>
                  <Text style={styles.expandedText}>{item.expandedText}</Text>
                </View>
              )}

              <Pressable
                style={styles.viewDetailsButton}
                onPress={item.onPress}
              >
                <Text style={styles.viewDetailsText}>
                  View Full Entry &rarr;
                </Text>
              </Pressable>
            </Animated.View>
          )}

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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  chevron: {
    marginTop: 2,
  },
  previewText: {
    fontFamily: "Nunito-Italic",
    fontSize: 13,
    color: INK_MUTED,
    marginTop: 8,
    lineHeight: 18,
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
    paddingTop: 12,
  },
  previewTextExpanded: {
    fontFamily: "Nunito-Italic",
    fontSize: 13,
    color: INK_MUTED,
    marginBottom: 8,
    lineHeight: 18,
  },
  expandedText: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    color: "#48484A",
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: SAGE[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 11,
    color: SAGE[800],
  },
  viewDetailsButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  viewDetailsText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    color: SAGE[600],
  },

  // New Rich Section Styles
  previewContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: SAGE[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  previewLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: INK_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emotionsContainer: {
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: 10,
    borderRadius: 8,
  },
  emotionBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  emotionText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: "#2C2C2E",
    width: 60,
  },
  emotionBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  emotionBarFill: {
    height: "100%",
    backgroundColor: SAGE[400],
    borderRadius: 3,
  },
  emotionIntensity: {
    fontFamily: "Nunito-Medium",
    fontSize: 11,
    color: INK_MUTED,
    width: 24,
    textAlign: "right",
  },
  tagsSection: {
    marginBottom: 12,
  },
  gratitudeContainer: {
    marginBottom: 16,
    backgroundColor: SAGE[50],
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  gratitudeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  gratitudeIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  gratitudeText: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    color: "#2C2C2E",
    lineHeight: 18,
  },
  balancedThoughtContainer: {
    backgroundColor: "#F4F5F4", // More subtle sage tint, Apple-like
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    // Removed the heavy left border for a cleaner, modern look
  },
});
