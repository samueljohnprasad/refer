// ponytail: static scenarios and distortion choices for thought-catch micro-win
import type { SymbolViewProps } from "expo-symbols";
import type { MotivationAnswer } from "../types";

export interface DistortionOption {
  id: string;
  symbol: SymbolViewProps["name"];
  label: string;
  distortion: string;
}

export const DISTORTION_OPTIONS: readonly DistortionOption[] = [
  {
    id: "catastrophizing",
    symbol: "tornado",
    label: "Worst-case spiral",
    distortion: "Catastrophizing",
  },
  {
    id: "all_or_nothing",
    symbol: "circle.lefthalf.filled",
    label: "All-or-nothing",
    distortion: "Black or White",
  },
  {
    id: "mind_reading",
    symbol: "sparkles",
    label: "Predicting failure",
    distortion: "Fortune Telling",
  },
] as const;

export const THOUGHT_SCENARIOS: Record<
  MotivationAnswer | "default",
  { thought: string; reframe: string }
> = {
  anxiety: {
    thought: "I have so much to do today, I'm definitely going to fail.",
    reframe:
      "I have a lot on my plate, but I can tackle just one small step right now.",
  },
  mood: {
    thought: "Today is going to be another heavy day where nothing goes right.",
    reframe:
      "Today feels heavy, but good moments can still happen if I stay gentle.",
  },
  stress: {
    thought: "If I don't handle everything right now, everything collapses.",
    reframe:
      "I don't have to carry the whole mountain today. One piece at a time is enough.",
  },
  self_understanding: {
    thought: "I should have my emotions figured out by now without needing help.",
    reframe:
      "Self-understanding is a lifelong practice. Being curious about my mind is strength.",
  },
  sleep: {
    thought: "If I don't fall asleep right now, my whole tomorrow is ruined.",
    reframe:
      "Resting my body is already restorative. Tomorrow will be manageable even if sleep comes slowly.",
  },
  default: {
    thought: "I have so much to do today, I'm definitely going to fail.",
    reframe:
      "I have a lot on my plate, but I can tackle just one small step right now.",
  },
};
