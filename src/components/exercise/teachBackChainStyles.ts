import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

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
    borderLeftColor: COURSE_EXERCISE_COLORS.accentLight,
    paddingLeft: 12,
  },
  referenceLabel: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  referenceText: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  activeSlot: {
    gap: 3,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COURSE_EXERCISE_COLORS.surfaceMuted,
  },
  slotLabel: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  slotHint: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 19,
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
  takeaway: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
