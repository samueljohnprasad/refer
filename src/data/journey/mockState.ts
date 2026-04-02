/**
 * Journey Mock State
 * Complete JourneyState for initial app load and testing.
 * Composes mock units with user stats.
 */

import { JourneyState } from "@/src/types/journey";
import { MOCK_UNITS } from "./mockUnits";

/** Default mock journey state with realistic user progress */
export const MOCK_JOURNEY_STATE: JourneyState = {
  currentUnit: 0,
  units: MOCK_UNITS,
  lastActiveNodeId: "node_3",
  stats: {
    streakDays: 12,
    wallet: {
      coins: 350,
      gems: 500,
    },
    hearts: 5,
    totalXP: 1250,
  },
};
