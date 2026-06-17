import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import { apple } from '@react-native-ai/apple';
import { llama, downloadModel } from '@react-native-ai/llama';
import { streamText } from 'ai';
import { GLOBAL_AI_CONFIG } from '@/src/constants/ai';

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
export enum LocalAIStatus {
  IDLE = 'idle',
  DOWNLOADING = 'downloading',
  LOADING = 'loading',
  STREAMING = 'streaming',
  DONE = 'done',
  ERROR = 'error',
  UNAVAILABLE = 'unavailable',
}

/**
 * Configuration for Local AI (Apple Intelligence or Llama fallback).
 *
 * @example CBT Exercise use case:
 * ```ts
 * const CBT_CONFIG: LocalAIConfig = {
 *   systemPrompt: 'You are a CBT coach. Help identify cognitive distortions.',
 *   maxOutputTokens: 300,
 *   temperature: 0.5,
 * };
 * const ai = useLocalAI(CBT_CONFIG);
 * ```
 */
export interface LocalAIConfig {
  /** Persona/identity injected into every generation as a system prompt. */
  readonly systemPrompt?: string;
  /** Max tokens the model will generate. Default: 512. */
  readonly maxOutputTokens?: number;
  /** Sampling temperature (0 = deterministic, 1 = creative). Default: 0.7. */
  readonly temperature?: number;
  /** HuggingFace ID or URL for the Llama model to download/use. */
  readonly llamaModelUrl?: string;
}

/** Public API surface returned by `useLocalAI`. */
export interface UseLocalAIResult {
  readonly response: string;
  readonly status: LocalAIStatus;
  readonly error: string | null;
  readonly downloadProgress: number;
  readonly isAvailable: boolean;
  /** Stream a response for the given user prompt. */
  readonly generate: (userPrompt: string) => Promise<void>;
  /** Abort any active generation and reset state. */
  readonly reset: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveConfig(config: LocalAIConfig): Required<LocalAIConfig> {
  return {
    systemPrompt: config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    maxOutputTokens: config.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
    temperature: config.temperature ?? DEFAULT_TEMPERATURE,
    llamaModelUrl: config.llamaModelUrl ?? GLOBAL_AI_CONFIG.LLAMA_MODEL_URL,
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
 * On-device Local AI hook powered by `@react-native-ai/apple` and Llama fallback.
 *
 * Fully configurable via `LocalAIConfig` — swap the system prompt and
 * generation parameters per screen/use-case without touching this hook.
 *
 * @param config - Optional config to override identity and generation params.
 *
 * @example Standalone usage (defaults to Sage wellness identity)
 * ```ts
 * const ai = useLocalAI();
 * await ai.generate('Help me reframe this thought');
 * ```
 *
 * @example CBT-specific usage
 * ```ts
 * const ai = useLocalAI({
 *   systemPrompt: 'You are a CBT coach. Identify cognitive distortions.',
 *   temperature: 0.5,
 * });
 * await ai.generate(cbtStep.prompt);
 * ```
 */
export function useLocalAI(
  config: LocalAIConfig = {},
): UseLocalAIResult {
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<LocalAIStatus>(LocalAIStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const abortRef = useRef<AbortController | null>(null);
  const llamaModelRef = useRef<any>(null); // Keep a reference to the llama model

  // Clean up Llama model on unmount
  useEffect(() => {
    return () => {
      if (llamaModelRef.current) {
        llamaModelRef.current.unload().catch(console.error);
        llamaModelRef.current = null;
      }
    };
  }, []);

  const isAppleAvailable =
    !GLOBAL_AI_CONFIG.FORCE_LOCAL_LLM &&
    Platform.OS === 'ios' &&
    typeof apple.isAvailable === 'function'
      ? apple.isAvailable()
      : false;

  // Since we fallback to Llama, it's always "available" theoretically.
  const isAvailable: boolean = true;

  const reset = useCallback((): void => {
    abortRef.current?.abort();
    abortRef.current = null;
    setResponse('');
    setStatus(LocalAIStatus.IDLE);
    setError(null);
    setDownloadProgress(0);
  }, []);

  const loadLlamaFallback = async (modelUrl: string, signal: AbortSignal) => {
    setStatus(LocalAIStatus.DOWNLOADING);
    const modelPath = await downloadModel(modelUrl, (progress) => {
      setDownloadProgress(progress.percentage);
    });
    
    if (signal.aborted) return null;
    
    setStatus(LocalAIStatus.LOADING);
    if (!llamaModelRef.current) {
      llamaModelRef.current = llama.languageModel(modelPath);
      await llamaModelRef.current.prepare();
    }
    return llamaModelRef.current;
  };

  const generate = useCallback(
    async (userPrompt: string): Promise<void> => {
      // Abort any previous stream before starting a new one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setResponse('');
      setError(null);
      setStatus(LocalAIStatus.LOADING);

      const { systemPrompt, maxOutputTokens, temperature, llamaModelUrl } =
        resolveConfig(config);

      try {
        let activeModel;

        if (isAppleAvailable) {
          activeModel = apple();
        } else {
          const fallbackModel = await loadLlamaFallback(llamaModelUrl, controller.signal);
          if (!fallbackModel) return;
          activeModel = fallbackModel;
        }

        if (controller.signal.aborted) return;

        const result = streamText({
          model: activeModel,
          system: systemPrompt,
          prompt: userPrompt,
          temperature,
          maxOutputTokens,
          abortSignal: controller.signal,
        });

        setStatus(LocalAIStatus.STREAMING);

        let accumulated = '';
        for await (const chunk of result.textStream) {
          if (controller.signal.aborted) break;
          accumulated += chunk;
          setResponse(accumulated);
        }

        if (!controller.signal.aborted) {
          setStatus(LocalAIStatus.DONE);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          setStatus(LocalAIStatus.IDLE);
          return;
        }
        setError(extractErrorMessage(err));
        setStatus(LocalAIStatus.ERROR);
      }
    },
    [isAppleAvailable, config],
  );

  return useMemo(
    () => ({
      response,
      status,
      error,
      downloadProgress,
      isAvailable,
      generate,
      reset,
    }),
    [response, status, error, downloadProgress, isAvailable, generate, reset]
  );
}
