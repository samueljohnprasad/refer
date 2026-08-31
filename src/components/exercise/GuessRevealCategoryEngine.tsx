import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const SCALE_STEPS = 10;

export function GuessRevealCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const savedGuess = readNumber(readRecord(savedResponse)?.guess);
  const actual = readNumber(content.actual) ?? 7;
  const [guess, setGuess] = useState(savedGuess ?? 5);

  useEffect(() => {
    if (savedGuess === null) {
      onInteraction(buildGuessResponse(guess), true);
    }
  }, [guess, onInteraction, savedGuess]);

  const saveGuess = (value: number) => {
    setGuess(value);
    onInteraction(buildGuessResponse(value), true);
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Take a guess"}
        instruction={readString(content.instruction) ?? "Go with your gut."}
        prompt={readString(content.prompt)}
      />

      <View style={styles.card}>
        <Text style={styles.counter} accessibilityLiveRegion="polite">
          {locked ? actual : guess} in 10
        </Text>
        <View style={styles.dots} accessibilityElementsHidden>
          {Array.from({ length: SCALE_STEPS }, (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < (locked ? actual : guess) &&
                  (locked ? styles.dotActual : styles.dotGuess),
                index >= (locked ? actual : guess) && styles.dotEmpty,
                locked && index < guess && styles.dotGuessOutline,
              ]}
            />
          ))}
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={guess}
          disabled={locked}
          minimumTrackTintColor={SEMANTIC_COLORS.brand.primary}
          maximumTrackTintColor={SEMANTIC_COLORS.border.default}
          thumbTintColor={SEMANTIC_COLORS.brand.primary}
          accessibilityLabel="Your guess, from 0 to 10 adults"
          accessibilityValue={{ min: 0, max: 10, now: guess }}
          onValueChange={setGuess}
          onSlidingComplete={saveGuess}
        />
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>none</Text>
          <Text style={styles.scaleLabel}>everyone</Text>
        </View>
      </View>

      <Text style={styles.note}>
        {locked
          ? "Your guess is outlined. The filled dots are the real number."
          : "Drag to guess, then check."}
      </Text>
    </View>
  );
}

function buildGuessResponse(guess: number) {
  return {
    format: CourseExerciseCategoryEnum.GuessReveal,
    guess,
    isCorrect: true,
  };
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  card: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 28,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  counter: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 34,
    lineHeight: 40,
  },
  dots: { marginTop: 22, flexDirection: "row", gap: 7 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2.5 },
  dotGuess: {
    borderColor: "transparent",
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  dotActual: {
    borderColor: "transparent",
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  dotEmpty: {
    borderColor: "transparent",
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  dotGuessOutline: {
    borderColor: SEMANTIC_COLORS.brand.primary,
  },
  slider: { width: "100%", height: 52, marginTop: 12 },
  scaleLabels: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 12,
  },
  note: {
    marginTop: 14,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
  },
});
