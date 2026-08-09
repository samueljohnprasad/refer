import React, { type ComponentProps, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface StoryBeat {
  body: string;
  icon: ComponentProps<typeof Feather>["name"];
  id: string;
  kicker: string;
  title: string;
}

export function StoryWalkthroughCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const beats = readStoryBeats(content.beats);
  const cardIndex = Math.min(readNumber(saved?.cardIndex) ?? 0, beats.length);
  const insight = readRecord(content.insight);
  const isInsight = cardIndex >= beats.length;
  const currentBeat = isInsight ? null : beats[cardIndex];

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.StoryWalkthrough,
          phase: "story",
          cardIndex: 0,
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "A short story"}
        instruction={
          readString(content.instruction) ?? "Tap through at your pace."
        }
      />

      <View style={[styles.card, isInsight && styles.insightCard]}>
        <View style={styles.iconCircle}>
          <Feather
            name={isInsight ? "check" : currentBeat?.icon ?? "circle"}
            size={38}
            color={COURSE_EXERCISE_COLORS.oliveDark}
          />
        </View>
        <Text style={styles.kicker}>
          {isInsight ? "AND OFTEN…" : currentBeat?.kicker}
        </Text>
        <Text style={styles.cardTitle}>
          {isInsight ? readString(insight?.title) : currentBeat?.title}
        </Text>
        <Text style={styles.cardBody}>
          {isInsight ? readString(insight?.body) : currentBeat?.body}
        </Text>
      </View>

      <View style={styles.dots}>
        {Array.from({ length: beats.length + 1 }, (_, index) => (
          <View
            key={`story-dot-${index}`}
            style={[
              styles.dot,
              index === cardIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function readStoryBeats(value: unknown): StoryBeat[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((beatValue, index) => {
    const beat = readRecord(beatValue);
    const kicker = readString(beat?.kicker);
    const title = readString(beat?.title);
    const body = readString(beat?.body);
    if (!kicker || !title || !body) {
      return [];
    }

    return [
      {
        id: readString(beat?.id) ?? `story-beat-${index}`,
        kicker,
        title,
        body,
        icon: readStoryIcon(beat?.icon),
      },
    ];
  });
}

function readStoryIcon(value: unknown): StoryBeat["icon"] {
  if (value === "moon" || value === "activity" || value === "zap") {
    return value;
  }
  return "circle";
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  card: {
    minHeight: 320,
    gap: 13,
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  insightCard: { backgroundColor: COURSE_EXERCISE_COLORS.oliveTint },
  iconCircle: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 41,
    backgroundColor: COURSE_EXERCISE_COLORS.oliveLight,
  },
  kicker: {
    marginTop: 4,
    color: COURSE_EXERCISE_COLORS.orange,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.75,
  },
  cardTitle: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 22,
    lineHeight: 26,
  },
  cardBody: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15.5,
    lineHeight: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  dot: { height: 8, borderRadius: 4 },
  activeDot: { width: 22, backgroundColor: COURSE_EXERCISE_COLORS.olive },
  inactiveDot: { width: 8, backgroundColor: COURSE_EXERCISE_COLORS.border },
});
