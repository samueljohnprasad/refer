/**
 * Component Contract: CelebrationOverlay
 * 
 * This component is responsible for orchestrating the 2-second "Happy Ripple" 
 * celebration sequence. It intercepts the transition between a completed exercise 
 * and the journey map.
 */

export interface CelebrationOverlayProps {
  /**
   * Triggers the sequence. When true, the exercise should visually retreat 
   * and the celebration begins.
   */
  isVisible: boolean;

  /**
   * Contextual data for the celebration (copy, asset references).
   */
  context: CelebrationContext;

  /**
   * Callback fired when the user taps "Continue".
   * This should trigger the router transition back to the Journey Map.
   */
  onContinue: () => void;

  /**
   * Optional callback fired at 1450ms when the "Continue" button becomes visible.
   * Useful for pre-loading or analytics.
   */
  onInteractionAvailable?: () => void;
}
