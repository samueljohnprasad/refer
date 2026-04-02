/**
 * Journey State Types
 * Top-level state shape for the journey map feature.
 * Reuses UserWallet from the existing rewards system.
 */

import { UserWallet } from "../rewards";
import { UnitData } from "./unit";

/** User stats displayed in the journey header */
export interface JourneyStats {
  streakDays: number;
  wallet: UserWallet;
  hearts: number;
  totalXP: number;
}

/** Complete journey state for a user */
export interface JourneyState {
  currentUnit: number;
  units: UnitData[];
  lastActiveNodeId: string;
  stats: JourneyStats;
}
