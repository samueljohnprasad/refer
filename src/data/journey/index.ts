/**
 * Journey Data Module
 * Barrel export for all journey data: config, constants, factories, and registries.
 */

// Config-driven system (new — replaces hardcoded constants for components)
export { DEFAULT_JOURNEY_CONFIG } from "./journeyConfig";
export { SVG_REGISTRY, getSvg } from "./svgRegistry";

// Constants (design tokens, colors, sizing, timing)
// NOTE: These are kept for backward compat. New components should use
// JourneyConfig via context instead of importing these directly.
export {
  NODE_COLORS,
  PATH_COLORS,
  UNIT_GRADIENTS,
  NODE_SIZE,
  PATH_LAYOUT,
  ANIMATION_TIMING,
  MASCOT_MESSAGES,
} from "./constants";

// Factory functions for DRY node creation (legacy — prefer configResolver)
export { createNode, createNodeSequence } from "./nodeFactory";

// Mock data (legacy — prefer config-driven resolution)
export { UNIT_1, UNIT_2, UNIT_3, MOCK_UNITS } from "./mockUnits";
export { MOCK_JOURNEY_STATE } from "./mockState";
