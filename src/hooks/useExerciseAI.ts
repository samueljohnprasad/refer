import { useState, useCallback, useRef } from "react";
import { generateObject, jsonSchema } from "ai";
import { useActiveModel } from "@/src/hooks/useActiveModel";
import { GLOBAL_AI_CONFIG } from "@/src/constants/ai";
import type { AIStepConfig } from "@/src/types/exerciseFlow";

export interface UseExerciseAIReturn {
  suggestions: any[];
  isLoading: boolean;
  error: string | null;
  downloadProgress: number;
  generate: (response: Record<string, any>) => Promise<void>;
  clear: () => void;
}

export function useExerciseAI<T extends Record<string, any>>(
  aiConfig: AIStepConfig<T> | undefined,
): UseExerciseAIReturn {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionSeedRef = useRef<number>(Math.random());
  const cacheRef = useRef<Record<string, any[]>>({});
  const lastPromptRef = useRef<string>("");

  const { getActiveModel, getStructuredPrompt, downloadProgress } = useActiveModel();

  const generate = useCallback(
    async (response: Record<string, any>): Promise<void> => {
      if (!aiConfig) return;

      const prompt = aiConfig.promptBuilder(response as T, { seed: sessionSeedRef.current });
      if (!prompt.trim()) return;

      // Skip if same prompt already fetched, or instantly restore from cache
      if (prompt === lastPromptRef.current && suggestions.length > 0) return;
      if (cacheRef.current[prompt]) {
        setSuggestions(cacheRef.current[prompt]);
        lastPromptRef.current = prompt;
        return;
      }

      lastPromptRef.current = prompt;

      setIsLoading(true);
      setError(null);

      const maxResults = aiConfig.maxResults ?? 5;

      try {
        let items: any[] = [];

        // Race against timeout
        await Promise.race([
          (async () => {
            const model = await getActiveModel();
            const structuredPrompt = getStructuredPrompt(prompt);

            const { object } = await generateObject({
              model,
              schema: jsonSchema(aiConfig.responseSchema),
              prompt: structuredPrompt,
            });
            
            const parsed = object as any;
            items = Array.isArray(parsed)
              ? parsed.slice(0, maxResults)
              : [parsed];
          })(),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("AI request timed out")),
              GLOBAL_AI_CONFIG.TIMEOUT_MS,
            ),
          ),
        ]);

        cacheRef.current[prompt] = items;
        setSuggestions(items);
      } catch (err: any) {
        console.error("AI generation failed:", err);
        setError(err?.message ?? "AI request failed");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [aiConfig, suggestions.length, getActiveModel, getStructuredPrompt],
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
    downloadProgress,
    generate,
    clear,
  };
}
