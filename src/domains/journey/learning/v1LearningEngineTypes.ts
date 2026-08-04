import type { Exercise } from "@/src/types/journeyV5";
import type { V1SupportLevel } from "@/src/types/journeyLearning";

export interface V1CategoryEngineProps {
  exercise: Exercise;
  savedResponse?: unknown;
  supportLevel: V1SupportLevel;
  locked?: boolean;
  onInteraction: (response: Record<string, unknown>, isReady?: boolean) => void;
}
