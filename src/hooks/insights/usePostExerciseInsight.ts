import { useMemo } from "react";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { useExerciseStatsByType } from "./useExerciseStats";
import { PRE_POST_FIELDS, CATEGORY_LABELS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

export interface PostExerciseInsight {
  message: string;
  detail: string | null;
  tone: "encouraging" | "celebrating" | "curious";
}

function getShiftFromResponse(
  response: Record<string, any>,
  exerciseType: ExerciseType,
): number | null {
  const field = PRE_POST_FIELDS[exerciseType];
  if (!field) return null;

  const pre = response[field.pre];
  const post = response[field.post];
  if (typeof pre !== "number" || typeof post !== "number") return null;

  return field.direction === "pre_minus_post" ? pre - post : post - pre;
}

const SHIFT_VERBS: Partial<Record<ExerciseCategory, string>> = {
  mindfulness: "calmer",
  anxiety: "less anxious",
  overthinking: "less stuck",
};

export function usePostExerciseInsight(
  exerciseType: ExerciseType,
  currentResponse: Record<string, any>,
): PostExerciseInsight | null {
  const typeStats = useExerciseStatsByType(exerciseType);

  return useMemo(() => {
    if (!typeStats) return null;

    const { totalForType, thisWeekForType, category, entries } = typeStats;
    const shift = getShiftFromResponse(currentResponse, exerciseType);

    // Milestone celebrations
    const milestones = [50, 25, 10, 5];
    for (const m of milestones) {
      if (totalForType + 1 === m) {
        return {
          message: `That's your ${m}th ${CATEGORY_LABELS[category].toLowerCase()} exercise!`,
          detail: "Consistency is the #1 predictor of progress.",
          tone: "celebrating" as const,
        };
      }
    }

    // Show shift for this session if significant
    if (shift !== null && shift > 0) {
      const avgShift = computeAvgShift(entries, exerciseType);
      const detail =
        avgShift !== null
          ? `Your average shift is ${avgShift.toFixed(1)} points — ${shift > avgShift ? "this session was above average!" : "building the habit matters most."}`
          : null;

      return {
        message: `You feel ${shift} point${shift > 1 ? "s" : ""} ${SHIFT_VERBS[category] || "better"} than when you started.`,
        detail,
        tone: shift >= 3 ? ("celebrating" as const) : ("encouraging" as const),
      };
    }

    // Weekly count
    if (thisWeekForType > 1) {
      return {
        message: `That's your ${thisWeekForType + 1}${getOrdinalSuffix(thisWeekForType + 1)} session this week.`,
        detail:
          totalForType > 5 ? `${totalForType + 1} total and counting.` : null,
        tone: "encouraging" as const,
      };
    }

    // Generic encouraging
    if (totalForType >= 1) {
      return {
        message: `${totalForType + 1} ${CATEGORY_LABELS[category].toLowerCase()} sessions completed.`,
        detail: "Every practice session strengthens your skills.",
        tone: "encouraging" as const,
      };
    }

    return {
      message: "First one done — that's the hardest part.",
      detail: "You've taken the most important step: starting.",
      tone: "celebrating" as const,
    };
  }, [typeStats, currentResponse, exerciseType]);
}

function computeAvgShift(
  entries: { response: Record<string, any>; exercise_type: ExerciseType }[],
  exerciseType: ExerciseType,
): number | null {
  const shifts: number[] = [];
  for (const entry of entries) {
    const s = getShiftFromResponse(entry.response, exerciseType);
    if (s !== null) shifts.push(s);
  }
  return average(shifts);
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
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
