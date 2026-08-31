import { StyleSheet } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

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
    borderColor: SEMANTIC_COLORS.text.secondary,
    borderRadius: 24,
  },
  trayHint: {
    color: SEMANTIC_COLORS.text.secondary,
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
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  selectedChip: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  mutedChip: { opacity: 0.28, borderBottomWidth: 1 },
  pressedChip: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
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
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 14,
  },
});
