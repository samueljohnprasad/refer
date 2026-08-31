// Re-exporting semantic colors and adaptive color from the centralized theme
export { SEMANTIC_COLORS, adaptiveColor } from "../../theme/colors";
export type { SemanticColors } from "../../theme/colors";

export const COURSE_EXERCISE_FONTS = {
  heading: "CormorantGaramond_600SemiBold",
  headingLight: "CormorantGaramond_400Regular",
  headingItalic: "CormorantGaramond_600SemiBold_Italic",
  body: "Geist_400Regular",
  bodyMedium: "Geist_500Medium",
  bodyBold: "Geist_600SemiBold",
  bodyMono: "GeistMono_400Regular",
} as const;
