/**
 * JourneyConfigContext
 * Provides the JourneyConfig object to all journey components via context.
 *
 * Components read config via useJourneyConfig() hook instead of
 * importing constants directly. This enables:
 * - Zero hardcoded values in components
 * - Future: remote config fetching / A-B testing
 * - Hot-swappable config at runtime
 */

import React, { useContext } from "react";
import {
  ColorThemeConfig,
  JourneyConfig,
  JourneySettingsConfig,
  NodeVariantConfig,
  SectionConfig,
  UnitConfig,
} from "../types/journey";
import { DEFAULT_JOURNEY_CONFIG } from "../data/journey";
// ---------------------------------------------------------------------------
// Primary hook — full config
// ---------------------------------------------------------------------------

/** Access the full JourneyConfig object. Returns the static default config. */
export function useJourneyConfig(): JourneyConfig {
  return DEFAULT_JOURNEY_CONFIG;
}

// ---------------------------------------------------------------------------
// Convenience hooks — typed lookups with error messages
// ---------------------------------------------------------------------------

/** Look up a node variant by key. Throws if key is missing. */
export function useNodeVariant(variantKey: string): NodeVariantConfig {
  const config: JourneyConfig = useJourneyConfig();
  const variant: NodeVariantConfig | undefined =
    config.nodeVariants[variantKey];
  if (!variant) {
    throw new Error(
      `[JourneyConfig] Unknown node variant key: "${variantKey}". ` +
        `Available: ${Object.keys(config.nodeVariants).join(", ")}`,
    );
  }
  return variant;
}

/** Look up a color theme by key. Throws if key is missing. */
export function useColorTheme(themeKey: string): ColorThemeConfig {
  const config: JourneyConfig = useJourneyConfig();
  const theme: ColorThemeConfig | undefined = config.colorThemes[themeKey];
  if (!theme) {
    throw new Error(
      `[JourneyConfig] Unknown color theme key: "${themeKey}". ` +
        `Available: ${Object.keys(config.colorThemes).join(", ")}`,
    );
  }
  return theme;
}

/** Look up a section by ID. Throws if ID is missing. */
export function useSectionConfig(sectionId: string): SectionConfig {
  const config: JourneyConfig = useJourneyConfig();
  const section: SectionConfig | undefined = config.sections.find(
    (s: SectionConfig) => s.id === sectionId,
  );
  if (!section) {
    throw new Error(
      `[JourneyConfig] Unknown section ID: "${sectionId}". ` +
        `Available: ${config.sections.map((s: SectionConfig) => s.id).join(", ")}`,
    );
  }
  return section;
}

/** Look up a unit config by ID. Throws if ID is missing. */
export function useUnitConfig(unitId: string): UnitConfig {
  const config: JourneyConfig = useJourneyConfig();
  const unit: UnitConfig | undefined = config.units.find(
    (u: UnitConfig) => u.id === unitId,
  );
  if (!unit) {
    throw new Error(
      `[JourneyConfig] Unknown unit ID: "${unitId}". ` +
        `Available: ${config.units.map((u: UnitConfig) => u.id).join(", ")}`,
    );
  }
  return unit;
}

/** Resolve a mascot message key to its string. Returns key itself if not found. */
export function useMascotMessage(messageKey: string): string {
  const config: JourneyConfig = useJourneyConfig();
  return config.mascotMessages[messageKey] ?? messageKey;
}

/** Access global journey layout settings. */
export function useJourneySettings(): JourneySettingsConfig {
  const config: JourneyConfig = useJourneyConfig();
  return config.settings;
}
