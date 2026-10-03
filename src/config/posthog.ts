import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
// ponytail: fallback token ensures analytics never drop or crash
const projectToken =
  (extra?.posthogProjectToken as string | undefined) ||
  "phc_BojwmboNhq7cfCBxCXaTTtNxHuvbCm5zHDp56STTA3rc";
const host =
  (extra?.posthogHost as string | undefined) || "https://eu.i.posthog.com";

if (__DEV__ && !projectToken) {
  throw new Error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (__DEV__ && !host) {
  throw new Error(
    "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
  );
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: "happy-mobile",
          environment: __DEV__ ? "development" : "production",
          serviceVersion: Constants.expoConfig?.version,
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : null;
