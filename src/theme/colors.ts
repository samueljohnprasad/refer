import { DynamicColorIOS, OpaqueColorValue } from "react-native";
import { SAGE, NEUTRAL, EXERCISE_HUES, WEATHER } from "./palette";

export interface AdaptiveColorInput {
  light: string | OpaqueColorValue;
  dark: string | OpaqueColorValue;
  highContrastLight?: string | OpaqueColorValue;
  highContrastDark?: string | OpaqueColorValue;
}

export function adaptiveColor({
  light,
  dark,
  highContrastLight,
  highContrastDark,
}: AdaptiveColorInput) {
  return DynamicColorIOS({
    light,
    dark,
    highContrastLight: highContrastLight ?? light,
    highContrastDark: highContrastDark ?? dark,
  });
}

export type SemanticColors = {
  text: {
    primary: string | OpaqueColorValue;
    secondary: string | OpaqueColorValue;
    tertiary: string | OpaqueColorValue;
    disabled: string | OpaqueColorValue;
  };
  brand: {
    primary: string | OpaqueColorValue;
    onPrimary: string | OpaqueColorValue;
    pressed: string | OpaqueColorValue;
    soft: string | OpaqueColorValue;
    onSoft: string | OpaqueColorValue;
  };
  surface: {
    canvas: string | OpaqueColorValue;
    primary: string | OpaqueColorValue;
    secondary: string | OpaqueColorValue;
    elevated: string | OpaqueColorValue;
  };
  border: {
    default: string | OpaqueColorValue;
    strong: string | OpaqueColorValue;
    selected: string | OpaqueColorValue;
  };
  selection: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
    indicator: string | OpaqueColorValue;
  };
  disabled: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
  };
  success: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
    indicator: string | OpaqueColorValue;
  };
  error: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
    indicator: string | OpaqueColorValue;
  };
  warning: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
    indicator: string | OpaqueColorValue;
  };
  info: {
    surface: string | OpaqueColorValue;
    border: string | OpaqueColorValue;
    foreground: string | OpaqueColorValue;
    indicator: string | OpaqueColorValue;
  };
  shadow: string | OpaqueColorValue;
};

// ponytail: Happy UI semantic color tokens mapping to SAGE and NEUTRAL
export const SEMANTIC_COLORS: SemanticColors = {
  text: {
    primary: adaptiveColor({ light: NEUTRAL.label, dark: "#f0f5f0" }),
    secondary: adaptiveColor({ light: NEUTRAL.label2, dark: "#a0b0a0" }),
    tertiary: adaptiveColor({ light: NEUTRAL.label3, dark: "#767676" }),
    disabled: adaptiveColor({ light: NEUTRAL.label3, dark: "#767676" }),
  },
  brand: {
    primary: adaptiveColor({ light: SAGE.accent, dark: SAGE[400] }),
    onPrimary: adaptiveColor({ light: NEUTRAL.white, dark: "#1a2a1a" }),
    pressed: adaptiveColor({ light: SAGE.ink, dark: SAGE[500] }),
    soft: adaptiveColor({ light: SAGE.tint, dark: "#142414" }),
    onSoft: adaptiveColor({ light: SAGE.accent, dark: SAGE[300] }),
  },
  surface: {
    canvas: adaptiveColor({ light: NEUTRAL.white, dark: "#0f1a0f" }),
    primary: adaptiveColor({ light: NEUTRAL.white, dark: "#1a2a1a" }),
    secondary: adaptiveColor({ light: NEUTRAL.surface, dark: "#142414" }),
    elevated: adaptiveColor({ light: NEUTRAL.white, dark: "#2a3a2a" }),
  },
  border: {
    default: adaptiveColor({ light: NEUTRAL.sep, dark: "#2a3a2a" }),
    strong: adaptiveColor({ light: NEUTRAL.rim, dark: "#3a4a3a" }),
    selected: adaptiveColor({ light: SAGE.ink, dark: SAGE[500] }),
  },
  selection: {
    surface: adaptiveColor({ light: SAGE.tint, dark: "#142414" }),
    border: adaptiveColor({ light: SAGE.ink, dark: SAGE[500] }),
    foreground: adaptiveColor({ light: SAGE.accent, dark: SAGE[200] }),
    indicator: adaptiveColor({ light: SAGE.ink, dark: SAGE[400] }),
  },
  disabled: {
    surface: adaptiveColor({ light: NEUTRAL.surface, dark: "#142414" }),
    border: adaptiveColor({ light: NEUTRAL.border, dark: "#2a3a2a" }),
    foreground: adaptiveColor({ light: NEUTRAL.label3, dark: "#767676" }),
  },
  success: {
    surface: adaptiveColor({ light: SAGE.tint, dark: "#0f2e1a" }),
    border: adaptiveColor({ light: SAGE[400], dark: SAGE[700] }),
    foreground: adaptiveColor({ light: SAGE[700], dark: SAGE[400] }),
    indicator: adaptiveColor({ light: SAGE[600], dark: SAGE[600] }),
  },
  error: {
    surface: adaptiveColor({ light: EXERCISE_HUES.act, dark: "#2e0f0f" }),
    border: adaptiveColor({ light: "#ff9090", dark: "#ff4b4b" }),
    foreground: adaptiveColor({ light: "#c73030", dark: "#ff9090" }),
    indicator: adaptiveColor({ light: "#ff4b4b", dark: "#ff4b4b" }),
  },
  warning: {
    surface: adaptiveColor({ light: EXERCISE_HUES.reframe, dark: "#2e1f0f" }),
    border: adaptiveColor({ light: WEATHER.sun, dark: WEATHER.sun }),
    foreground: adaptiveColor({ light: "#8a4f00", dark: "#ffd299" }),
    indicator: adaptiveColor({ light: WEATHER.sun, dark: WEATHER.sun }),
  },
  info: {
    surface: adaptiveColor({ light: EXERCISE_HUES.abc, dark: "#0f1f2e" }),
    border: adaptiveColor({ light: "#62a0ea", dark: "#1c71d8" }),
    foreground: adaptiveColor({ light: "#1c71d8", dark: "#99d6ff" }),
    indicator: adaptiveColor({ light: "#1c71d8", dark: "#1c71d8" }),
  },
  shadow: adaptiveColor({ light: NEUTRAL.sep, dark: "#000000" }),
};
