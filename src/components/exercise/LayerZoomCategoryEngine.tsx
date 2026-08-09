import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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

interface ZoomLayer {
  body: string;
  kicker: string;
  title: string;
}

export function LayerZoomCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const layers = readLayers(content.layers);
  const cardIndex = Math.min(readNumber(saved?.cardIndex) ?? 0, layers.length - 1);
  const visibleLayers = layers.slice(0, cardIndex + 1);
  const isComplete = cardIndex >= layers.length - 1;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.LayerZoom,
          phase: "progress",
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
        title={readString(content.title) ?? "One moment, three layers"}
        instruction={readString(content.instruction) ?? "Tap to zoom in."}
      />
      <View style={styles.layers}>
        {visibleLayers.map((layer, index) => (
          <View
            key={layer.kicker}
            style={[
              styles.layer,
              index === 1 && styles.layerMiddle,
              index >= 2 && styles.layerInner,
              { marginLeft: index * 12 },
            ]}
          >
            <Text style={[styles.kicker, index > 0 && styles.kickerOlive]}>
              {layer.kicker}
            </Text>
            <Text style={styles.layerTitle}>{layer.title}</Text>
            <Text style={styles.layerBody}>{layer.body}</Text>
          </View>
        ))}
      </View>
      {isComplete ? (
        <View style={styles.insight}>
          <Text style={styles.insightKicker}>THE IDEA</Text>
          <Text style={styles.insightBody}>{readString(content.insight)}</Text>
        </View>
      ) : null}
    </View>
  );
}

function readLayers(value: unknown): ZoomLayer[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((layerValue) => {
    const layer = readRecord(layerValue);
    const kicker = readString(layer?.kicker);
    const title = readString(layer?.title);
    const body = readString(layer?.body);
    return kicker && title && body ? [{ kicker, title, body }] : [];
  });
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, paddingHorizontal: 8, paddingTop: 6, paddingBottom: 12 },
  layers: { gap: 10 },
  layer: { paddingHorizontal: 18, paddingVertical: 15, borderWidth: 1.5, borderColor: COURSE_EXERCISE_COLORS.border, borderRadius: 24, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4 },
  layerMiddle: { borderColor: COURSE_EXERCISE_COLORS.accentLight, backgroundColor: COURSE_EXERCISE_COLORS.accentTint },
  layerInner: { borderColor: COURSE_EXERCISE_COLORS.accent, backgroundColor: COURSE_EXERCISE_COLORS.accentLight },
  kicker: { marginBottom: 4, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 10.5, letterSpacing: 0.7 },
  kickerOlive: { color: COURSE_EXERCISE_COLORS.accentDark },
  layerTitle: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 15.5, lineHeight: 20 },
  layerBody: { marginTop: 2, color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 14, lineHeight: 21 },
  insight: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 20, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4 },
  insightKicker: { marginBottom: 4, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 10.5, letterSpacing: 0.7 },
  insightBody: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 13.5, lineHeight: 20 },
});
