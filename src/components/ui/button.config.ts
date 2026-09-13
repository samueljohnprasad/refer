import { type ReactElement } from "react";
import { type ColorValue } from "react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export type Variant =
  | "primary"
  | "secondary"
  | "correct"
  | "incorrect"
  | "destructive"
  | "premium"
  | "streak"
  | "ghost"
  | "pill"
  | "danger";

export interface VariantConfig {
  faceColor: ColorValue;
  rimColor: ColorValue;
  labelColor: ColorValue;
  disabledFaceColor: ColorValue;
  disabledRimColor: ColorValue;
  disabledLabelColor?: ColorValue;
  faceStrokeColor?: ColorValue;
  faceStrokeWidth?: number;
}

export const VARIANTS: Record<Exclude<Variant, "ghost">, VariantConfig> = {
  primary: {
    faceColor: SEMANTIC_COLORS.brand.primary,
    rimColor: SEMANTIC_COLORS.brand.onSoft,
    labelColor: SEMANTIC_COLORS.surface.primary,
    disabledFaceColor: "#F3F6FA",
    disabledRimColor: "#E9EEF5",
    disabledLabelColor: "#64748B",
  },
  secondary: {
    faceColor: SEMANTIC_COLORS.surface.primary,
    rimColor: SEMANTIC_COLORS.border.default,
    labelColor: SEMANTIC_COLORS.text.primary,
    faceStrokeColor: SEMANTIC_COLORS.border.default,
    faceStrokeWidth: 2,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#E5E5E5",
  },
  correct: {
    faceColor: SEMANTIC_COLORS.info.surface,
    rimColor: SEMANTIC_COLORS.info.indicator,
    labelColor: "#0A7DB8",
    disabledFaceColor: "#F0F9FF",
    disabledRimColor: "#A0D8F8",
  },
  incorrect: {
    faceColor: SEMANTIC_COLORS.error.surface,
    rimColor: SEMANTIC_COLORS.error.foreground,
    labelColor: "#D10000",
    disabledFaceColor: "#FFF0F0",
    disabledRimColor: "#FFA0A0",
  },
  destructive: {
    faceColor: SEMANTIC_COLORS.surface.primary,
    rimColor: SEMANTIC_COLORS.error.foreground,
    labelColor: SEMANTIC_COLORS.error.foreground,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#FFA0A0",
  },
  danger: {
    faceColor: SEMANTIC_COLORS.error.foreground,
    rimColor: "#C1272D",
    labelColor: SEMANTIC_COLORS.surface.primary,
    disabledFaceColor: "#FFF0F0",
    disabledRimColor: "#FFA0A0",
  },
  premium: {
    faceColor: "#9B59B6",
    rimColor: "#7B3AAD",
    labelColor: SEMANTIC_COLORS.surface.primary,
    disabledFaceColor: "#E8D4FF",
    disabledRimColor: "#B880D8",
  },
  streak: {
    faceColor: SEMANTIC_COLORS.warning.foreground,
    rimColor: "#C89400",
    labelColor: SEMANTIC_COLORS.text.primary,
    disabledFaceColor: "#FFF5D6",
    disabledRimColor: "#E0C060",
  },
  pill: {
    faceColor: SEMANTIC_COLORS.surface.primary,
    rimColor: SEMANTIC_COLORS.border.strong,
    labelColor: SEMANTIC_COLORS.text.primary,
    disabledFaceColor: "#F7F7F7",
    disabledRimColor: "#E5E5E5",
  },
};

export type Size = "sm" | "md" | "lg" | "xl" | "option";

export interface SizeConfig {
  height: number;
  radius: number;
  pressDepth: number;
  labelSize: number;
  defaultWidth: number;
}

export const SIZES: Record<Size, SizeConfig> = {
  sm: { height: 44, radius: 22, pressDepth: 3, labelSize: 15, defaultWidth: 120 },
  md: { height: 48, radius: 22, pressDepth: 4, labelSize: 16, defaultWidth: 150 },
  lg: { height: 56, radius: 22, pressDepth: 4, labelSize: 17, defaultWidth: 200 },
  xl: { height: 80, radius: 40, pressDepth: 6, labelSize: 20, defaultWidth: 80 },
  option: { height: 52, radius: 12, pressDepth: 4, labelSize: 16, defaultWidth: 300 },
};

export interface ButtonProps {
  label?: string;
  variant?: Variant;
  size?: Size;
  round?: boolean;
  height?: number;
  fullWidth?: boolean;
  width?: number;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  accessibilityLabel?: string;
  haptic?: "none" | "light" | "medium";
  className?: string;
  labelClassName?: string;
}
