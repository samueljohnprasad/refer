import { useCallback } from "react";
import { usePostHog } from "posthog-react-native";

type SignupProvider = "apple" | "google";
type SignupSource = "entry" | "onboarding";

const SIGNUP_COPY_VARIANT = "personalized_journey_v1";

interface SignupAnalytics {
  trackSheetViewed: (source: SignupSource) => void;
  trackProviderTapped: (provider: SignupProvider, source: SignupSource) => void;
  trackAuthSucceeded: (provider: SignupProvider, source: SignupSource) => void;
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
    trackSkipped,
    trackDismissed,
  };
}
