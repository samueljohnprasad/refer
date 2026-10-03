export interface AiObservationContext {
  distinctId?: string;
  traceId?: string;
  sessionId?: string | null;
}

interface GeminiGeneration {
  operation: string;
  model: string;
  input: unknown;
  output?: string;
  startedAt: number;
  error?: unknown;
  context?: AiObservationContext;
}

const anonymousEdgeSessionId = `edge-ai-${crypto.randomUUID()}`;

/**
 * Sends a manual AI Observability generation from a Supabase Edge Function.
 * POSTHOG_PROJECT_TOKEN and POSTHOG_HOST must be configured as function secrets.
 */
export async function captureGeminiGeneration({
  operation,
  model,
  input,
  output,
  startedAt,
  error,
  context,
}: GeminiGeneration): Promise<void> {
  const projectToken = Deno.env.get("POSTHOG_PROJECT_TOKEN");
  const host = Deno.env.get("POSTHOG_HOST");

  if (!projectToken || !host) return;

  const traceId = context?.traceId ?? `gemini-trace-${crypto.randomUUID()}`;

  try {
    await fetch(`${host.replace(/\/$/, "")}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: projectToken,
        event: "$ai_generation",
        properties: {
          distinct_id: context?.distinctId ?? anonymousEdgeSessionId,
          $ai_trace_id: traceId,
          $ai_session_id: context?.sessionId ?? null,
          $ai_span_id: `gemini-generation-${crypto.randomUUID()}`,
          $ai_span_name: operation,
          $ai_model: model,
          $ai_provider: "gemini",
          $ai_input: input,
          $ai_output_choices:
            output === undefined
              ? []
              : [{ role: "assistant", content: output }],
          $ai_latency: (Date.now() - startedAt) / 1000,
          ...(error
            ? {
                $ai_is_error: true,
                $ai_error:
                  error instanceof Error ? error.message : String(error),
              }
            : {}),
        },
      }),
    });
  } catch {
    // Observability must not interrupt a journal or reflection workflow.
  }
}
