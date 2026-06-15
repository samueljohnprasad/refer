import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { apple } from '@react-native-ai/apple';
import { streamText } from 'ai';

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT = `You are a warm, empathetic mental wellness companion named Sage.
You specialize in CBT (Cognitive Behavioral Therapy), mindfulness, and evidence-based mental health support.
You communicate in a calm, supportive, and non-judgmental tone.
Always prioritize the user's emotional safety. Avoid giving clinical diagnoses.
Keep responses concise unless the user asks for more detail.`;

const DEFAULT_MAX_OUTPUT_TOKENS = 512;
const DEFAULT_TEMPERATURE = 0.7;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Possible lifecycle states of a generation. */
export enum AppleAIStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  STREAMING = 'streaming',
  DONE = 'done',
  ERROR = 'error',
  UNAVAILABLE = 'unavailable',
}

/**
 * Configuration for Apple Intelligence — injectable per use case.
 *
 * @example CBT Exercise use case:
 * ```ts
 * const CBT_CONFIG: AppleAIConfig = {
 *   systemPrompt: 'You are a CBT coach. Help identify cognitive distortions.',
 *   maxOutputTokens: 300,
 *   temperature: 0.5,
 * };
 * const ai = useAppleIntelligence(CBT_CONFIG);
 * ```
 */
export interface AppleAIConfig {
  /** Persona/identity injected into every generation as a system prompt. */
  readonly systemPrompt?: string;
  /** Max tokens the model will generate. Default: 512. */
  readonly maxOutputTokens?: number;
  /** Sampling temperature (0 = deterministic, 1 = creative). Default: 0.7. */
  readonly temperature?: number;
}

/** Public API surface returned by `useAppleIntelligence`. */
export interface UseAppleIntelligenceResult {
  readonly response: string;
  readonly status: AppleAIStatus;
  readonly error: string | null;
  readonly isAvailable: boolean;
  /** Stream a response for the given user prompt. */
  readonly generate: (userPrompt: string) => Promise<void>;
  /** Abort any active generation and reset state. */
  readonly reset: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveConfig(config: AppleAIConfig): Required<AppleAIConfig> {
  return {
    systemPrompt: config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    maxOutputTokens: config.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
    temperature: config.temperature ?? DEFAULT_TEMPERATURE,
  };
}

function isAbortError(err: unknown): boolean {
  return (err as Error)?.name === 'AbortError';
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * On-device Apple Intelligence hook powered by `@react-native-ai/apple`.
 *
 * Fully configurable via `AppleAIConfig` — swap the system prompt and
 * generation parameters per screen/use-case without touching this hook.
 *
 * @param config - Optional config to override identity and generation params.
 *
 * @example Standalone usage (defaults to Sage wellness identity)
 * ```ts
 * const ai = useAppleIntelligence();
 * await ai.generate('Help me reframe this thought');
 * ```
 *
 * @example CBT-specific usage
 * ```ts
 * const ai = useAppleIntelligence({
 *   systemPrompt: 'You are a CBT coach. Identify cognitive distortions.',
 *   temperature: 0.5,
 * });
 * await ai.generate(cbtStep.prompt);
 * ```
 */
export function useAppleIntelligence(
  config: AppleAIConfig = {},
): UseAppleIntelligenceResult {
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<AppleAIStatus>(AppleAIStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const isAvailable: boolean =
    Platform.OS === 'ios' && typeof apple.isAvailable === 'function'
      ? apple.isAvailable()
      : false;

  const reset = useCallback((): void => {
    abortRef.current?.abort();
    abortRef.current = null;
    setResponse('');
    setStatus(AppleAIStatus.IDLE);
    setError(null);
  }, []);

  const generate = useCallback(
    async (userPrompt: string): Promise<void> => {
      if (!isAvailable) {
        setStatus(AppleAIStatus.UNAVAILABLE);
        setError('Apple Intelligence is not available on this device.');
        return;
      }

      // Abort any previous stream before starting a new one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setResponse('');
      setError(null);
      setStatus(AppleAIStatus.LOADING);

      const { systemPrompt, maxOutputTokens, temperature } =
        resolveConfig(config);

      try {
        const result = streamText({
          model: apple(),
          system: systemPrompt,
          prompt: userPrompt,
          temperature,
          maxOutputTokens,
          abortSignal: controller.signal,
        });

        setStatus(AppleAIStatus.STREAMING);

        let accumulated = '';
        for await (const chunk of result.textStream) {
          if (controller.signal.aborted) break;
          accumulated += chunk;
          setResponse(accumulated);
        }

        if (!controller.signal.aborted) {
          setStatus(AppleAIStatus.DONE);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          setStatus(AppleAIStatus.IDLE);
          return;
        }
        setError(extractErrorMessage(err));
        setStatus(AppleAIStatus.ERROR);
      }
    },
    [isAvailable, config],
  );

  return { response, status, error, isAvailable, generate, reset } as const;
}
