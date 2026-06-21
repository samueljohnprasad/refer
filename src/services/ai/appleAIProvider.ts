/**
 * Apple AI Provider
 *
 * Structured generation strategy for Apple Intelligence models.
 *
 * Uses the Vercel AI SDK's `generateObject()` with `jsonSchema()`,
 * which works reliably with Apple's on-device models that support
 * constrained/structured output natively.
 *
 * Flow: generateObject() → direct structured output
 */

import { generateObject, jsonSchema } from 'ai';
import type { AIProvider, StructuredGenerationOptions } from './types';

// ─── Provider Implementation ────────────────────────────────────────────────

export const appleAIProvider: AIProvider = {
  async generateStructured<T = unknown>(
    options: StructuredGenerationOptions,
  ): Promise<T[]> {
    const {
      model,
      prompt,
      responseSchema,
      maxResults = 5,
      abortSignal
    } = options;

    try {
      const { object } = await generateObject({
        model: model as Parameters<typeof generateObject>[0]['model'],
        schema: jsonSchema(responseSchema),
        prompt,
        abortSignal
      });

      // Normalize to array and slice
      const parsed: unknown = object;
      const items: T[] = Array.isArray(parsed)
        ? (parsed as T[]).slice(0, maxResults)
        : [parsed as T];

      console.log(
        `[apple] Success!\nSchema:\n${JSON.stringify(
          responseSchema,
          null,
          2,
        )}\n\nPrompt:\n${prompt}\n\nOutput:\n${JSON.stringify(items, null, 2)}`,
      );

      return items;
    } catch (err: unknown) {
      console.error(
        `[apple] Failed!\nSchema:\n${JSON.stringify(
          responseSchema,
          null,
          2,
        )}\n\nPrompt:\n${prompt}\n\nError:\n`,
        err,
      );
      throw err;
    }
  },
};
