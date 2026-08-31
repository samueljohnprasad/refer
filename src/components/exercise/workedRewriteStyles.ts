import { StyleSheet } from "react-native";
import { COURSE_EXERCISE_FONTS , SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export const workedRewriteStyles = StyleSheet.create({
  screen: { flex: 1, gap: 16, paddingHorizontal: 10, paddingTop: 6, paddingBottom: 12 },
  reference: { gap: 5, borderRadius: 14, padding: 14, backgroundColor: SEMANTIC_COLORS.surface.secondary },
  referenceLabel: { color: SEMANTIC_COLORS.text.secondary, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 12 },
  referenceText: { color: SEMANTIC_COLORS.text.secondary, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 15, lineHeight: 21 },
  completedSteps: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  completedStep: { color: SEMANTIC_COLORS.brand.pressed, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 13 },
  working: { gap: 6 },
  workingLabel: { color: SEMANTIC_COLORS.text.secondary, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 12 },
  workingText: { color: SEMANTIC_COLORS.text.primary, fontFamily: COURSE_EXERCISE_FONTS.heading, fontSize: 22, lineHeight: 29 },
  changedPhrase: { color: SEMANTIC_COLORS.brand.pressed, fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
  activeRegion: { gap: 14 },
});
