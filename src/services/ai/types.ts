/**
 * AI Provider — Strategy Pattern Types
 *
 * Defines the contract for structured AI generation.
 * Each provider (Apple AI, local LLM) implements `AIProvider`
 * with its own generation strategy.
 */

// ─── Provider Type ──────────────────────────────────────────────────────────

/** Discriminator for selecting the correct AI provider. */
export type AIProviderType = 'apple' | 'local-llm';

// ─── Generation Options ─────────────────────────────────────────────────────

/** Options passed to `AIProvider.generateStructured()`. */
export interface StructuredGenerationOptions {
  /**
   * The AI model instance (from `@react-native-ai/apple` or `@react-native-ai/llama`).
   * Kept as `unknown` to decouple the provider interface from specific SDKs.
   */
  readonly model: unknown;

  /** The user-facing prompt (built by the exercise's `promptBuilder`). */
  readonly prompt: string;

  /**
   * JSON Schema describing the expected response shape.
   * Used differently per provider:
   * - Apple AI: passed to `generateObject()` via `jsonSchema()`
   * - Local LLM: converted to a system prompt via `schemaToSystemPrompt()`
   */
  readonly responseSchema: Record<string, unknown>;

  /** Maximum number of items to return (slices the result array). */
  readonly maxResults?: number;

  /** Sampling temperature override. Lower = more deterministic JSON output. */
  readonly temperature?: number;

  /** Abort signal to cancel generation midway. */
  readonly abortSignal?: AbortSignal;
}

// ─── Provider Interface ─────────────────────────────────────────────────────

/**
 * Strategy interface for structured AI generation.
 *
 * Each implementation encapsulates a different approach:
 * - `appleAIProvider` → `generateObject()` with strict schema
 * - `localLLMProvider` → `generateText()` + `extractJson()` + `JSON.parse()`
 */
export interface AIProvider {
  /**
   * Generate structured output matching the given schema.
   *
   * @returns An array of result items (even for single-object schemas,
   *          wrapped in an array for uniform consumption by exercise steps).
   */
  generateStructured<T = unknown>(
    options: StructuredGenerationOptions,
  ): Promise<T[]>;
}
