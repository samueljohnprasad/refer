import { useQuery } from "@tanstack/react-query";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "@/src/context/AuthContext";
import { useExerciseStats } from "./useExerciseStats";

export interface ThoughtTheme {
  theme: string;
  count: number;
}

export interface ThoughtPatternsData {
  themes: ThoughtTheme[];
  triggerContext: string;
  insight: string;
}

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

export function useThoughtPatterns(): {
  data: ThoughtPatternsData | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { user } = useAuth();
  const { data: stats } = useExerciseStats();

  const thoughtTexts = extractThoughtTexts(stats?.entries ?? []);
  const hasEnoughData = thoughtTexts.length >= 5;

  const query = useQuery<ThoughtPatternsData | null>({
    queryKey: ["thought_patterns", user?.id, thoughtTexts.length],
    queryFn: async () => {
      if (!hasEnoughData) return null;
      return analyzePatterns(thoughtTexts);
    },
    enabled: !!user?.id && hasEnoughData,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

function extractThoughtTexts(
  entries: { exercise_type: string; response: Record<string, any> }[],
): string[] {
  const texts: string[] = [];

  for (const entry of entries) {
    const r = entry.response;
    if (!r) continue;

    if (entry.exercise_type === "thought_reframing") {
      const parts = [r.situation, r.automaticThought].filter(Boolean);
      if (parts.length > 0) texts.push(parts.join(" — "));
    } else if (entry.exercise_type === "thought_catcher") {
      const parts = [r.situation, r.automaticThought].filter(Boolean);
      if (parts.length > 0) texts.push(parts.join(" — "));
    } else if (entry.exercise_type === "recognizing_rumination") {
      if (r.ruminativeThought) texts.push(r.ruminativeThought);
    } else if (entry.exercise_type === "decatastrophizing") {
      if (r.worstCase) texts.push(r.worstCase);
    } else if (entry.exercise_type === "worry_time") {
      if (r.worries && Array.isArray(r.worries)) {
        texts.push(...r.worries.filter(Boolean));
      }
    }
  }

  return texts.slice(0, 30);
}

async function analyzePatterns(
  thoughts: string[],
): Promise<ThoughtPatternsData | null> {
  const prompt = `Analyze these automatic thoughts/situations from a CBT exercise user (last 30 entries). Identify recurring themes and provide a brief therapeutic insight.

Thoughts:
${thoughts.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return JSON with:
- themes: array of {theme: string (2-3 word label), count: number (how many thoughts fit this theme)}. Max 3 themes, sorted by count descending.
- triggerContext: one sentence describing the most common context/situation triggering these thoughts
- insight: one personalized therapeutic sentence about what this pattern reveals and a gentle suggestion`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          themes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                theme: { type: "string" },
                count: { type: "integer" },
              },
              required: ["theme", "count"],
            },
          },
          triggerContext: { type: "string" },
          insight: { type: "string" },
        },
        required: ["themes", "triggerContext", "insight"],
      },
    },
  });

  if (!response.text) return null;
  return JSON.parse(response.text);
}
