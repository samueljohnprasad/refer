import type { Exercise } from "@/src/types/journeyV5";

export interface V1InteractionOptions {
  revealImmediately?: boolean;
}

export interface V1CategoryEngineProps {
  exercise: Exercise;
  savedResponse?: unknown;
  locked?: boolean;
  onInteraction: (
    response: Record<string, unknown>,
    isReady?: boolean,
    options?: V1InteractionOptions,
  ) => void;
}
