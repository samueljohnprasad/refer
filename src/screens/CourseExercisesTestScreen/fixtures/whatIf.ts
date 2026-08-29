import { WhatIfContent } from "@/src/components/exercise/whatif/whatIfContent";
import type { Exercise } from "@/src/types/journeyV5";

export const whatIfFixtureContent: WhatIfContent = {
  format: "what_if",
  predictions: [
    { id: "p1", text: "I'll panic and freeze." },
    { id: "p2", text: "I'll handle it better than I expect." },
    { id: "p3", text: "It'll be awkward but survivable." },
  ],
  consequences: [
    { id: "c1", text: "You feel a spike of adrenaline as it starts." },
    { id: "c2", text: "You take a deep breath and ground yourself." },
    { id: "c3", text: "The moment passes, and you realize you're okay." },
  ],
  finalComparison: {
    heading: "Reality Check",
    description: "Compare what you expected with what actually happened.",
  },
};

export const whatIfFixture: Exercise = {
  id: "ex_whatif_01",
  nodeId: "node_whatif_01",
  orderIndex: 0,
  type: "what_if",
  content: whatIfFixtureContent as any, // Temporary any until types updated
};
