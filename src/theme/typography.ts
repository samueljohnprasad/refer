import { Nunito_400Regular } from "@expo-google-fonts/nunito/400Regular";
import { Nunito_400Regular_Italic } from "@expo-google-fonts/nunito/400Regular_Italic";
import { Nunito_500Medium } from "@expo-google-fonts/nunito/500Medium";
import { Nunito_500Medium_Italic } from "@expo-google-fonts/nunito/500Medium_Italic";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito/600SemiBold";
import { Nunito_600SemiBold_Italic } from "@expo-google-fonts/nunito/600SemiBold_Italic";
import { Nunito_700Bold } from "@expo-google-fonts/nunito/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";

export const APP_FONT_FAMILY = "Nunito" as const;
export const DISPLAY_FONT_FAMILY = "Fredoka" as const;

export const APP_FONT_FAMILIES = {
  // Brand Happy UI faces (matching .agents/happy-ui.css)
  display: "Fredoka",
  body: "Nunito",
  fredoka: "Fredoka",
  nunito: "Nunito",

  // Specific weights
  regular: "NunitoRegular",
  regularItalic: "NunitoRegularItalic",
  medium: "NunitoMedium",
  mediumItalic: "NunitoMediumItalic",
  semiBold: "NunitoSemiBold",
  semiBoldItalic: "NunitoSemiBoldItalic",
  bold: "NunitoBold",
  extraBold: "NunitoExtraBold",

  // Display specific
  displayRegular: "FredokaRegular",
  displayMedium: "FredokaMedium",
  displaySemiBold: "FredokaSemiBold",
  displayBold: "FredokaBold",
} as const;

export const APP_FONT_SOURCES = {
  // Fredoka (Display face from happy-ui.css, default 600 weight)
  Fredoka: Fredoka_600SemiBold,
  FredokaRegular: Fredoka_400Regular,
  FredokaMedium: Fredoka_500Medium,
  FredokaSemiBold: Fredoka_600SemiBold,
  FredokaBold: Fredoka_700Bold,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,

  // Nunito (Body face from happy-ui.css, default 500 weight)
  Nunito: Nunito_500Medium,
  NunitoRegular: Nunito_400Regular,
  NunitoRegularItalic: Nunito_400Regular_Italic,
  NunitoMedium: Nunito_500Medium,
  NunitoMediumItalic: Nunito_500Medium_Italic,
  NunitoSemiBold: Nunito_600SemiBold,
  NunitoSemiBoldItalic: Nunito_600SemiBold_Italic,
  NunitoBold: Nunito_700Bold,
  NunitoExtraBold: Nunito_800ExtraBold,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_500Medium,
  Nunito_500Medium_Italic,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} as const;

export const APP_FONT_ASSETS = {
  regular: Nunito_400Regular,
  medium: Nunito_500Medium,
  semiBold: Nunito_600SemiBold,
  bold: Nunito_700Bold,
  extraBold: Nunito_800ExtraBold,
  display: Fredoka_600SemiBold,
} as const;

export const APP_NAVIGATION_FONTS = {
  regular: {
    fontFamily: APP_FONT_FAMILIES.regular,
    fontWeight: "400",
  },
  medium: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontWeight: "600",
  },
  bold: {
    fontFamily: APP_FONT_FAMILIES.bold,
    fontWeight: "700",
  },
  heavy: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontWeight: "800",
  },
} as const;

// ponytail: Happy UI typography tokens matching .agents/happy-ui.css
export const TYPOGRAPHY_SIZES = {
  cap: 12,    // tags, tiny meta
  foot: 13,   // captions, labels, help text
  sub: 15,    // secondary lines under a title
  body: 17,   // chat lines, rows, fields
  lead: 20,   // section headers, Happi's key statement
  h: 24,      // completion and sheet headlines
  title: 28,  // screen title, display face
  num: 34,    // hero numerals (count, stat), display face
} as const;

export const TYPOGRAPHY_WEIGHTS = {
  body: "500" as const,
  display: "600" as const,
  strong: "700" as const,
} as const;

export const TYPOGRAPHY_LINE_HEIGHTS = {
  tight: 1.2,
  body: 1.45,
} as const;
