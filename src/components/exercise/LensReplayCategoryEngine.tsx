import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface LensSegment {
  text: string;
  label?: string;
  response?: string;
}

export function LensReplayCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const segments = readSegments(content.segments);
  const highlightIndexes = segments.flatMap((segment, index) =>
    segment.label ? [index] : [],
  );
  const seenIndexes = readNumberArray(saved?.seenSegmentIndexes);
  const activeIndex = readNullableNumber(saved?.activeSegmentIndex);
  const activeSegment = activeIndex === null ? null : segments[activeIndex];
  const allSeen =
    highlightIndexes.length > 0 &&
    seenIndexes.length >= highlightIndexes.length;
  const reduceMotion = useReducedMotion();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const finalFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  useEffect(() => {
    if (activeSegment && !allSeen) {
      fadeAnim.setValue(0);
      slideAnim.setValue(10);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: reduceMotion ? 0 : 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeIndex, allSeen, reduceMotion, fadeAnim, slideAnim]);

  useEffect(() => {
    if (allSeen) {
      Animated.timing(finalFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [allSeen, finalFadeAnim]);

  const openHighlight = (index: number) => {
    if (locked || allSeen) return;
    Haptics.selectionAsync();
    const nextSeen = seenIndexes.includes(index)
      ? seenIndexes
      : [...seenIndexes, index];

    const isNowAllSeen = nextSeen.length >= highlightIndexes.length;
    onInteraction(
      createResponse({
        ...saved,
        seenSegmentIndexes: nextSeen,
        activeSegmentIndex: index,
        phase: "replay",
        isComplete: isNowAllSeen, // Fulfills submissionRequirement when all seen
      }),
      nextSeen.length > 0, // Sets ready=true, which hides Skip button
    );
  };

  return (
    <View style={styles.container}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Replay the Scene"}
        instruction={
          readString(content.instruction) ??
          "Tap the highlighted parts to see what you noticed — and what your mind added."
        }
      />

      {!allSeen ? (
        <Animated.View style={{ opacity: 1 }}>
          <View style={styles.sceneCard}>
            <Text style={styles.sceneText}>
              {segments.map((segment, index) => {
                if (!segment.label) {
                  return (
                    <Text key={`${index}-${segment.text}`}>{segment.text}</Text>
                  );
                }
                const seen = seenIndexes.includes(index);
                const active = activeIndex === index;

                const highlightStyle = active
                  ? styles.highlightActive
                  : seen
                    ? styles.highlightExplored
                    : styles.highlightUnexplored;

                return (
                  <Text
                    key={`${index}-${segment.text}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${segment.text}. Reveal.`}
                    accessible={true}
                    onPress={() => openHighlight(index)}
                    style={[styles.highlightBase, highlightStyle]}
                  >
                    {segment.text}
                  </Text>
                );
              })}
            </Text>
          </View>

          {activeSegment?.label ? (
            <Animated.View
              style={[
                styles.revealCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
              accessible={true}
            >
              <Text style={styles.revealLabel}>{activeSegment.label}</Text>
              <Text style={styles.revealText}>{activeSegment.response}</Text>
            </Animated.View>
          ) : null}
        </Animated.View>
      ) : (
        <Animated.View
          style={[{ opacity: finalFadeAnim }, styles.finalStateContainer]}
        >
          <View style={styles.compactBlock}>
            <Text style={styles.structuralLabel}>WHAT HAPPENED</Text>
            <Text style={styles.compactText}>Everyone stopped talking.</Text>
          </View>

          <View style={styles.compactBlock}>
            <Text style={styles.structuralLabel}>WHAT THE MIND ADDED</Text>
            <Text style={styles.compactText}>
              “They were talking about me.”
            </Text>
          </View>

          <View style={styles.ideaCard}>
            <Text style={styles.structuralLabel}>THE IDEA</Text>
            <Text style={styles.ideaText}>{readString(content.insight)}</Text>
          </View>
        </Animated.View>
      )}

      {/* Progress or Punchline */}
      <Text style={styles.progressText}>
        {allSeen
          ? "Same lines. New eyes."
          : `${seenIndexes.length} of ${highlightIndexes.length} highlights explored`}
      </Text>
    </View>
  );
}

function readSegments(value: unknown): LensSegment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const segment = readRecord(item);
    const text = readString(segment?.text);
    return text
      ? [
          {
            text,
            label: readString(segment?.label) ?? undefined,
            response: readString(segment?.response) ?? undefined,
          },
        ]
      : [];
  });
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LensReplay,
    phase: "replay",
    seenSegmentIndexes: [],
    activeSegmentIndex: null,
    isCorrect: true, // required so the shell skips the try again logic when completesExercise is true
    ...extra,
  };
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 6,
  },
  sceneCard: {
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.strong,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, // VERY subtle shadow as requested
    shadowRadius: 2,
    marginBottom: 12,
  },
  sceneText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 18,
    lineHeight: 30,
  },
  highlightBase: {
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium, // semibold to communicate tappability without icons
    overflow: "hidden", // ensures border radius applies smoothly
  },
  highlightUnexplored: {
    backgroundColor: "#E6EBE1", // Soft pale sage highlight
    color: SEMANTIC_COLORS.brand.pressed,
  },
  highlightActive: {
    backgroundColor: "#D3E0CD", // Slightly stronger sage
    color: SEMANTIC_COLORS.brand.pressed,
  },
  highlightExplored: {
    backgroundColor: "#F2F5F0", // Subtle muted treatment
    color: SEMANTIC_COLORS.text.primary,
  },
  revealCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.brand.soft,
    backgroundColor: SEMANTIC_COLORS.brand.onPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  revealLabel: {
    color: SEMANTIC_COLORS.brand.pressed, // Muted forest
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  revealText: {
    color: SEMANTIC_COLORS.text.primary, // Primary ink
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  finalStateContainer: {
    marginTop: 4,
    gap: 16,
  },
  compactBlock: {
    paddingHorizontal: 4,
  },
  structuralLabel: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  compactText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 18,
    lineHeight: 26,
  },
  ideaCard: {
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ideaText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  progressText: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
  },
});
