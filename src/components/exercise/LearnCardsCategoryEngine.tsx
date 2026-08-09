import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readCourseExerciseOptions,
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface LearningCard {
  id: string;
  kicker: string;
  title: string;
  body: string;
}

export function LearnCardsCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const cards = readCards(content.cards);
  const phase = readString(saved?.phase) ?? "cards";
  const cardIndex = Math.min(
    readNumber(saved?.cardIndex) ?? 0,
    cards.length - 1,
  );

  useEffect(() => {
    if (!saved) {
      onInteraction(buildCardResponse(0), true);
    }
  }, [onInteraction, saved]);

  if (phase === "recall") {
    return (
      <RecallPrompt
        content={content}
        savedResponse={saved}
        locked={locked}
        onInteraction={onInteraction}
      />
    );
  }

  const card = cards[cardIndex];

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Learn the idea"}
        instruction={readString(content.instruction) ?? "Read each short card."}
      />

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather
            name="zap"
            size={34}
            color={COURSE_EXERCISE_COLORS.accentDark}
          />
        </View>
        <Text style={styles.kicker}>{card?.kicker}</Text>
        <Text style={styles.cardTitle}>{card?.title}</Text>
        <Text style={styles.cardBody}>{card?.body}</Text>
      </View>

      <View style={styles.dots}>
        {cards.map((item, index) => (
          <View
            key={item.id}
            style={{
              height: 8,
              borderRadius: 4,
              width: index === cardIndex ? 24 : 8,
              backgroundColor:
                index === cardIndex
                  ? COURSE_EXERCISE_COLORS.accent
                  : COURSE_EXERCISE_COLORS.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function buildCardResponse(cardIndex: number) {
  return {
    format: CourseExerciseCategoryEnum.LearnCards,
    phase: "cards",
    cardIndex,
    isCorrect: false,
  };
}

function RecallPrompt({
  content,
  savedResponse,
  locked,
  onInteraction,
}: {
  content: Record<string, unknown>;
  savedResponse: Record<string, unknown> | null;
  locked: boolean;
  onInteraction: V1CategoryEngineProps["onInteraction"];
}) {
  const recall = readRecord(content.recall);
  const options = readCourseExerciseOptions(recall?.options);
  const selectedOptionId = readString(savedResponse?.selectedOptionId);
  const correctOptionId = readString(recall?.correctOptionId);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Quick recall"}
        instruction="Without looking back, choose the best answer."
        prompt={readString(recall?.prompt)}
      />
      <View style={styles.options}>
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            disabled={locked}
            onPress={() =>
              onInteraction(
                {
                  format: CourseExerciseCategoryEnum.LearnCards,
                  phase: "recall",
                  cardIndex: readNumber(savedResponse?.cardIndex) ?? 0,
                  selectedOptionId: option.id,
                  isCorrect: option.id === correctOptionId,
                },
                true,
              )
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  card: {
    minHeight: 338,
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 41,
    backgroundColor: COURSE_EXERCISE_COLORS.accentLight,
  },
  kicker: {
    marginTop: 18,
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardTitle: {
    marginTop: 10,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 22,
    lineHeight: 27,
  },
  cardBody: {
    marginTop: 12,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15.5,
    lineHeight: 24,
  },
  dots: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  options: { gap: 9 },
});

function readCards(value: unknown): LearningCard[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(readRecord)
    .filter((card): card is Record<string, unknown> => Boolean(card))
    .map((card, index) => ({
      id: readString(card.id) ?? `card-${index}`,
      kicker: readString(card.kicker) ?? `Card ${index + 1}`,
      title: readString(card.title) ?? "",
      body: readString(card.body) ?? "",
    }))
    .filter((card) => card.title.length > 0 && card.body.length > 0);
}
