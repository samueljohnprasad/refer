/**
 * Local LLM Provider
 *
 * Structured generation strategy for small on-device models (Qwen, Llama, etc.).
 *
 * Uses `generateText()` with a JSON-instructing system prompt, then extracts
 * and parses the JSON from the raw text output. This approach yields dramatically
 * higher success rates than `generateObject()` with small local models.
 *
 * Flow: generateText() → extractJson() → JSON.parse() → normalizeItems() → slice to maxResults
 */

import { generateText } from "ai";
import { GLOBAL_AI_CONFIG } from "@/src/constants/ai";
import type { AIProvider, StructuredGenerationOptions } from "./types";
import { extractJson } from "./extractJson";
import { schemaToSystemPrompt } from "./schemaToSystemPrompt";

// ─── Global Mutex for Local LLM ─────────────────────────────────────────────
// llama.rn throws "Context is busy" if multiple inferences run concurrently.
// This queue serializes all requests across the app.

let isGenerating = false;
const requestQueue: (() => void)[] = [];

async function acquireLock(): Promise<void> {
  if (!isGenerating) {
    isGenerating = true;
    return;
  }
  return new Promise<void>((resolve) => {
    requestQueue.push(resolve);
  });
}

function releaseLock(): void {
  if (requestQueue.length > 0) {
    const next = requestQueue.shift();
    next?.();
  } else {
    isGenerating = false;
  }
}

// ─── Output Normalization ────────────────────────────────────────────────────

/**
 * Extracts the ordered required keys from an array-items JSON schema.
 *
 * @example
 * // schema.items.required = ["text", "emoji"]  → ["text", "emoji"]
 */
function extractRequiredKeys(schema: Record<string, unknown>): string[] {
  const items = schema.items as Record<string, unknown> | undefined;
  const required = items?.required;
  if (Array.isArray(required) && required.every((k) => typeof k === 'string')) {
    return required as string[];
  }
  return [];
}

/**
 * Normalizes parsed JSON output from a local LLM.
 *
 * Small models (Llama, Qwen) sometimes hallucinate a positional array format
 * instead of the requested object format, e.g.:
 *   ❌ [["I feel anxious at work", "😰"], ...]
 *   ✅ [{ "text": "I feel anxious at work", "emoji": "😰" }, ...]
 *
 * This function detects the array-of-arrays pattern and remaps each item
 * back to a keyed object using the schema's `required` field list as
 * positional keys.
 */
function normalizeItems<T>(
  parsed: unknown,
  schema: Record<string, unknown>,
): T[] {
  if (!Array.isArray(parsed)) return [parsed as T];

  const requiredKeys = extractRequiredKeys(schema);

  return parsed.map((item: unknown): T => {
    // Already correct: the model returned an object
    if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
      return item as T;
    }

    // Hallucinated positional array: remap using required keys
    if (Array.isArray(item) && requiredKeys.length > 0) {
      const remapped = Object.fromEntries(
        requiredKeys.map((key, index) => [key, item[index] ?? '']),
      );
      return remapped as T;
    }

    return item as T;
  });
}

// ─── Provider Implementation ────────────────────────────────────────────────

export const localLLMProvider: AIProvider = {
  async generateStructured<T = unknown>(
    options: StructuredGenerationOptions,
  ): Promise<T[]> {
    await acquireLock();
    const {
      model,
      prompt,
      responseSchema,
      maxResults = 5,
      temperature = GLOBAL_AI_CONFIG.STRUCTURED_TEMPERATURE,
      abortSignal,
    } = options;

    let systemPrompt = "";
    try {
      // Build a system prompt that tells the model to return ONLY valid JSON
      systemPrompt = schemaToSystemPrompt(
        responseSchema as Record<string, unknown>,
      );

      // Generate raw text with JSON instructions
      const { text } = await generateText({
        model: model as Parameters<typeof generateText>[0]["model"],
        system: systemPrompt,
        prompt,
        temperature,
        abortSignal,
      });

      console.log(`[local-llm] Raw Output:\n${text}`);

      // Extract and parse the JSON from raw output
      const jsonString: string = extractJson(text);
      console.log(`[local-llm] Extracted JSON:\n${jsonString}`);
      const parsed: unknown = JSON.parse(jsonString);

      // Normalize: fix array-of-arrays hallucination before slicing
      const items: T[] = normalizeItems<T>(parsed, responseSchema as Record<string, unknown>)
        .slice(0, maxResults);

      console.log(
        `[local-llm] Success!\nSystem Prompt:\n${systemPrompt}\n\nPrompt:\n${prompt}\n\nOutput:\n${JSON.stringify(
          items,
          null,
          2,
        )}`,
      );

      return items;
    } catch (err: unknown) {
      console.error(
        `[local-llm] Failed!\nSystem Prompt:\n${systemPrompt}\n\nPrompt:\n${prompt}\n\nError:\n`,
        err,
      );
      throw err;
    } finally {
      releaseLock();
    }
  },
};
