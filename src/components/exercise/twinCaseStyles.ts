import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";

export const twinCaseStyles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  columns: { flexDirection: "row", gap: 10 },
  status: {
    marginTop: 12,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
  },
  statusError: {
    color: SEMANTIC_COLORS.error.foreground,
  },
  reveal: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 28,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  revealTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 19,
    lineHeight: 24,
  },
  revealBody: {
    marginTop: 7,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  next: {
    marginTop: 10,
    color: SEMANTIC_COLORS.brand.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
