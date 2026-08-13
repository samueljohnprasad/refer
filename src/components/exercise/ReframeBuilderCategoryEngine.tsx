import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import {
  ActivePrompt,
  ChoiceTray,
  CompactHistory,
  ExerciseComparison,
  ExerciseWorkspace,
  StageProgress,
} from "@/src/components/exercise/microlearning";
import {
  buildReframeThought,
  createReframeBuilderResponse,
  firstUnfilledTrayId,
  hasCompleteReframeSelection,
  readReframeBuilderContent,
} from "@/src/components/exercise/reframeBuilderContent";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function ReframeBuilderCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const builder = readReframeBuilderContent(content);
  const saved = readRecord(savedResponse);
  const response = builder ? createReframeBuilderResponse(builder, saved) : null;

  useEffect(() => {
    if (!builder || !response) return;
    if (!saved || !hasSameResponse(saved, response)) {
      onInteraction(response, hasCompleteReframeSelection(builder, response.selectedByTrayId));
    }
  }, [builder, onInteraction, response, saved]);

  if (!builder || !response) return null;

  const activeTrayId = response.editingTrayId ?? firstUnfilledTrayId(
    builder,
    response.selectedByTrayId,
  );
  const activeTray = builder.trays.find((tray) => tray.id === activeTrayId);
  const complete = response.phase === "complete";
  const fairerThought = buildReframeThought(builder, response.selectedByTrayId);
  const completedItems = builder.trays
    .filter((tray) => tray.id !== activeTray?.id && response.selectedByTrayId[tray.id])
    .map((tray) => ({
      id: tray.id,
      label: tray.slotLabel,
      value: tray.options.find((option) => option.id === response.selectedByTrayId[tray.id])?.label ?? "",
    }));
  const futureTrays = activeTray
    ? builder.trays.slice(builder.trays.indexOf(activeTray) + 1).filter((tray) => !response.selectedByTrayId[tray.id])
    : [];

  const selectOption = (optionId: string) => {
    if (locked || !activeTray || complete) return;
    Haptics.selectionAsync();
    const nextResponse = createReframeBuilderResponse(builder, {
      selectedByTrayId: { ...response.selectedByTrayId, [activeTray.id]: optionId },
      editingTrayId: null,
    });
    onInteraction(
      nextResponse,
      hasCompleteReframeSelection(builder, nextResponse.selectedByTrayId),
    );
  };

  const editTray = (trayId: string) => {
    if (locked || complete) return;
    onInteraction(
      createReframeBuilderResponse(builder, {
        selectedByTrayId: response.selectedByTrayId,
        editingTrayId: trayId,
      }),
      hasCompleteReframeSelection(builder, response.selectedByTrayId),
    );
  };

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Build a fairer thought"}
        instruction={readString(content.instruction) ?? "Choose one phrase at a time."}
      />
      <View accessibilityLabel="Hot thought" style={styles.hotThought}>
        <Text style={styles.hotThoughtLabel}>Hot thought</Text>
        <Text numberOfLines={2} style={styles.hotThoughtText}>{builder.hotThought}</Text>
      </View>
      <StageProgress stageIndex={response.stageIndex} stageCount={builder.trays.length} label="Slot" />
      <ExerciseWorkspace transitionKey={`${response.phase}-${activeTrayId ?? "ready"}`}>
        {complete && fairerThought ? (
          <ExerciseComparison
            before={{ label: "Hot thought", value: builder.hotThought }}
            after={{ label: "Fairer thought", value: fairerThought }}
            caption={builder.comparisonFeedback}
          />
        ) : (
          <>
            <CompactHistory items={completedItems} onEdit={editTray} />
            {activeTray ? (
              <>
                <ActivePrompt prompt={activeTray.slotLabel} />
                <ChoiceTray
                  choices={activeTray.options}
                  selectedId={response.selectedByTrayId[activeTray.id] ?? null}
                  disabled={locked}
                  onSelect={selectOption}
                />
                {futureTrays.length > 0 ? (
                  <Text style={styles.future}>
                    Next: {futureTrays.map((tray) => tray.slotLabel).join(" · ")} ({futureTrays.length} remaining)
                  </Text>
                ) : null}
              </>
            ) : (
              <View style={styles.ready}>
                <Text style={styles.readyText}>Your fairer thought is ready to compare.</Text>
              </View>
            )}
          </>
        )}
      </ExerciseWorkspace>
    </View>
  );
}

function hasSameResponse(
  saved: Record<string, unknown>,
  response: ReturnType<typeof createReframeBuilderResponse>,
): boolean {
  const selected = saved.selectedByTrayId;
  return (
    saved.format === response.format &&
    saved.phase === response.phase &&
    saved.stageIndex === response.stageIndex &&
    saved.isCorrect === response.isCorrect &&
    saved.editingTrayId === response.editingTrayId &&
    selected !== null &&
    typeof selected === "object" &&
    !Array.isArray(selected) &&
    Object.keys(selected as Record<string, unknown>).length === Object.keys(response.selectedByTrayId).length &&
    Object.entries(response.selectedByTrayId).every(
      ([trayId, optionId]) => (selected as Record<string, unknown>)[trayId] === optionId,
    )
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16, paddingHorizontal: 10, paddingBottom: 12, paddingTop: 6 },
  hotThought: {
    gap: 3,
    borderLeftWidth: 3,
    borderLeftColor: COURSE_EXERCISE_COLORS.accentLight,
    paddingLeft: 12,
  },
  hotThoughtLabel: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  hotThoughtText: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  future: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  ready: { paddingVertical: 16 },
  readyText: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
});
