/**
 * Contract: Freemium Gate Interface
 *
 * Defines the public API provided by the centralized useFreemiumGate hook.
 */

export const FREEMIUM_LIMITS = {
  HABITS: 3,
  COPING_CARDS: 5,
  VOICE_RECORDINGS_WEEKLY: 3,
  AI_ASSISTANT_DAILY: 5,
} as const;

export type FreemiumFeature =
  | "journey_unit"
  | "exercise"
  | "habits"
  | "coping_cards"
  | "voice_recording"
  | "ai_assistant";

export interface UseFreemiumGateReturn {
  /** Whether user has active verified Pro subscription */
  hasPro: boolean;

  /** Whether RevenueCat entitlement status is currently synchronizing */
  isLoadingRevenueCat: boolean;

  /**
   * Synchronously checks if a feature is currently gated based on entitlement and current count.
   * Does NOT trigger paywall or haptics.
   */
  isFeatureGated: (feature: FreemiumFeature, currentCount?: number) => boolean;

  /**
   * Asserts access to a feature. If user has Pro or feature is within quota, resolves true.
   * If feature is gated, plays warning haptic, presents native RevenueCat paywall, and resolves
   * whether the user successfully unlocked Pro.
   */
  requirePro: (feature: FreemiumFeature, currentCount?: number) => Promise<boolean>;

  /** Direct method to display the native subscription paywall modal */
  presentPaywall: () => Promise<boolean>;
}
