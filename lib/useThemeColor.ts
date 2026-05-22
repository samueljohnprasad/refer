import { useColorScheme } from "react-native";
import { LIGHT_TOKENS, DARK_TOKENS, type ThemeTokens } from "./tokens";

/**
 * Returns theme-resolved token values based on system color scheme.
 * Use for inline style props where className cannot reach (icon color, gradient arrays, etc.).
 * Prefer Tailwind className-based tokens (bg-primary, text-foreground) wherever possible.
 */
export function useThemeColor(): ThemeTokens {
  const scheme = useColorScheme();
  return scheme === "dark" ? DARK_TOKENS : LIGHT_TOKENS;
}
