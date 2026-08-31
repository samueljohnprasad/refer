import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

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
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 19,
  },
  context: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  notebook: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 16,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  fieldRow: {
    minHeight: 64,
    justifyContent: "center",
    gap: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SEMANTIC_COLORS.border.default,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  activeField: {
    borderLeftWidth: 4,
    borderLeftColor: SEMANTIC_COLORS.brand.primary,
    paddingLeft: 12,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  fieldLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    lineHeight: 18,
  },
  activeFieldLabel: { color: SEMANTIC_COLORS.brand.pressed },
  fieldValue: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
  pendingValue: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
  },
  insight: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 21,
    lineHeight: 27,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  activeRegion: { gap: 14 },
});
