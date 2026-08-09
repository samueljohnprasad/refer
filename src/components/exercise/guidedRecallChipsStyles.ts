import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

export const guidedRecallChipsStyles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  tray: {
    minHeight: 92,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COURSE_EXERCISE_COLORS.inkSoft,
    borderRadius: 24,
  },
  trayHint: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pool: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 9,
    marginTop: 14,
  },
  chip: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 22,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  selectedChip: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  mutedChip: { opacity: 0.28, borderBottomWidth: 1 },
  pressedChip: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  chipNumber: {
    width: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COURSE_EXERCISE_COLORS.accent,
  },
  chipNumberLabel: {
    color: COURSE_EXERCISE_COLORS.surface,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
  },
  chipLabel: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 14,
  },
});
