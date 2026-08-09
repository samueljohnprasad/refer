import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { paradoxCardStyles as styles } from "@/src/components/exercise/paradoxCardStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const STARTING_ALARM = 30;
const PUSH_AMOUNT = 18;
const STOPPED_ALARM = 25;

export function ParadoxCardCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const alarm = readNumber(saved?.alarm) ?? STARTING_ALARM;
  const pushCount = readNumber(saved?.pushCount) ?? 0;
  const revealed = saved?.revealed === true;
  const captions = readStringArray(content.captions);
  const canStop = alarm >= 90;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const pushHarder = () => {
    if (locked || canStop || revealed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInteraction(
      createResponse({
        ...saved,
        alarm: Math.min(100, alarm + PUSH_AMOUNT),
        pushCount: pushCount + 1,
      }),
      false,
    );
  };

  const stopPushing = () => {
    if (locked || revealed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onInteraction(
      createResponse({
        ...saved,
        alarm: STOPPED_ALARM,
        revealed: true,
      }),
      true,
    );
  };

  const caption = revealed
    ? readString(content.stopCaption)
    : pushCount === 0
      ? readString(content.openingCaption)
      : captions[Math.min(pushCount - 1, captions.length - 1)];

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Try harder. See what happens."}
        instruction={readString(content.instruction) ?? "Push and watch."}
      />

      <View style={styles.comparisonRow}>
        <ComparisonCard
          label="WHAT YOU’D EXPECT"
          body={readString(content.expectation)}
          tone="olive"
        />
        <ComparisonCard
          label="WHAT ACTUALLY HAPPENS"
          body={readString(content.reality)}
          tone="orange"
        />
      </View>

      <View style={styles.alarmLabels}>
        <Text style={styles.alarmEdge}>calm</Text>
        <Text style={styles.alarmTitle}>THE ALARM</Text>
        <Text style={styles.alarmEdge}>wired</Text>
      </View>
      <View style={styles.alarmTrack}>
        <View style={[styles.alarmFill, { width: `${alarm}%` }]} />
      </View>
      <Text style={styles.caption}>{caption}</Text>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={locked || canStop || revealed}
          onPress={pushHarder}
          style={({ pressed }) => [
            styles.pushButton,
            (canStop || revealed) && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.pushLabel}>TRY HARDER TO CALM DOWN</Text>
        </Pressable>
        {canStop || revealed ? (
          <Pressable
            accessibilityRole="button"
            disabled={locked || revealed}
            onPress={stopPushing}
            style={({ pressed }) => [
              styles.stopButton,
              revealed && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.stopLabel}>Stop pushing. Let it pass.</Text>
          </Pressable>
        ) : null}
      </View>

      {revealed ? (
        <View style={styles.revealCard}>
          <Text style={styles.rule}>{readString(content.rule)}</Text>
          <Text style={styles.takeaway}>{readString(content.takeaway)}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ComparisonCard({
  body,
  label,
  tone,
}: {
  body: string | null;
  label: string;
  tone: "olive" | "orange";
}) {
  const orange = tone === "orange";
  return (
    <View style={[styles.comparisonCard, orange && styles.orangeCard]}>
      <Text style={[styles.comparisonLabel, orange && styles.orangeLabel]}>
        {label}
      </Text>
      <Text style={[styles.comparisonBody, orange && styles.orangeBody]}>
        {body}
      </Text>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.ParadoxCard,
    phase: "paradox",
    alarm: STARTING_ALARM,
    pushCount: 0,
    revealed: false,
    isCorrect: true,
    ...extra,
  };
}
