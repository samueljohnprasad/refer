import { DynamicColorIOS, OpaqueColorValue } from "react-native";
import { SAGE, NEUTRAL, RED, ORANGE, YELLOW, BLUE, PURPLE, SUCCESS } from "./palette";

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

export const SEMANTIC_COLORS: SemanticColors = {
  text: {
    primary: adaptiveColor({ light: NEUTRAL.ink, dark: "#f0f5f0" }),
    secondary: adaptiveColor({ light: NEUTRAL.inkSoft, dark: "#a0b0a0" }),
    tertiary: adaptiveColor({ light: NEUTRAL.inkMuted, dark: "#5a6a5a" }),
    disabled: adaptiveColor({ light: NEUTRAL.inkMuted, dark: "#5a6a5a" }),
  },
  brand: {
    primary: adaptiveColor({ light: SAGE[500], dark: SAGE[400] }),
    onPrimary: adaptiveColor({ light: NEUTRAL.white, dark: "#1a2a1a" }),
    pressed: adaptiveColor({ light: SAGE[600], dark: SAGE[500] }),
    soft: adaptiveColor({ light: SAGE[100], dark: "#142414" }),
    onSoft: adaptiveColor({ light: SAGE[700], dark: SAGE[300] }),
  },
  surface: {
    canvas: adaptiveColor({ light: NEUTRAL.offWhite, dark: "#0f1a0f" }),
    primary: adaptiveColor({ light: NEUTRAL.white, dark: "#1a2a1a" }),
    secondary: adaptiveColor({ light: NEUTRAL.surface, dark: "#142414" }),
    elevated: adaptiveColor({ light: NEUTRAL.white, dark: "#2a3a2a" }),
  },
  border: {
    default: adaptiveColor({ light: NEUTRAL.border, dark: "#2a3a2a" }),
    strong: adaptiveColor({ light: NEUTRAL.border, dark: "#3a4a3a" }),
    selected: adaptiveColor({ light: SAGE[300], dark: SAGE[500] }),
  },
  selection: {
    surface: adaptiveColor({ light: SAGE[50], dark: "#142414" }),
    border: adaptiveColor({ light: SAGE[300], dark: SAGE[500] }),
    foreground: adaptiveColor({ light: SAGE[700], dark: SAGE[200] }),
    indicator: adaptiveColor({ light: SAGE[500], dark: SAGE[400] }),
  },
  disabled: {
    surface: adaptiveColor({ light: NEUTRAL.surface, dark: "#142414" }),
    border: adaptiveColor({ light: NEUTRAL.border, dark: "#2a3a2a" }),
    foreground: adaptiveColor({ light: NEUTRAL.inkMuted, dark: "#5a6a5a" }),
  },
  success: {
    surface: adaptiveColor({ light: SUCCESS[50], dark: "#0f2e1a" }),
    border: adaptiveColor({ light: SUCCESS[400], dark: SUCCESS[700] }),
    foreground: adaptiveColor({ light: SUCCESS[700], dark: SUCCESS[400] }),
    indicator: adaptiveColor({ light: SUCCESS[600], dark: SUCCESS[600] }),
  },
  error: {
    surface: adaptiveColor({ light: RED.tint, dark: "#2e0f0f" }),
    border: adaptiveColor({ light: RED.light, dark: RED.primary }),
    foreground: adaptiveColor({ light: RED.dark, dark: RED.light }),
    indicator: adaptiveColor({ light: RED.primary, dark: RED.primary }),
  },
  warning: {
    surface: adaptiveColor({ light: ORANGE.tint, dark: "#2e1f0f" }),
    border: adaptiveColor({ light: ORANGE.primary, dark: ORANGE.primary }),
    foreground: adaptiveColor({ light: "#8A4F00", dark: "#FFD299" }),
    indicator: adaptiveColor({ light: "#C76F00", dark: ORANGE.primary }),
  },
  info: {
    surface: adaptiveColor({ light: BLUE.tint, dark: "#0f1f2e" }),
    border: adaptiveColor({ light: BLUE.primary, dark: BLUE.primary }),
    foreground: adaptiveColor({ light: "#006699", dark: "#99D6FF" }),
    indicator: adaptiveColor({ light: BLUE.primary, dark: BLUE.primary }),
  },
  shadow: adaptiveColor({ light: NEUTRAL.black, dark: NEUTRAL.black }),
};
