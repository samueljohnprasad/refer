import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "@/src/context/AuthContext";
import { useExerciseStats } from "./useExerciseStats";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import {
  PRE_POST_FIELDS,
  EXERCISE_LABELS,
  DISTORTION_LABELS,
} from "@/src/constants/insights";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TherapistInsight {
  coreBeliefIdentified: string;
  manifestations: Array<{
    situation: string;
    distortion: string;
    exerciseType: string;
  }>;
  whatIsWorking: string;
  bestEvidence: string;
  suggestion: string;
  generatedAt: string;
  weekNumber: number;
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

// ─── Session extraction ──────────────────────────────────────────────────────

interface SessionSummary {
  date: string;
  exerciseType: string;
  exerciseLabel: string;
  situation: string;
  automaticThought: string;
  distortions: string[];
  evidenceAgainst: string[];
  balancedThought: string;
  preScore: number | null;
  postScore: number | null;
  delta: number | null;
}

function extractSessionSummaries(
  entries: Array<{
    exercise_type: ExerciseType;
    response: Record<string, any>;
    completed_at: string;
  }>,
): SessionSummary[] {
  const cutoff = new Date(Date.now() - 28 * 86_400_000).toISOString();
  const recent = entries.filter((e) => e.completed_at >= cutoff);

  const summaries: SessionSummary[] = [];

  for (const entry of recent) {
    const r = entry.response;
    if (!r) continue;

    const situation =
      r.situation ?? r.activatingEvent ?? r.fearedCatastrophe ?? r.worry ?? "";
    const thought =
      r.automaticThought ?? r.belief ?? r.currentThoughtLoop ?? "";

    if (!situation && !thought) continue;

    const field = PRE_POST_FIELDS[entry.exercise_type];
    let pre: number | null = null;
    let post: number | null = null;
    if (field) {
      const preVal = r[field.pre];
      const postVal = r[field.post];
      if (typeof preVal === "number") pre = preVal;
      if (typeof postVal === "number") post = postVal;
    }

    // Also check direct intensity fields
    if (pre === null && typeof r.intensity === "number") pre = r.intensity;
    if (post === null && typeof r.postIntensity === "number")
      post = r.postIntensity;

    summaries.push({
      date: entry.completed_at.slice(0, 10),
      exerciseType: entry.exercise_type,
      exerciseLabel:
        EXERCISE_LABELS[entry.exercise_type] ?? entry.exercise_type,
      situation: situation.slice(0, 150),
      automaticThought: thought.slice(0, 150),
      distortions: ((r.selectedDistortions as string[]) ?? []).map(
        (d) => DISTORTION_LABELS[d] ?? d,
      ),
      evidenceAgainst: ((r.evidenceAgainst as string[]) ?? []).slice(0, 5),
      balancedThought: (r.balancedThought ?? r.alternativeBelief ?? "").slice(
        0,
        150,
      ),
      preScore: pre,
      postScore: post,
      delta:
        pre !== null && post !== null
          ? field?.direction === "post_minus_pre"
            ? post - pre
            : pre - post
          : null,
    });
  }

  return summaries.slice(0, 15);
}

// ─── Gemini synthesis ────────────────────────────────────────────────────────

async function generateTherapistInsight(
  sessions: SessionSummary[],
): Promise<TherapistInsight | null> {
  const sessionText = sessions
    .map((s, i) => {
      let text = `${i + 1}. ${s.date}, ${s.exerciseLabel}`;
      if (s.situation) text += `\n   Situation: "${s.situation}"`;
      if (s.automaticThought) text += `\n   Thought: "${s.automaticThought}"`;
      if (s.distortions.length > 0)
        text += `\n   Distortions: ${s.distortions.join(", ")}`;
      if (s.evidenceAgainst.length > 0)
        text += `\n   Evidence against: ${s.evidenceAgainst.map((e) => `"${e}"`).join("; ")}`;
      if (s.balancedThought)
        text += `\n   Balanced thought: "${s.balancedThought}"`;
      if (s.delta !== null)
        text += `\n   Intensity shift: ${s.preScore} → ${s.postScore} (−${s.delta})`;
      return text;
    })
    .join("\n\n");

  const prompt = `You are a CBT therapist reviewing a client's exercise journal for the past month. Analyze these sessions holistically, don't just summarize, synthesize. Connect dots the client can't see.

Sessions:
${sessionText}

As their therapist, provide:
1. coreBeliefIdentified: The single core belief or schema driving most of these patterns (one sentence in quotes, e.g., "If I make a mistake, people will reject me")
2. manifestations: How this belief shows up across situations (2-3 examples, each with the situation, which distortion it triggered, and which exercise type)
3. whatIsWorking: Which techniques/evidence have been most effective for this client (be specific, reference their actual evidence-against texts or exercise types with good delta scores)
4. bestEvidence: Quote the single strongest piece of evidence-against text the client has generated that disproves their core belief (copy it verbatim from their entries)
5. suggestion: One specific, actionable suggestion for next week (not generic advice, tailored to their pattern)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          coreBeliefIdentified: { type: "string" },
          manifestations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                situation: { type: "string" },
                distortion: { type: "string" },
                exerciseType: { type: "string" },
              },
              required: ["situation", "distortion", "exerciseType"],
            },
          },
          whatIsWorking: { type: "string" },
          bestEvidence: { type: "string" },
          suggestion: { type: "string" },
        },
        required: [
          "coreBeliefIdentified",
          "manifestations",
          "whatIsWorking",
          "bestEvidence",
          "suggestion",
        ],
      },
    },
  });

  if (!response.text) return null;
  const parsed = JSON.parse(response.text);

  const now = new Date();
  const weekNumber = Math.ceil(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
      (7 * 86_400_000),
  );

  return {
    ...parsed,
    generatedAt: now.toISOString(),
    weekNumber,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const MIN_SESSIONS = 5;

export function useTherapistNotebook(): {
  data: TherapistInsight | null;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const { data: stats } = useExerciseStats();
  const { saveCard } = useCopingCards();

  const sessions = useMemo(
    () => extractSessionSummaries(stats?.entries ?? []),
    [stats],
  );

  const hasEnoughData = sessions.length >= MIN_SESSIONS;

  const now = new Date();
  const weekNumber = Math.ceil(
    (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
      (7 * 86_400_000),
  );

  const query = useQuery<TherapistInsight | null>({
    queryKey: ["therapist_notebook", user?.id, weekNumber, sessions.length],
    queryFn: async () => {
      if (!hasEnoughData) return null;

      const insight = await generateTherapistInsight(sessions);
      if (!insight) return null;

      // Evidence-to-Coping-Card bridge: auto-save best evidence as a card
      if (insight.bestEvidence && insight.bestEvidence.trim().length > 10) {
        try {
          await saveCard({
            exercise_type: "thought_reframing",
            reframe_text: insight.bestEvidence,
            reframe_label: "Evidence from your Notebook",
          });
        } catch {
          // Non-critical — don't fail the insight if card save fails
        }
      }

      return insight;
    },
    enabled: !!user?.id && hasEnoughData,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    gcTime: 14 * 24 * 60 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
  };
}
