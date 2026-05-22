import { useState, useCallback, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import type { AIStepConfig } from "@/src/types/exerciseFlow";

// Reuse the same Gemini client + API key from existing AI hooks
const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

const AI_TIMEOUT_MS = 10_000;

export interface UseExerciseAIReturn {
  suggestions: any[];
  isLoading: boolean;
  error: string | null;
  generate: (response: Record<string, any>) => Promise<void>;
  clear: () => void;
}

export function useExerciseAI<T extends Record<string, any>>(
  aiConfig: AIStepConfig<T> | undefined,
): UseExerciseAIReturn {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache: avoid re-fetching if prompt hasn't changed
  const lastPromptRef = useRef<string>("");

  const generate = useCallback(
    async (response: Record<string, any>): Promise<void> => {
      if (!aiConfig) return;

      const prompt = aiConfig.promptBuilder(response as T);
      if (!prompt.trim()) return;

      // Skip if same prompt already fetched
      if (prompt === lastPromptRef.current && suggestions.length > 0) return;
      lastPromptRef.current = prompt;

      setIsLoading(true);
      setError(null);

      const model = aiConfig.model ?? "gemini-3-flash-preview";
      const maxResults = aiConfig.maxResults ?? 5;

      try {
        // Race against timeout
        const result = await Promise.race([
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: aiConfig.responseSchema,
            },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("AI request timed out")),
              AI_TIMEOUT_MS,
            ),
          ),
        ]);

        if (result.text) {
          try {
            const parsed = JSON.parse(result.text);
            const items = Array.isArray(parsed)
              ? parsed.slice(0, maxResults)
              : [parsed];
            setSuggestions(items);
          } catch {
            console.error("AI JSON parse failure:", result.text);
            setError("Failed to parse AI response");
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (err: any) {
        console.error("AI generation failed:", err);
        setError(err?.message ?? "AI request failed");
        // Exercises must work without AI — return empty
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [aiConfig, suggestions.length],
  );

  const clear = useCallback(() => {
    setSuggestions([]);
    setError(null);
    lastPromptRef.current = "";
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    generate,
    clear,
  };
}
