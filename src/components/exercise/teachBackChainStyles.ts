import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export const teachBackChainStyles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 6,
  },
  reference: {
    gap: 3,
    borderLeftWidth: 3,
    borderLeftColor: SEMANTIC_COLORS.border.selected,
    paddingLeft: 12,
  },
  referenceLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  referenceText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  activeSlot: {
    gap: 3,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  slotLabel: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  slotHint: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 19,
  },
  future: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  ready: { paddingVertical: 16 },
  readyText: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  takeaway: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
