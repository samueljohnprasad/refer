// specs/017-continue-journey-card/contracts/continue-journey-card.contract.ts
// Contract specifications for Continue Your Journey Card components and hooks.

import type { ContinueJourneyCardState } from "@/src/components/ContinueJourneyCard/types";

/**
 * Public action handlers provided to the presentational card.
 */
export interface ContinueJourneyCardActions {
  /**
   * Primary card interaction handler triggered when user taps anywhere on the card or action button.
   */
  handleCardPress: () => void;
  /**
   * Retry handler for error recovery.
   */
  handleRetry: () => void;
}

/**
 * Return signature for useContinueJourneyViewModel hook.
 */
export interface UseContinueJourneyViewModelResult {
  state: ContinueJourneyCardState;
  actions: ContinueJourneyCardActions;
}

/**
 * Props for the presentational card component.
 */
export interface ContinueJourneyCardProps {
  className?: string;
  testID?: string;
}

/**
 * Analytics event payload contracts for the card.
 */
export interface HomeJourneyCardViewedEvent {
  state: ContinueJourneyCardState["type"];
  course_id?: string;
}

export interface HomeJourneyCardTappedEvent {
  action: string;
  course_id?: string;
  activity_id?: string;
}
