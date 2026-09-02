import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInUp, Layout } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export function EvidenceBiteCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const stepIndex = typeof saved?.stepIndex === "number" ? saved.stepIndex : 0;

  const title = readString(content.title) ?? "Why one week teaches more";
  
  // Fallback content in case the database hasn't been updated yet
  const defaultSteps = [
    {
      observations: [
        { day: "Tue", cue: "Late caffeine", outcome: "Slept poorly" }
      ],
      insight: "Interesting. But one night is just a clue.",
      actionLabel: "WATCH ANOTHER NIGHT"
    },
    {
      observations: [
        { day: "Wed", cue: "No caffeine", outcome: "Slept well" },
        { day: "Thu", cue: "Late caffeine", outcome: "Slept poorly" }
      ],
      insight: "A PATTERN IS APPEARING",
      actionLabel: "WHAT DOES THAT TELL ME?"
    }
  ];
  
  const defaultConclusion = {
    title: "PATTERN ≠ PROOF",
    body: "It looks like late caffeine ruins your sleep. That is a pattern worth testing.\n\nBut a pattern is not proof. Other invisible factors might be at play.",
    footer: "Did you also work late on those nights? Were you more stressed? We don't know yet."
  };

  const steps = Array.isArray(content.steps) ? content.steps : defaultSteps;
  const conclusion = readRecord(content.conclusion) ?? defaultConclusion;

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse({ stepIndex: 0 }), true);
    }
  }, [onInteraction, saved]);

  // Aggregate observations up to current step
  const activeObservations = [];
  let currentInsight = null;

  for (let i = 0; i <= stepIndex && i < steps.length; i++) {
    const step = readRecord(steps[i]);
    if (step) {
      if (Array.isArray(step.observations)) {
        activeObservations.push(...step.observations);
      }
      if (i === stepIndex) {
        currentInsight = readString(step.insight);
      }
    }
  }

  const isConclusion = stepIndex >= steps.length;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} alwaysBounceVertical={false}>
      <CourseExerciseHeading title={title.toUpperCase()} />

      {activeObservations.length > 0 && !isConclusion ? (
        <Animated.View layout={Layout.duration(300)} style={styles.card}>
          {activeObservations.map((obs: any, idx: number) => {
            const day = readString(obs?.day) ?? "";
            const cue = readString(obs?.cue) ?? "";
            const outcome = readString(obs?.outcome) ?? "";
            
            return (
              <Animated.View key={`obs-${idx}`} entering={FadeInUp.duration(300).delay(100)} style={styles.observationRow}>
                <View style={styles.dayCol}>
                  <Animated.Text style={styles.dayText}>{day.toUpperCase()}</Animated.Text>
                </View>
                <View style={styles.detailCol}>
                  <Animated.Text style={styles.cueText}>{cue}</Animated.Text>
                  <Animated.Text style={styles.outcomeText}>{outcome}</Animated.Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>
      ) : null}

      {!isConclusion && currentInsight ? (
        <Animated.View key={`insight-${stepIndex}`} entering={FadeIn.duration(400).delay(200)} style={styles.insightContainer}>
          <Animated.Text style={styles.insightText}>{currentInsight}</Animated.Text>
        </Animated.View>
      ) : null}

      {isConclusion && conclusion ? (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.conclusionContainer}>
          <Animated.Text style={styles.conclusionTitle}>{readString(conclusion.title)}</Animated.Text>
          <Animated.Text style={styles.conclusionBody}>{readString(conclusion.body)}</Animated.Text>
          <View style={styles.conclusionDivider} />
          <Animated.Text style={styles.conclusionFooterText}>{readString(conclusion.footer)}</Animated.Text>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    marginTop: 24,
  },
  observationRow: {
    flexDirection: "row",
    gap: 16,
  },
  dayCol: {
    width: 45,
  },
  detailCol: {
    flex: 1,
  },
  dayText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: SEMANTIC_COLORS.text.secondary,
    paddingTop: 2,
  },
  cueText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: SEMANTIC_COLORS.text.primary,
    marginBottom: 2,
  },
  outcomeText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: SEMANTIC_COLORS.text.secondary,
  },
  insightContainer: {
    marginTop: 32,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  insightText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 18,
    color: SEMANTIC_COLORS.text.primary,
    textAlign: "center",
    lineHeight: 28,
  },
  conclusionContainer: {
    marginTop: 24,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
  },
  conclusionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: SEMANTIC_COLORS.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  conclusionBody: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 18,
    lineHeight: 28,
    color: SEMANTIC_COLORS.text.primary,
    textAlign: "center",
  },
  conclusionDivider: {
    height: 1,
    backgroundColor: SEMANTIC_COLORS.border.opaque,
    marginVertical: 20,
  },
  conclusionFooterText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    lineHeight: 24,
    color: SEMANTIC_COLORS.text.secondary,
    textAlign: "center",
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
