import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export const guidedRecallChipsStyles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 24,
  },
  questionHeader: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  questionContext: {
    marginBottom: 6,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  questionPrompt: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  chipGrid: {
    gap: 12,
  },
  chipContainer: {
    paddingBottom: 3,
    alignSelf: "stretch",
  },
  chipRim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 3,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.border.default,
  },
  chipSelectedRim: {
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  chip: {
    minHeight: 61,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  selectedChip: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  mutedChip: { opacity: 0.28 },
  pressedChip: { transform: [{ translateY: 3 }] },
  chipNumber: {
    width: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  chipNumberLabel: {
    color: SEMANTIC_COLORS.surface.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
  },
  chipLabel: {
    flex: 1,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 15.5,
    lineHeight: 21,
  },
  selectedLabel: {
    color: SEMANTIC_COLORS.brand.pressed,
  },
});
