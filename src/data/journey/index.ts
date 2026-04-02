/**
 * Journey Mock Data Module
 * Barrel export for all journey mock data, constants, and factories.
 */

// Constants (design tokens, colors, sizing, timing)
export {
  NODE_COLORS,
  PATH_COLORS,
  UNIT_GRADIENTS,
  NODE_SIZE,
  PATH_LAYOUT,
  ANIMATION_TIMING,
  MASCOT_MESSAGES,
} from "./constants";

// Factory functions for DRY node creation
export { createNode, createNodeSequence } from "./nodeFactory";

// Mock data
export { UNIT_1, UNIT_2, UNIT_3, MOCK_UNITS } from "./mockUnits";
export { MOCK_JOURNEY_STATE } from "./mockState";
