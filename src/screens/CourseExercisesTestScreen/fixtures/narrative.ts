import type { Exercise } from "@/src/types/journeyV5";

export const narrativeMicrolearningFixtures: readonly Exercise[] = [{
  id: "fixture-layer-zoom", nodeId: "fixture-layer-zoom-node", orderIndex: 0,
  type: "layer_zoom", phase: "teach", durationSeconds: 45, isScored: false,
  content: {
    title: "One moment, three layers", instruction: "Zoom in one layer at a time.",
    layers: [
      { id: "anxiety-layer-situation", label: "Situation", title: "A name is called", body: "Mina is asked to speak next in a meeting." },
      { id: "anxiety-layer-body-alarm", label: "Body alarm", title: "The system prepares", body: "Her heart speeds up, her mouth feels dry, and her shoulders tighten." },
      { id: "anxiety-layer-function", label: "Function", title: "The body gets ready", body: "More alertness and muscle readiness would help if quick action were needed." },
    ],
    insight: "The body can prepare before the mind knows whether the situation is dangerous, difficult, or simply important.",
  },
}];
