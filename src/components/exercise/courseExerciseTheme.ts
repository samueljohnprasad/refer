// Re-exporting semantic colors and adaptive color from the centralized theme
export { SEMANTIC_COLORS, adaptiveColor } from "../../theme/colors";
export type { SemanticColors } from "../../theme/colors";

export const COURSE_EXERCISE_FONTS = {
  display: "NunitoExtraBold",
  heading: "NunitoBold",
  headingLight: "NunitoRegular",
  headingItalic: "NunitoSemiBoldItalic",
  body: "NunitoRegular",
  bodyMedium: "NunitoSemiBold",
  bodyBold: "NunitoBold",
  bodyMono: "NunitoRegular",
} as const;
