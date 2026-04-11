/**
 * Journey Unit Types
 * A unit is a section/chapter containing multiple path nodes.
 */

import { UnitColorScheme, MascotSide } from "./enums";
import { PathNodeData } from "./node";

/** Where to place the mascot character along the path */
export interface MascotPlacement {
  /** Show mascot after this node index */
  afterNodeIndex: number;
  /** Which side of the path to place the mascot */
  position: MascotSide;
  /** Optional message the mascot displays */
  message?: string;
}

/** A unit (section) containing multiple nodes */
export interface UnitData {
  id: string;
  sectionId?: string;
  sectionNumber?: number;
  unitNumber: number;
  globalUnitNumber?: number;
  title: string;
  description: string;
  colorScheme: UnitColorScheme;
  nodes: PathNodeData[];
  mascotPlacements: MascotPlacement[];
}
