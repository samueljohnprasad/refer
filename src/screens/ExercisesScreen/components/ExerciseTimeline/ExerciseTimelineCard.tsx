/**
 * ExerciseTimelineCard
 *
 * Premium card rendered for each exercise in the timeline.
 *
 * Layout:
 *  ┌──────────────────────────────┐
 *  │  Title (bold 14)            │
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
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import { ShiftBadge } from "./ShiftBadge";
import type { ExerciseTimelineItem } from "./types";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { styles } from "./ExerciseTimelineCard.styles";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  formatTimelineDate,
  formatTimelineTimestamp,
  getLocalizedDistortion,
  getLocalizedExerciseCategory,
  getLocalizedExerciseTitle,
  getLocalizedLogFieldLabel,
  getLocalizedRatingLabel,
} from "./timelineLocalization";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedEmotionBar: React.FC<{
  emotion: string;
  intensity: number;
}> = React.memo(({ emotion, intensity }) => {
  const widthVal = useSharedValue(0);

  React.useEffect(() => {
    widthVal.value = withTiming((intensity / 10) * 100, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [intensity, widthVal]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthVal.value}%`,
  }));

  return (
    <View style={styles.emotionBarRow}>
      <Text style={styles.emotionText}>{emotion}</Text>
      <View style={styles.emotionBarBg}>
        <Animated.View style={[styles.emotionBarFill, fillStyle]} />
      </View>
      <Text style={styles.emotionIntensity}>{intensity}/10</Text>
    </View>
  );
});

interface ExerciseTimelineCardProps {
  readonly item: ExerciseTimelineItem;
}

const ExerciseTimelineCard: React.FC<ExerciseTimelineCardProps> = React.memo(
  ({ item }) => {
    const { t } = useTranslation("exercises");
    const { t: commonT } = useTranslation("common");
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage ?? i18n.language;
    const previewText = item.previewText === "I am grateful for..."
      ? t("log.gratitudePrompt")
      : item.previewText;
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
          rotate: withTiming(isExpanded ? "180deg" : "0deg", {
            duration: 260,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
    }));

    const handlePress = useCallback((e: any) => {
      Haptics.selectionAsync();
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
    }, [item]);

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
                {getLocalizedExerciseTitle(t, item)}
              </Text>
              <View style={styles.categoryPill}>
                <Text style={styles.category} numberOfLines={1}>
                  {getLocalizedExerciseCategory(t, item)}
                </Text>
              </View>
            </View>
            {hasAccordion && (
              <Animated.View style={[styles.chevron, chevronStyle]}>
                <Feather name="chevron-down" size={20} color={SEMANTIC_COLORS.text.secondary} />
              </Animated.View>
            )}
          </View>

          {/* Preview Text */}
          {previewText && !isExpanded && (
            <Text style={styles.previewText} numberOfLines={2}>
              "{previewText}"
            </Text>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View
              style={styles.expandedContent}
              layout={LinearTransition.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
            >
              {previewText && (!item.gratitudeEntries || item.gratitudeEntries.length === 0) && (
                <View style={styles.previewContainer}>
                  <Text style={styles.sectionLabel}>
                    {getLocalizedLogFieldLabel(t, item.previewLabel)}
                  </Text>
                  <Text style={styles.previewTextExpanded}>
                    "{previewText}"
                  </Text>
                </View>
              )}

              {/* Emotions with Smooth Reveal Animation */}
              {item.emotions && item.emotions.length > 0 && (
                <View style={styles.emotionsContainer}>
                  <Text style={styles.sectionLabel}>{t("log.emotions")}</Text>
                  {item.emotions.map((e: { emotion: string; intensity: number }, idx: number) => (
                    <AnimatedEmotionBar
                      key={idx}
                      emotion={e.emotion}
                      intensity={e.intensity}
                    />
                  ))}
                </View>
              )}

              {/* Cognitive Distortions */}
              {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsSection}>
                    <Text style={styles.sectionLabel}>{t("log.distortions")}</Text>
                  <View style={styles.tagsContainer}>
                    {item.tags.map((tag: string, idx: number) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>
                          {getLocalizedDistortion(commonT, tag)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Gratitude Entries */}
              {item.gratitudeEntries && item.gratitudeEntries.length > 0 && (
                <View style={styles.gratitudeContainer}>
                  {item.gratitudeEntries.map((entry: string, idx: number) => (
                    <View key={idx} style={styles.gratitudeRow}>
                      <Feather
                        name="heart"
                        size={14}
                        color={SEMANTIC_COLORS.brand.primary}
                        style={styles.gratitudeIcon}
                      />
                      <Text style={styles.gratitudeText}>{entry}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Balanced Thought / Alternative Belief */}
              {item.expandedText && (
                <View style={styles.reframeCard}>
                  <View style={styles.reframeHeader}>
                    <Feather name="check-circle" size={13} color={SEMANTIC_COLORS.brand.onSoft} />
                    <Text style={styles.reframeLabel}>
                      {getLocalizedLogFieldLabel(t, item.expandedLabel)}
                    </Text>
                  </View>
                  <Text style={styles.expandedText}>{item.expandedText}</Text>
                </View>
              )}

              <Pressable
                style={styles.viewDetailsButton}
                onPress={item.onPress}
                accessibilityRole="button"
                accessibilityLabel={t("log.openFullDetails", {
                  title: item.title,
                  date: formatTimelineDate(new Date(item.date), locale),
                })}
              >
                <Text style={styles.viewDetailsText}>
                  {t("log.openEntry")} →
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Footer row with ShiftBadge & Timestamp inside the card */}
          <View style={styles.cardFooter}>
            {hasShift ? (
              <ShiftBadge
                label={getLocalizedRatingLabel(t, item.ratingLabel!)}
                before={item.beforeRating!}
                after={item.afterRating!}
                invertScale={item.invertScale}
              />
            ) : (
              <View />
            )}
            <Text style={styles.timestamp}>
              {formatTimelineTimestamp(new Date(item.date), locale)}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    );
  },
);

ExerciseTimelineCard.displayName = "ExerciseTimelineCard";
export { ExerciseTimelineCard };
