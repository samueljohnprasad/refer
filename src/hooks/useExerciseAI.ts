import { useState, useCallback, useRef } from "react";
import { Platform } from "react-native";
import { generateObject } from "ai";
import { jsonSchema } from "ai";
import { apple } from "@react-native-ai/apple";
import { GoogleGenAI } from "@google/genai";
import type { AIStepConfig } from "@/src/types/exerciseFlow";

const AI_TIMEOUT_MS = 20_000;

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

  const sessionSeedRef = useRef<number>(Math.random());
  const cacheRef = useRef<Record<string, any[]>>({});
  const lastPromptRef = useRef<string>("");

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
      const isAppleAIAvailable =
        Platform.OS === "ios" && typeof apple.isAvailable === "function"
          ? apple.isAvailable()
          : false;

      try {
        let items: any[] = [];

        // Race against timeout
        await Promise.race([
          (async () => {
            if (isAppleAIAvailable) {
              const { object } = await generateObject({
                model: apple(),
                schema: jsonSchema(aiConfig.responseSchema),
                prompt: prompt,
              });
              const parsed = object as any;
              items = Array.isArray(parsed)
                ? parsed.slice(0, maxResults)
                : [parsed];
            } else {
              // Fallback to Gemini if Apple Intelligence is unavailable
              const ai = new GoogleGenAI({
                apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
              });
              const model = aiConfig.model ?? "gemini-3-flash-preview";

              const result = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                  responseMimeType: "application/json",
                  responseSchema: aiConfig.responseSchema,
                },
              });

              if (result.text) {
                const parsed = JSON.parse(result.text);
                items = Array.isArray(parsed)
                  ? parsed.slice(0, maxResults)
                  : [parsed];
              }
            }
          })(),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("AI request timed out")),
              AI_TIMEOUT_MS,
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
