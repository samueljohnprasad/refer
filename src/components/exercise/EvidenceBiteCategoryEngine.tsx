import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { StyleSheet } from "react-native";

export function EvidenceBiteCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The whole-night finding"}
      />

      <View style={styles.card}>
        <Text style={styles.finding}>
          {readString(content.finding)}
        </Text>
        <Text style={styles.evidence}>
          {readString(content.confidence)?.toLowerCase() ?? "strong"} evidence
        </Text>
        <Text style={styles.supporting}>
          {readString(content.confidenceWhy)}
        </Text>
        <Text style={styles.note}>
          {readString(content.note)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  finding: {
    fontFamily: "Nunito_700Bold",
    fontSize: 19,
    lineHeight: 26,
    color: SEMANTIC_COLORS.text.primary,
  },
  evidence: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    lineHeight: 18,
    color: SEMANTIC_COLORS.text.secondary,
  },
  supporting: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: SEMANTIC_COLORS.text.secondary,
  },
  note: {
    marginTop: 8,
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: SEMANTIC_COLORS.text.secondary,
  },
});

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.EvidenceBite,
    phase: "evidence",
    isCorrect: true,
    ...extra,
  };
}
