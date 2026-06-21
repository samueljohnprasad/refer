/**
 * AI Service — Barrel Export + Factory
 *
 * Single entry point for the AI provider system.
 *
 * @example
 * ```ts
 * import { createAIProvider } from '@/src/services/ai';
 *
 * const provider = createAIProvider('local-llm');
 * const items = await provider.generateStructured({ model, prompt, responseSchema });
 * ```
 */

export type { AIProvider, AIProviderType, StructuredGenerationOptions } from './types';
export { extractJson } from './extractJson';
export { schemaToSystemPrompt } from './schemaToSystemPrompt';
export { localLLMProvider } from './localLLMProvider';
export { appleAIProvider } from './appleAIProvider';

import type { AIProvider, AIProviderType } from './types';
import { localLLMProvider } from './localLLMProvider';
import { appleAIProvider } from './appleAIProvider';

// ─── Provider Registry ──────────────────────────────────────────────────────

const PROVIDER_MAP: Record<AIProviderType, AIProvider> = {
  'apple': appleAIProvider,
  'local-llm': localLLMProvider,
} as const;

// ─── Factory ────────────────────────────────────────────────────────────────

/**
 * Create an AI provider by type.
 *
 * @param type - `'apple'` for Apple Intelligence, `'local-llm'` for local Llama/Qwen
 * @returns The corresponding `AIProvider` implementation
 */
export function createAIProvider(type: AIProviderType): AIProvider {
  const provider: AIProvider | undefined = PROVIDER_MAP[type];

  if (!provider) {
    throw new Error(`Unknown AI provider type: "${type}"`);
  }

  return provider;
}
