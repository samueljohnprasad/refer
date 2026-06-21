import { useCallback, useRef, useState, useMemo } from 'react';
import { streamText } from 'ai';
import { GLOBAL_AI_CONFIG } from '@/src/constants/ai';
import { useActiveModel } from '@/src/hooks/useActiveModel';
import { createAIProvider } from '@/src/services/ai';
import type { StructuredGenerationOptions } from '@/src/services/ai/types';

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

/** Configuration for Local AI (Apple Intelligence or Llama fallback). */
export interface LocalAIConfig {
  readonly systemPrompt?: string;
  readonly maxOutputTokens?: number;
  readonly temperature?: number;
  readonly llamaModelUrl?: string; // Kept for backwards compatibility
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
  /** Run a structured request mapped to a response schema */
  readonly generateStructured: <T = unknown>(
    options: Omit<StructuredGenerationOptions, 'model' | 'abortSignal'>,
  ) => Promise<T[]>;
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
  if (err instanceof Error && err.name === 'AbortError') return true;
  return (err as Error)?.name === 'AbortError';
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
}

/**
 * Creates a promise that rejects after a specified timeout.
 * Automatically cleans up the timeout if the abort signal is triggered.
 */
function createTimeoutPromise(ms: number, signal: AbortSignal): Promise<never> {
  return new Promise<never>((_, reject) => {
    const timeoutId = setTimeout(() => {
      if (!signal.aborted) {
        reject(new Error(`AI request timed out after ${ms}ms`));
      }
    }, ms);

    // Clean up timeout if request completes or aborts earlier
    signal.addEventListener('abort', () => clearTimeout(timeoutId));
  });
}

// ─── Inner Custom Hooks ──────────────────────────────────────────────────────

/**
 * Manages the lifecycle of an AbortController for cancelable requests.
 * DRYs up the ref management and abort logic.
 */
function useAbortManager() {
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const resetAndCreate = useCallback(() => {
    abort();
    const controller = new AbortController();
    abortRef.current = controller;
    return controller;
  }, [abort]);

  return { abort, resetAndCreate };
}

/**
 * Manages the common UI state (status, error, response) for AI generations.
 * Separates state management concerns from the execution logic.
 */
function useGenerationState() {
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<LocalAIStatus>(LocalAIStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setResponse('');
    setStatus(LocalAIStatus.IDLE);
    setError(null);
  }, []);

  const startGeneration = useCallback(() => {
    setResponse('');
    setError(null);
    setStatus(LocalAIStatus.LOADING);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (isAbortError(err)) {
      setStatus(LocalAIStatus.IDLE);
      return { isAbort: true };
    }
    setError(extractErrorMessage(err));
    setStatus(LocalAIStatus.ERROR);
    return { isAbort: false };
  }, []);

  return {
    response,
    setResponse,
    status,
    setStatus,
    error,
    resetState,
    startGeneration,
    handleError,
  };
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

/**
 * On-device Local AI hook powered by `@react-native-ai/apple` and Llama fallback.
 *
 * Fully configurable via `LocalAIConfig` — swap the system prompt and
 * generation parameters per screen/use-case without touching this hook.
 */
export function useLocalAI(config: LocalAIConfig = {}): UseLocalAIResult {
  const { getActiveModel, providerType, downloadProgress } = useActiveModel();
  
  const abortManager = useAbortManager();
  const state = useGenerationState();

  const isAvailable: boolean = true;

  const reset = useCallback(() => {
    abortManager.abort();
    state.resetState();
  }, [abortManager, state]);

  // Helper to accurately sync model downloading phase UI
  const updateDownloadingStatus = useCallback(() => {
    if (downloadProgress > 0 && downloadProgress < 100) {
      state.setStatus(LocalAIStatus.DOWNLOADING);
    }
  }, [downloadProgress, state]);

  // 1. Text Streaming Generation (Conversational)
  const generate = useCallback(
    async (userPrompt: string): Promise<void> => {
      const controller = abortManager.resetAndCreate();
      state.startGeneration();

      const { systemPrompt, maxOutputTokens, temperature } = resolveConfig(config);

      try {
        updateDownloadingStatus();
        const activeModel = await getActiveModel();
        if (controller.signal.aborted) return;

        const result = streamText({
          model: activeModel as Parameters<typeof streamText>[0]['model'],
          system: systemPrompt,
          prompt: userPrompt,
          temperature,
          maxOutputTokens,
          abortSignal: controller.signal,
        });

        state.setStatus(LocalAIStatus.STREAMING);

        let accumulated = '';
        for await (const chunk of result.textStream) {
          if (controller.signal.aborted) break;
          accumulated += chunk;
          state.setResponse(accumulated);
        }

        if (!controller.signal.aborted) {
          state.setStatus(LocalAIStatus.DONE);
        }
      } catch (err: unknown) {
        state.handleError(err);
      }
    },
    [config, getActiveModel, updateDownloadingStatus, abortManager, state]
  );

  // 2. Structured JSON Generation (Tooling/Extraction)
  const generateStructured = useCallback(
    async <T = unknown>(
      options: Omit<StructuredGenerationOptions, 'model' | 'abortSignal'>,
    ): Promise<T[]> => {
      const controller = abortManager.resetAndCreate();
      state.startGeneration();

      try {
        const fetchTask = (async () => {
          updateDownloadingStatus();
          const activeModel = await getActiveModel();
          if (controller.signal.aborted) return [];

          const provider = createAIProvider(providerType);
          return provider.generateStructured({
            ...options,
            model: activeModel,
            temperature: options.temperature ?? resolveConfig(config).temperature,
            abortSignal: controller.signal,
          });
        })();

        const items = await Promise.race([
          fetchTask,
          createTimeoutPromise(GLOBAL_AI_CONFIG.TIMEOUT_MS, controller.signal),
        ]);

        if (!controller.signal.aborted) {
          state.setStatus(LocalAIStatus.DONE);
          return items as T[];
        }
        return [];
      } catch (err: unknown) {
        state.handleError(err);
        throw err; // Original behavior: surface error up to callers
      }
    },
    [config, getActiveModel, providerType, updateDownloadingStatus, abortManager, state]
  );

  return useMemo(
    () => ({
      response: state.response,
      status: state.status,
      error: state.error,
      downloadProgress,
      isAvailable,
      generate,
      generateStructured,
      reset,
    }),
    [
      state.response,
      state.status,
      state.error,
      downloadProgress,
      isAvailable,
      generate,
      generateStructured,
      reset,
    ],
  );
}

