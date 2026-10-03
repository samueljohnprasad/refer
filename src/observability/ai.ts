import { posthog } from "@/src/config/posthog";

type GeminiRequest = {
  model: string;
  contents: unknown;
};

type GeminiResponse = {
  text?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  };
};

const aiSessionId = `mobile-ai-${createId()}`;

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function toAiMessages(contents: unknown) {
  if (Array.isArray(contents)) {
    return contents.map((content) => {
      if (
        content &&
        typeof content === "object" &&
        "role" in content
      ) {
        const { role, ...message } = content as Record<string, unknown> & {
          role: string;
        };
        return { role, content: message };
      }

      return { role: "user", content };
    });
  }

  return [{ role: "user", content: contents }];
}

/**
 * Records one Gemini request as an AI Observability generation. The module-level
 * session groups the one-shot AI turns made during a single app run.
 */
export async function observeGeminiGeneration<
  TRequest extends GeminiRequest,
  TResponse extends GeminiResponse,
>(
  operation: string,
  generate: (request: TRequest) => Promise<TResponse>,
  request: TRequest,
): Promise<TResponse> {
  const startedAt = Date.now();
  const traceId = `gemini-trace-${createId()}`;

  try {
    const response = await generate(request);

    posthog?.capture("$ai_generation", {
      $ai_trace_id: traceId,
      $ai_session_id: aiSessionId,
      $ai_span_id: `gemini-generation-${createId()}`,
      $ai_span_name: operation,
      $ai_model: request.model,
      $ai_provider: "gemini",
      $ai_input: toAiMessages(request.contents),
      $ai_output_choices: [
        { role: "assistant", content: response.text ?? "" },
      ],
      $ai_input_tokens: response.usageMetadata?.promptTokenCount,
      $ai_output_tokens: response.usageMetadata?.candidatesTokenCount,
      $ai_latency: (Date.now() - startedAt) / 1000,
    });

    return response;
  } catch (error) {
    posthog?.capture("$ai_generation", {
      $ai_trace_id: traceId,
      $ai_session_id: aiSessionId,
      $ai_span_id: `gemini-generation-${createId()}`,
      $ai_span_name: operation,
      $ai_model: request.model,
      $ai_provider: "gemini",
      $ai_input: toAiMessages(request.contents),
      $ai_output_choices: [],
      $ai_latency: (Date.now() - startedAt) / 1000,
      $ai_is_error: true,
      $ai_error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}
