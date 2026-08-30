import { Nunito_400Regular } from "@expo-google-fonts/nunito/400Regular";
import { Nunito_400Regular_Italic } from "@expo-google-fonts/nunito/400Regular_Italic";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito/600SemiBold";
import { Nunito_600SemiBold_Italic } from "@expo-google-fonts/nunito/600SemiBold_Italic";
import { Nunito_700Bold } from "@expo-google-fonts/nunito/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";

export const APP_FONT_FAMILY = "Nunito" as const;

export const APP_FONT_FAMILIES = {
  regular: "NunitoRegular",
  regularItalic: "NunitoRegularItalic",
  semiBold: "NunitoSemiBold",
  semiBoldItalic: "NunitoSemiBoldItalic",
  bold: "NunitoBold",
  extraBold: "NunitoExtraBold",
} as const;

export const APP_FONT_SOURCES = {
  [APP_FONT_FAMILIES.regular]: Nunito_400Regular,
  [APP_FONT_FAMILIES.regularItalic]: Nunito_400Regular_Italic,
  [APP_FONT_FAMILIES.semiBold]: Nunito_600SemiBold,
  [APP_FONT_FAMILIES.semiBoldItalic]: Nunito_600SemiBold_Italic,
  [APP_FONT_FAMILIES.bold]: Nunito_700Bold,
  [APP_FONT_FAMILIES.extraBold]: Nunito_800ExtraBold,
} as const;

export const APP_FONT_ASSETS = {
  regular: Nunito_400Regular,
  semiBold: Nunito_600SemiBold,
  bold: Nunito_700Bold,
  extraBold: Nunito_800ExtraBold,
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
