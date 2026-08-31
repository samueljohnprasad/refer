import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import { ExerciseWorkspace, MicrolearningMedia, StageProgress } from "@/src/components/exercise/microlearning";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { readLayerZoomContent } from "./layerZoomContent";
import { hasSameLayerZoomResponse } from "./layerZoomResponse";
import { createLayerZoomResponse } from "./layerZoomState";
import { COURSE_EXERCISE_FONTS } from "./courseExerciseTheme";

export function LayerZoomCategoryEngine({ exercise, savedResponse, onInteraction }: V1CategoryEngineProps) {
  const content = readLayerZoomContent(exercise.content);
  const saved = readRecord(savedResponse);
  const response = content ? createLayerZoomResponse(content, saved) : null;
  const mountedStage = useRef<number | null>(null);
  const announcedStage = useRef<number | null>(null);
  useEffect(() => {
    if (!content || !response || (saved && hasSameLayerZoomResponse(saved, response))) return;
    onInteraction(response, true);
  }, [content, onInteraction, response, saved]);
  useEffect(() => {
    if (response) mountedStage.current = response.stageIndex;
  }, [response]);
  useEffect(() => {
    if (!content || !response) return;
    const previousStage = announcedStage.current;
    announcedStage.current = response.stageIndex;
    if (previousStage === null || previousStage === response.stageIndex) return;
    const layer = content.layers[response.stageIndex];
    const context = `${layer.label}. ${layer.title}. ${layer.body}`;
    void AccessibilityInfo.announceForAccessibility(
      response.phase === "complete" ? `${context} ${content.insight}` : context,
    );
  }, [content, response]);
  if (!content || !response) return null;
  const currentLayer = content.layers[response.stageIndex];
  const transitionKey = mountedStage.current !== null && mountedStage.current !== response.stageIndex
    ? `layer-zoom-${response.stageIndex}` : undefined;
  return <View style={styles.screen}>
    <CourseExerciseHeading title={content.title} instruction={content.instruction} />
    <StageProgress stageIndex={response.stageIndex} stageCount={content.layers.length} label="Layer" />
    <ExerciseWorkspace accessibilityLabel="Layered explanation" transitionKey={transitionKey}>
      <View style={styles.surface}>
        {content.layers.slice(0, response.stageIndex).map((layer) => <CompactLayerBand key={layer.id} label={layer.label} title={layer.title} />)}
        <View accessibilityLiveRegion="polite" style={styles.expandedLayer}>
          <Text style={styles.label}>{currentLayer.label}</Text><Text style={styles.title}>{currentLayer.title}</Text><Text style={styles.body}>{currentLayer.body}</Text>
        </View>
        {content.image ? <MicrolearningMedia media={{ kind: "image", ...content.image }} /> : null}
        {response.phase === "complete" ? <Text style={styles.insight}>{content.insight}</Text> : null}
      </View>
    </ExerciseWorkspace>
  </View>;
}

function CompactLayerBand({ label, title }: { label: string; title: string }) {
  return <View style={styles.compactBand}><Text style={styles.compactLabel}>{label}</Text><Text style={styles.compactTitle}>{title}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 14 }, surface: { gap: 12 },
  compactBand: { gap: 2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: SEMANTIC_COLORS.surface.secondary },
  compactLabel: { color: SEMANTIC_COLORS.text.secondary, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 12 },
  compactTitle: { color: SEMANTIC_COLORS.text.primary, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 14, lineHeight: 19 },
  expandedLayer: { gap: 6, borderRadius: 16, padding: 18, backgroundColor: SEMANTIC_COLORS.brand.soft },
  label: { color: SEMANTIC_COLORS.brand.pressed, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 12 },
  title: { color: SEMANTIC_COLORS.text.primary, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 18, lineHeight: 24 },
  body: { color: SEMANTIC_COLORS.text.primary, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 15, lineHeight: 22 },
  insight: { color: SEMANTIC_COLORS.text.secondary, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 14, lineHeight: 21 },
});
