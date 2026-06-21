/**
 * Extract JSON from raw LLM text output.
 *
 * Small local models often wrap JSON in markdown fences, add conversational
 * preamble, or append trailing text. This utility robustly extracts the
 * first valid JSON array or object from the raw response.
 *
 * @example
 * ```ts
 * extractJson('Here is the result:\n```json\n[{"text":"hello"}]\n```\nDone!')
 * // → '[{"text":"hello"}]'
 * ```
 */

/**
 * Extracts the first JSON array or object from a raw text string.
 *
 * Strategy (ordered by priority):
 * 1. Markdown fenced code block (```json ... ``` or ``` ... ```)
 * 2. First `[` ... `]` or `{` ... `}` substring (greedy, outermost match)
 * 3. Falls back to trimmed input as-is
 */
export function extractJson(text: string): string {
  const trimmed: string = text.trim();

  // ── Strategy 1: Markdown fenced code block ──────────────────────────────
  const fenceMatch: RegExpMatchArray | null = trimmed.match(
    /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/,
  );
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  // ── Strategy 2: Find outermost JSON structure ───────────────────────────
  const jsonStart: number = findJsonStart(trimmed);
  if (jsonStart !== -1) {
    const extracted: string | null = extractBalancedJson(trimmed, jsonStart);
    if (extracted !== null) {
      return extracted;
    }
  }

  // ── Strategy 3: Return trimmed input as fallback ────────────────────────
  return trimmed;
}

/**
 * Finds the index of the first `[` or `{` in the string.
 */
function findJsonStart(text: string): number {
  const bracketIdx: number = text.indexOf('[');
  const braceIdx: number = text.indexOf('{');

  if (bracketIdx === -1 && braceIdx === -1) return -1;
  if (bracketIdx === -1) return braceIdx;
  if (braceIdx === -1) return bracketIdx;

  return Math.min(bracketIdx, braceIdx);
}

/**
 * Extracts a balanced JSON structure starting from `startIdx`.
 * Handles nested brackets/braces and string literals (with escaped quotes).
 */
function extractBalancedJson(
  text: string,
  startIdx: number,
): string | null {
  const openChar: string = text[startIdx];
  const closeChar: string = openChar === '[' ? ']' : '}';

  let depth: number = 0;
  let inString: boolean = false;
  let escaped: boolean = false;

  for (let i: number = startIdx; i < text.length; i++) {
    const char: string = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === openChar) {
      depth++;
    } else if (char === closeChar) {
      depth--;
      if (depth === 0) {
        return text.slice(startIdx, i + 1);
      }
    }
  }

  return null;
}
