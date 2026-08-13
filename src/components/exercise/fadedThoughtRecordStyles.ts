import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

export const fadedThoughtRecordStyles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 6,
  },
  exampleHeader: { gap: 4 },
  exampleLabel: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 19,
  },
  context: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  notebook: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 16,
    backgroundColor: COURSE_EXERCISE_COLORS.background,
  },
  fieldRow: {
    minHeight: 64,
    justifyContent: "center",
    gap: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COURSE_EXERCISE_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  activeField: {
    borderLeftWidth: 4,
    borderLeftColor: COURSE_EXERCISE_COLORS.accent,
    paddingLeft: 12,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  fieldLabel: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    lineHeight: 18,
  },
  activeFieldLabel: { color: COURSE_EXERCISE_COLORS.accentDark },
  fieldValue: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
  pendingValue: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
  },
  insight: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 21,
    lineHeight: 27,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  activeRegion: { gap: 14 },
});
