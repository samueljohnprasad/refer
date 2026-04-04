/**
 * Journey Mock Unit Data
 * Realistic mock units using the nodeFactory for DRY node creation.
 * Each unit represents a section with varied node types and states.
 */



import { MascotSide, NodeIcon, NodeStatus, NodeType, UnitColorScheme } from "@/src/types/journey/enums";
import { createNodeSequence } from "./nodeFactory";
import { UnitData } from "@/src/types/journey/unit";

/** Unit 1: Basics — 3 completed, 1 active, 4 locked (8 total) */
export const UNIT_1: UnitData = {
  id: "11000000-0000-0000-0000-000000000001",
  unitNumber: 1,
  title: "Unit 1",
  description: "Use basic phrases, greet people",
  colorScheme: UnitColorScheme.GREEN,
  nodes: createNodeSequence(
    [
      { type: NodeType.LESSON },
      { type: NodeType.LESSON },
      { type: NodeType.CHECKPOINT },
      { type: NodeType.LESSON, overrides: { progress: 0.75 } },
      { type: NodeType.LESSON , overrides: { progress: 0.75 }},
      { type: NodeType.CHEST },
      { type: NodeType.LESSON },
      { type: NodeType.CHECKPOINT },
    ],
    0, // 3 nodes completed → node[3] is active
  ),
  mascotPlacements: [
    {
      afterNodeIndex: 3,
      position: MascotSide.RIGHT,
      message: "Great job! Keep going! 🎉",
    },
    {
      afterNodeIndex: 5,
      position: MascotSide.LEFT,
      message: "You're on fire! 🔥",
    },
  ],
};

/** Unit 2: Intermediate — All locked (7 total) */
export const UNIT_2: UnitData = {
  id: "22000000-0000-0000-0000-000000000002",
  unitNumber: 2,
  title: "Unit 2",
  description: "Order food and drink, describe your family",
  colorScheme: UnitColorScheme.BLUE,
  nodes: createNodeSequence(
    [
      { type: NodeType.LESSON },
      { type: NodeType.LESSON },
      { type: NodeType.LESSON },
      { type: NodeType.CHECKPOINT },
      { type: NodeType.LESSON },
      { type: NodeType.CHEST },
      { type: NodeType.LESSON },
    ],
    0, // 0 completed → node[0] is active (will be overridden to locked below)
  ).map((node) => ({
    // Override entire unit to locked since unit 1 isn't complete yet
    ...node,
    status: NodeStatus.LOCKED,
    icon: NodeIcon.LOCK,
    progress: undefined,
    label: undefined,
  })),
  mascotPlacements: [
    {
      afterNodeIndex: 3,
      position: MascotSide.RIGHT,
      message: "Incredible progress! ⭐",
    },
  ],
};

/** Unit 3: Advanced — All locked (6 total) */
export const UNIT_3: UnitData = {
  id: "33000000-0000-0000-0000-000000000003",
  unitNumber: 3,
  title: "Unit 3",
  description: "Use the past tense, talk about travel",
  colorScheme: UnitColorScheme.PURPLE,
  nodes: createNodeSequence(
    [
      { type: NodeType.LESSON },
      { type: NodeType.LESSON },
      { type: NodeType.CHECKPOINT },
      { type: NodeType.LESSON },
      { type: NodeType.CHEST },
      { type: NodeType.LESSON },
    ],
    0,
  ).map((node) => ({
    ...node,
    status: NodeStatus.LOCKED,
    icon: NodeIcon.LOCK,
    progress: undefined,
    label: undefined,
  })),
  mascotPlacements: [
    {
      afterNodeIndex: 2,
      position: MascotSide.LEFT,
      message: "You're a star learner! 🌟",
    },
  ],
};

/** All mock units in order */
export const MOCK_UNITS: UnitData[] = [UNIT_1, UNIT_2, UNIT_3];
