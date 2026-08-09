import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
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

interface FeelingWord {
  description: string;
  word: string;
}

interface FeelingFamily {
  name: string;
  words: FeelingWord[];
}

export function NameItCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const families = readFamilies(content.families);
  const phase = readString(saved?.phase) ?? "family";
  const selectedFamily = families.find(
    (family) => family.name === readString(saved?.selectedFamily),
  );
  const selectedWord = readString(saved?.selectedWord);
  const [intensity, setIntensity] = useState(readNumber(saved?.intensity) ?? 5);

  useEffect(() => {
    if (!saved) {
      onInteraction(buildFamilyResponse(), false);
    }
  }, [onInteraction, saved]);

  const selectFamily = (family: FeelingFamily) => {
    Haptics.selectionAsync();
    onInteraction(
      {
        ...buildFamilyResponse(),
        phase: "word",
        selectedFamily: family.name,
      },
      false,
    );
  };

  const selectWord = (word: string) => {
    Haptics.selectionAsync();
    onInteraction(
      {
        ...saved,
        selectedWord: word,
        isCorrect: true,
      },
      true,
    );
  };

  const saveIntensity = (value: number) => {
    setIntensity(value);
    onInteraction({ ...saved, intensity: value, isCorrect: true }, true);
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Name the feeling"}
        instruction={
          readString(content.instruction) ?? "Choose the closest word."
        }
      />

      {phase === "family" ? (
        <View style={styles.familyGrid}>
          {families.map((family) => (
            <Pressable
              key={family.name}
              accessibilityRole="button"
              onPress={() => selectFamily(family)}
              style={({ pressed }) => [styles.family, pressed && styles.pressed]}
            >
              <Text style={styles.familyLabel}>{family.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {phase === "word" && selectedFamily ? (
        <>
          <Pressable
            accessibilityRole="button"
            onPress={() => onInteraction(buildFamilyResponse(), false)}
            style={styles.changeFamily}
          >
            <Text style={styles.changeFamilyLabel}>
              {selectedFamily.name} family · change
            </Text>
          </Pressable>
          <View style={styles.wordList}>
            {selectedFamily.words.map((item) => {
              const isSelected = selectedWord === item.word;
              return (
                <Pressable
                  key={item.word}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => selectWord(item.word)}
                  style={({ pressed }) => [
                    styles.word,
                    isSelected && styles.wordSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.wordLabel}>{item.word}</Text>
                  <Text style={styles.wordDescription}>{item.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {phase === "intensity" ? (
        <View style={styles.intensityCard}>
          <Text style={styles.wordPill}>{selectedWord}</Text>
          <Text style={styles.intensityLabel}>HOW LOUD IS IT RIGHT NOW?</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={intensity}
            disabled={locked}
            minimumTrackTintColor={COURSE_EXERCISE_COLORS.orange}
            maximumTrackTintColor={COURSE_EXERCISE_COLORS.border}
            thumbTintColor={COURSE_EXERCISE_COLORS.orange}
            accessibilityLabel="Feeling intensity, 0 to 10"
            accessibilityValue={{ min: 0, max: 10, now: intensity }}
            onValueChange={setIntensity}
            onSlidingComplete={saveIntensity}
          />
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>a whisper</Text>
            <Text style={styles.scaleLabel}>very loud</Text>
          </View>
        </View>
      ) : null}

      {locked && selectedWord ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackTitle}>Why naming helps</Text>
          <Text style={styles.feedbackBody}>
            You landed on “{selectedWord}” at {intensity} out of 10. {readString(content.teach)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function buildFamilyResponse() {
  return {
    format: CourseExerciseCategoryEnum.NameIt,
    phase: "family",
    selectedFamily: null,
    selectedWord: null,
    intensity: 5,
    isCorrect: true,
  };
}

function readFamilies(value: unknown): FeelingFamily[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((familyValue) => {
    const family = readRecord(familyValue);
    const name = readString(family?.name);
    if (!family || !name || !Array.isArray(family.words)) return [];
    const words = family.words.flatMap((wordValue) => {
      const word = readRecord(wordValue);
      const label = readString(word?.word);
      const description = readString(word?.description);
      return label && description ? [{ word: label, description }] : [];
    });
    return [{ name, words }];
  });
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, paddingHorizontal: 8, paddingTop: 6, paddingBottom: 12 },
  familyGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, paddingTop: 4 },
  family: { minHeight: 54, justifyContent: "center", paddingHorizontal: 24, borderWidth: 1, borderBottomWidth: 4, borderColor: COURSE_EXERCISE_COLORS.border, borderRadius: 27, backgroundColor: COURSE_EXERCISE_COLORS.surface },
  familyLabel: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 16 },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.8 },
  changeFamily: { alignSelf: "flex-start", minHeight: 40, justifyContent: "center", marginBottom: 12, paddingHorizontal: 16, borderWidth: 1.5, borderColor: COURSE_EXERCISE_COLORS.olive, borderRadius: 20, backgroundColor: COURSE_EXERCISE_COLORS.oliveTint },
  changeFamilyLabel: { color: COURSE_EXERCISE_COLORS.oliveDark, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 13 },
  wordList: { gap: 9 },
  word: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderBottomWidth: 4, borderColor: COURSE_EXERCISE_COLORS.border, borderRadius: 22, backgroundColor: COURSE_EXERCISE_COLORS.surface },
  wordSelected: { borderColor: COURSE_EXERCISE_COLORS.olive, backgroundColor: COURSE_EXERCISE_COLORS.oliveTint },
  wordLabel: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 15 },
  wordDescription: { marginTop: 3, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 12.5, lineHeight: 17 },
  intensityCard: { alignItems: "center", gap: 16, paddingHorizontal: 22, paddingVertical: 24, borderRadius: 28, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 8 },
  wordPill: { paddingHorizontal: 22, paddingVertical: 9, borderRadius: 22, overflow: "hidden", color: COURSE_EXERCISE_COLORS.surface, backgroundColor: COURSE_EXERCISE_COLORS.olive, fontFamily: COURSE_EXERCISE_FONTS.heading, fontSize: 21 },
  intensityLabel: { color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 12, letterSpacing: 0.6 },
  slider: { width: "100%", height: 44 },
  scaleLabels: { width: "100%", flexDirection: "row", justifyContent: "space-between" },
  scaleLabel: { color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 12 },
  feedback: { marginTop: 16, paddingHorizontal: 17, paddingVertical: 15, borderWidth: 1.5, borderColor: COURSE_EXERCISE_COLORS.olive, borderRadius: 24, backgroundColor: COURSE_EXERCISE_COLORS.oliveTint },
  feedbackTitle: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.heading, fontSize: 16 },
  feedbackBody: { marginTop: 5, color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 13.5, lineHeight: 20 },
});
