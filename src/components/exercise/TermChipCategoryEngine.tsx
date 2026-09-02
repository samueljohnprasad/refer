import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface TermPanel {
  id: string;
  label: string;
  revealLabel: string;
  example: string;
  explanation: string;
}

export function TermChipCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const openPanelIds = readOpenPanelIds(saved?.openPanelIds);
  const panels = readPanels(content.panels);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const togglePanel = (panelId: string) => {
    if (locked) return;
    Haptics.selectionAsync();
    const isOpen = openPanelIds.includes(panelId);
    onInteraction(
      createResponse({
        ...saved,
        openPanelIds: isOpen
          ? openPanelIds.filter((id) => id !== panelId)
          : [...openPanelIds, panelId],
      }),
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "A word to keep"}
        instruction={readString(content.instruction) ?? "Tap both examples."}
      />
      <View style={styles.definitionCard}>
        <View style={styles.termPill}>
          <Text style={styles.term}>{readString(content.word)}</Text>
        </View>
        <Text style={styles.definition}>{readString(content.definition)}</Text>
      </View>
      <View style={styles.panelList}>
        {panels.map((panel) => {
          const isOpen = openPanelIds.includes(panel.id);
          return (
            <Pressable
              key={panel.id}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              disabled={locked}
              onPress={() => togglePanel(panel.id)}
              style={({ pressed }) => [
                styles.panel,
                isOpen && styles.openPanel,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.panelLabel, isOpen && styles.openLabel]}>
                {isOpen ? panel.revealLabel : panel.label}
              </Text>
              <Text style={styles.panelBody}>
                {isOpen ? panel.explanation : panel.example}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.note}>{readString(content.note)}</Text>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.TermChip,
    phase: "term",
    openPanelIds: [],
    isCorrect: true,
    ...extra,
  };
}

function readOpenPanelIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readPanels(value: unknown): TermPanel[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const panel = readRecord(item);
    const id = readString(panel?.id);
    const label = readString(panel?.label);
    const revealLabel = readString(panel?.revealLabel);
    const example = readString(panel?.example);
    const explanation = readString(panel?.explanation);
    return id && label && revealLabel && example && explanation
      ? [{ id, label, revealLabel, example, explanation }]
      : [];
  });
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  definitionCard: {
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },
  termPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  term: {
    color: SEMANTIC_COLORS.surface.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 20,
  },
  definition: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15.5,
    lineHeight: 23,
  },
  panelList: { gap: 10, marginTop: 12 },
  panel: {
    minHeight: 94,
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  openPanel: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.92 },
  panelLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  openLabel: { color: SEMANTIC_COLORS.brand.pressed },
  panelBody: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 21,
  },
  note: {
    marginTop: 12,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
  },
});
