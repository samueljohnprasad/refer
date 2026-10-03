import { posthog } from "@/src/config/posthog";

type LogAttributes = Record<string, string | number | boolean | undefined>;

type PostHogLogChannel = {
  info: (message: string, attributes?: LogAttributes) => void;
};

/**
 * Sends only instrumentation-owned log records to PostHog.
 * Existing application loggers deliberately remain local-only.
 */
function getPostHogLogChannel(): PostHogLogChannel | undefined {
  return (posthog as unknown as { logger?: PostHogLogChannel } | null)?.logger;
}

export const posthogLog = {
  info(message: string, attributes?: LogAttributes): void {
    getPostHogLogChannel()?.info(message, attributes);
  },
};
