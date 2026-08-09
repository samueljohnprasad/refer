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

interface DialogueMessage {
  id: string;
  name: string;
  side: "left" | "right";
  text: string;
}

export function DialogueCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const messages = readMessages(content.messages);
  const cardIndex = Math.min(readNumber(saved?.cardIndex) ?? 0, messages.length - 1);
  const isComplete = cardIndex >= messages.length - 1;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.Dialogue,
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
        title={readString(content.title) ?? "Same email, two minds"}
        instruction={readString(content.instruction) ?? "Tap through at your pace."}
      />
      <View style={styles.messages}>
        {messages.slice(0, cardIndex + 1).map((message) => (
          <View
            key={message.id}
            style={message.side === "left" ? styles.messageLeft : styles.messageRight}
          >
            <Text style={styles.name}>{message.name}</Text>
            <View style={[styles.bubble, message.side === "right" && styles.bubbleRight]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
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

function readMessages(value: unknown): DialogueMessage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((messageValue, index) => {
    const message = readRecord(messageValue);
    const name = readString(message?.name);
    const text = readString(message?.text);
    return name && text
      ? [{ id: readString(message?.id) ?? `message-${index}`, name, text, side: message?.side === "right" ? "right" as const : "left" as const }]
      : [];
  });
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, paddingHorizontal: 8, paddingTop: 6, paddingBottom: 12 },
  messages: { gap: 10 },
  messageLeft: { alignItems: "flex-start" },
  messageRight: { alignItems: "flex-end" },
  name: { marginHorizontal: 10, marginBottom: 3, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 10.5, letterSpacing: 0.5 },
  bubble: { maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderColor: COURSE_EXERCISE_COLORS.border, borderRadius: 18, borderBottomLeftRadius: 6, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  bubbleRight: { borderColor: COURSE_EXERCISE_COLORS.accentLight, borderBottomLeftRadius: 18, borderBottomRightRadius: 6, backgroundColor: COURSE_EXERCISE_COLORS.accentTint },
  messageText: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 14.5, lineHeight: 21 },
  insight: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 20, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4 },
  insightKicker: { marginBottom: 4, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 10.5, letterSpacing: 0.7 },
  insightBody: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 13.5, lineHeight: 20 },
});
