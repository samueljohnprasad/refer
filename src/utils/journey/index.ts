/**
 * Journey Map Utilities
 * Barrel export for all journey calculation utilities.
 */

// Position calculation (sine wave zigzag)
export { getNodePosition, getAllNodePositions } from "./positionCalculator";
export type { WaveConfig } from "./positionCalculator";

// SVG path building (Bézier curves)
export {
  buildPathD,
  buildPartialPathD,
  approximatePathLength,
  approximateSegmentLength,
} from "./pathBuilder";

// Container dimensions
export { calculatePathDimensions } from "./dimensions";
export type { PathDimensions } from "./dimensions";

// Template + progress merge (multi-journey)
export { mergeJourneyState, createInitialProgress } from "./mergeJourneyState";

// FlashList pre-computation (segment-per-cell)
export {
  buildJourneyNodes,
  findActiveNodeIndex,
  updateNodeStatus,
} from "./buildJourneyNodes";
export type { BuildJourneyNodesInput } from "./buildJourneyNodes";


