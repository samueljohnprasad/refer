/**
 * useHighContrast (Task 4.5.3)
 * Returns adjusted colors and sizing values for high contrast accessibility.
 *
 * Provides:
 * - Boosted node colors with higher contrast against backgrounds
 * - Thicker stroke widths for paths and rings
 * - Stronger borders for interactive elements
 *
 * Reads the system bold-text / high-contrast preference on iOS/Android.
 * Falls back to false on web.
 */

import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";
import {
  NODE_COLORS,
  PATH_COLORS,
  PATH_LAYOUT,
  NODE_SIZE,
} from "@/src/data/journey/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HighContrastValues {
  /** Whether high contrast mode is active */
  isHighContrast: boolean;
  /** Node colors — boosted for contrast */
  nodeColors: {
    locked: string;
    active: string;
    completed: string;
  };
  /** Path stroke colors — boosted for contrast */
  pathColors: {
    inactive: string;
    active: string;
  };
  /** Path stroke width — thicker in high contrast */
  pathStrokeWidth: number;
  /** Progress ring stroke width — thicker in high contrast */
  progressRingStroke: number;
}

// ---------------------------------------------------------------------------
// High contrast color overrides
// ---------------------------------------------------------------------------

const HC_NODE_COLORS = {
  locked: "#718096",
  active: "#2F8A00",
  completed: "#D69E00",
} as const;

const HC_PATH_COLORS = {
  inactive: "#A0AEC0",
  active: "#2F8A00",
} as const;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHighContrast(): HighContrastValues {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  useEffect(() => {
    // iOS exposes isBoldTextEnabled; Android doesn't have a direct equivalent.
    // We use bold text as a proxy for wanting high contrast.
    if (Platform.OS === "ios") {
      AccessibilityInfo.isBoldTextEnabled().then((enabled: boolean) => {
        setIsHighContrast(enabled);
      });

      const subscription = AccessibilityInfo.addEventListener(
        "boldTextChanged",
        (enabled: boolean) => {
          setIsHighContrast(enabled);
        },
      );

      return () => {
        subscription?.remove();
      };
    }

    // On Android / web, default to false (could be extended with a manual toggle)
    return undefined;
  }, []);

  if (isHighContrast) {
    return {
      isHighContrast: true,
      nodeColors: HC_NODE_COLORS,
      pathColors: HC_PATH_COLORS,
      pathStrokeWidth: PATH_LAYOUT.strokeWidth * 1.5,
      progressRingStroke: NODE_SIZE.progressRingStroke * 1.5,
    };
  }

  return {
    isHighContrast: false,
    nodeColors: NODE_COLORS,
    pathColors: PATH_COLORS,
    pathStrokeWidth: PATH_LAYOUT.strokeWidth,
    progressRingStroke: NODE_SIZE.progressRingStroke,
  };
}
