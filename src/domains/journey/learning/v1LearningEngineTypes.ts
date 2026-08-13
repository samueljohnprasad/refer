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
    /** Whether the current persistent-footer action is enabled. */
    isFooterActionEnabled?: boolean,
    options?: V1InteractionOptions,
  ) => void;
}
