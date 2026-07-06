import { DEFAULT_JOURNEY_CONFIG } from "@/src/data/journey";

const DEFAULT_UNIT_GRADIENT = ["#4CAF50", "#388E3C"] as const;

type RenderedSectionHeader = {
  orderIndex: number;
} | null;

type RenderedUnitHeader = {
  colorThemeKey: string;
  iconKey: string | null;
  title: string;
  unitNumber: number;
} | null;

type JourneyMapHeaderState = {
  faceColor: string;
  iconKey: string | null;
  label: string;
  rimColor: string;
  title: string;
};

export function getJourneyMapHeaderState(
  renderedSection: RenderedSectionHeader,
  renderedUnit: RenderedUnitHeader,
): JourneyMapHeaderState {
  const themeKey = renderedUnit?.colorThemeKey ?? "green";
  const theme = DEFAULT_JOURNEY_CONFIG.colorThemes[themeKey] ?? DEFAULT_JOURNEY_CONFIG.colorThemes.green;
  const [faceColor, rimColor] = theme.headerGradient;

  return {
    faceColor,
    iconKey: renderedUnit?.iconKey ?? null,
    label: getJourneyMapHeaderLabel(renderedSection, renderedUnit),
    rimColor,
    title: renderedUnit?.title ?? "Select a section",
  };
}

function getJourneyMapHeaderLabel(
  renderedSection: RenderedSectionHeader,
  renderedUnit: RenderedUnitHeader,
): string {
  if (!renderedSection) {
    return "Journey";
  }

  if (!renderedUnit) {
    return `Section ${renderedSection.orderIndex}`;
  }

  return `Section ${renderedSection.orderIndex} • Unit ${renderedUnit.unitNumber}`;
}
