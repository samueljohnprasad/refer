import { DynamicColorIOS } from "react-native";
import {
  BRAND_BORDER,
  BRAND_DARK,
  BRAND_SURFACE,
  INK,
  SAGE,
  THEME,
} from "@/lib/tokens";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

function adaptiveColor(light: string, dark: string) {
  return DynamicColorIOS({ light, dark }) as unknown as string;
}

export const COURSE_EXERCISE_COLORS = {
  background: adaptiveColor(THEME.backgroundPrimary, BRAND_DARK.canvas),
  surface: adaptiveColor(BRAND_SURFACE, BRAND_DARK.surface),
  surfaceMuted: adaptiveColor(SAGE[100], BRAND_DARK.surfaceSoft),
  ink: adaptiveColor(INK, BRAND_DARK.ink),
  inkSoft: adaptiveColor(SAGE[600], BRAND_DARK.inkSoft),
  border: adaptiveColor(BRAND_BORDER, BRAND_DARK.border),
  shadow: adaptiveColor(SAGE[800], "#000000"),
  accent: SAGE[500],
  accentDark: adaptiveColor(SAGE[700], SAGE[200]),
  accentLight: adaptiveColor(SAGE[200], SAGE[700]),
  accentTint: adaptiveColor(SAGE.selected, BRAND_DARK.surfaceSoft),
  error: adaptiveColor("#A84432", "#FF9B87"),
  errorTint: adaptiveColor("#FFF0EA", "#3A211D"),
} as const;

export const COURSE_EXERCISE_FONTS = {
  body: APP_FONT_FAMILIES.regular,
  bodyMedium: APP_FONT_FAMILIES.semiBold,
  bodyBold: APP_FONT_FAMILIES.bold,
  heading: APP_FONT_FAMILIES.extraBold,
  display: APP_FONT_FAMILIES.extraBold,
} as const;
