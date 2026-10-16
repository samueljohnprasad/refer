import { useCallback } from "react";
import { usePostHog } from "posthog-react-native";

type SignupProvider = "apple" | "google";
type SignupSource = "entry" | "onboarding";

const SIGNUP_COPY_VARIANT = "personalized_journey_v1";

interface SignupAnalytics {
  trackSheetViewed: (source: SignupSource) => void;
  trackProviderTapped: (provider: SignupProvider, source: SignupSource) => void;
  trackAuthSucceeded: (provider: SignupProvider, source: SignupSource) => void;
  trackAuthCancelled: (provider: SignupProvider, source: SignupSource) => void;
  trackAuthFailed: (provider: SignupProvider, source: SignupSource, error?: unknown) => void;
  trackConflictDetected: (provider: SignupProvider, source: SignupSource) => void;
  trackSkipped: (source: SignupSource) => void;
  trackDismissed: (source: SignupSource) => void;
}

export function useSignupAnalytics(): SignupAnalytics {
  const posthog = usePostHog();

  const capture = useCallback(
    (eventName: string, properties: Record<string, string>): void => {
      try {
        posthog?.capture(eventName, properties);
      } catch (error) {
        console.warn("[SignupAnalytics] Failed to track event:", eventName, error);
      }
    },
    [posthog],
  );

  const trackSheetViewed = useCallback((source: SignupSource): void => {
    capture("signup_sheet_viewed", {
      source,
      copy_variant: SIGNUP_COPY_VARIANT,
    });
  }, [capture]);

  const trackProviderTapped = useCallback(
    (provider: SignupProvider, source: SignupSource): void => {
      capture("signup_provider_tapped", {
        provider,
        source,
        copy_variant: SIGNUP_COPY_VARIANT,
      });
    },
    [capture],
  );

  const trackAuthSucceeded = useCallback(
    (provider: SignupProvider, source: SignupSource): void => {
      capture("signup_auth_succeeded", {
        provider,
        source,
        copy_variant: SIGNUP_COPY_VARIANT,
      });
    },
    [capture],
  );

  const trackAuthCancelled = useCallback(
    (provider: SignupProvider, source: SignupSource): void => {
      capture("signup_auth_cancelled", {
        provider,
        source,
        copy_variant: SIGNUP_COPY_VARIANT,
      });
    },
    [capture],
  );

  const trackAuthFailed = useCallback(
    (provider: SignupProvider, source: SignupSource, error?: unknown): void => {
      const errorMessage =
        error instanceof Error ? error.message : typeof error === "string" ? error : "unknown";
      capture("signup_auth_failed", {
        provider,
        source,
        error_message: errorMessage,
        copy_variant: SIGNUP_COPY_VARIANT,
      });
    },
    [capture],
  );

  const trackConflictDetected = useCallback(
    (provider: SignupProvider, source: SignupSource): void => {
      capture("signup_account_conflict_detected", {
        provider,
        source,
        copy_variant: SIGNUP_COPY_VARIANT,
      });
    },
    [capture],
  );

  const trackSkipped = useCallback((source: SignupSource): void => {
    capture("signup_skipped", {
      source,
      copy_variant: SIGNUP_COPY_VARIANT,
    });
  }, [capture]);

  const trackDismissed = useCallback((source: SignupSource): void => {
    capture("signup_sheet_dismissed", {
      source,
      copy_variant: SIGNUP_COPY_VARIANT,
    });
  }, [capture]);

  return {
    trackSheetViewed,
    trackProviderTapped,
    trackAuthSucceeded,
    trackAuthCancelled,
    trackAuthFailed,
    trackConflictDetected,
    trackSkipped,
    trackDismissed,
  };
}
