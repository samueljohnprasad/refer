import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";

export function LensReplayFinalState({
  insight,
}: {
  insight: string | null;
}): React.JSX.Element {
  const { t } = useTranslation("exercises");

  return (
    <View style={styles.container}>
      <View style={styles.compactBlock}>
        <Text style={styles.structuralLabel}>
          {t("flow.ui.categoryEngine.lensReplay.whatHappened")}
        </Text>
        <Text style={styles.compactText}>Everyone stopped talking.</Text>
      </View>

      <View style={styles.compactBlock}>
        <Text style={styles.structuralLabel}>
          {t("flow.ui.categoryEngine.lensReplay.mindAdded")}
        </Text>
        <Text style={styles.compactText}>“They were talking about me.”</Text>
      </View>

      <View style={styles.ideaCard}>
        <Text style={styles.structuralLabel}>
          {t("flow.ui.categoryEngine.lensReplay.idea")}
        </Text>
        <Text style={styles.ideaText}>{insight}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 4, gap: 16 },
  compactBlock: { paddingHorizontal: 4 },
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
});
