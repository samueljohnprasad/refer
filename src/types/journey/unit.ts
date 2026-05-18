/**
 * Journey Unit Types
 * A unit is a section/chapter containing multiple path nodes.
 */

import { MascotSide } from "./enums";
import { PathNodeData } from "./node";

/** Where to place the mascot character along the path */
export interface MascotPlacement {
  /** Show mascot after this node index */
  afterNodeIndex: number;
  /** Which side of the path to place the mascot */
  side: MascotSide;
  /** Key into the mascot message registry, or a literal string */
  messageKey?: string;
  /** Image key for the mascot avatar (e.g. 'panda-writing') */
  imageKey?: string;
  /** Avatar render size in dp */
  avatarSize?: number;
  /** Vertical offset from node centre-line in dp */
  offsetY?: number;
  /** Horizontal offset from the node's center, in dp */
  offsetX?: number;
}

/** A unit (section) containing multiple nodes */
export interface UnitData {
  id: string;
  sectionId: string;
  sectionNumber: number;
  unitNumber: number;
  globalUnitNumber: number;
  title: string;
  description: string;
  iconKey?: string | null;
  /** Color theme key (e.g. 'green', 'blue', 'purple', 'orange') */
  colorScheme: string;
  nodes: PathNodeData[];
  mascotPlacements: MascotPlacement[];
}
