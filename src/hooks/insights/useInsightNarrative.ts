import { useQuery } from "@tanstack/react-query";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "@/src/context/AuthContext";
import { usePersonalEffectiveness } from "./usePersonalEffectiveness";
import { useSkillProgression } from "./useSkillProgression";
import { useTemporalPatterns } from "./useTemporalPatterns";
import { useTriggerClusters } from "./useTriggerClusters";
import { EXERCISE_LABELS, DISTORTION_LABELS } from "@/src/constants/insights";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InsightNarrativeData {
  narrative: string;
  generatedAt: string;
}

// ─── Gemini client ───────────────────────────────────────────────────────────

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useInsightNarrative(): {
  data: InsightNarrativeData | null;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const { data: effectiveness } = usePersonalEffectiveness();
  const { data: skillData } = useSkillProgression();
  const { data: temporalData } = useTemporalPatterns();
  const { data: triggerData } = useTriggerClusters();

  // Only generate when we have at least effectiveness data
  const hasEnoughData = !!effectiveness?.bestOverall;

  // Build a stable key that changes when underlying data shifts meaningfully
  const dataSignature = [
    effectiveness?.bestOverall?.exerciseType ?? "",
    skillData?.trends.map((t) => t.overallTrend).join(",") ?? "",
    temporalData?.timeOfDay?.peakWindow.start ?? "",
    triggerData?.clusters[0]?.theme ?? "",
  ].join("|");

  const query = useQuery<InsightNarrativeData | null>({
    queryKey: ["insight_narrative", user?.id, dataSignature],
    queryFn: async () => {
      if (!hasEnoughData) return null;

      const input = buildNarrativeInput(
        effectiveness,
        skillData,
        temporalData,
        triggerData,
      );

      const narrative = await generateNarrative(input);
      if (!narrative) return null;

      return {
        narrative,
        generatedAt: new Date().toISOString(),
      };
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

// ─── Build structured input from computed hooks ──────────────────────────────

interface NarrativeInput {
  bestExercise: string | null;
  bestExerciseDrop: number | null;
  skillTrends: string;
  temporalPeak: string | null;
  topTrigger: string | null;
  topDistortion: string | null;
  relapseDetected: boolean;
}

function buildNarrativeInput(
  effectiveness: ReturnType<typeof usePersonalEffectiveness>["data"],
  skillData: ReturnType<typeof useSkillProgression>["data"],
  temporalData: ReturnType<typeof useTemporalPatterns>["data"],
  triggerData: ReturnType<typeof useTriggerClusters>["data"],
): NarrativeInput {
  const best = effectiveness?.bestOverall;

  const skillTrends = (skillData?.trends ?? [])
    .filter((t) => t.totalSessions >= 3)
    .map(
      (t) =>
        `${t.label}: ${t.overallTrend}${t.improvementRate ? ` (${t.improvementRate > 0 ? "+" : ""}${t.improvementRate}%/wk)` : ""}`,
    )
    .join(", ");

  const topCluster = triggerData?.clusters[0];

  return {
    bestExercise: best
      ? (EXERCISE_LABELS[best.exerciseType] ?? best.exerciseType)
      : null,
    bestExerciseDrop: best?.avgDrop ?? null,
    skillTrends: skillTrends || "not enough data yet",
    temporalPeak: temporalData?.timeOfDay?.label ?? null,
    topTrigger: topCluster?.theme ?? null,
    topDistortion: topCluster?.topDistortions[0] ?? null,
    relapseDetected: (skillData?.relapseAlerts.length ?? 0) > 0,
  };
}

// ─── Generate narrative via Gemini ───────────────────────────────────────────

async function generateNarrative(
  input: NarrativeInput,
): Promise<string | null> {
  const parts: string[] = [];

  if (input.bestExercise && input.bestExerciseDrop) {
    parts.push(
      `- Best technique: ${input.bestExercise} (drops intensity by ${input.bestExerciseDrop} per session)`,
    );
  }
  parts.push(`- Skill trends: ${input.skillTrends}`);
  if (input.temporalPeak) parts.push(`- Timing: ${input.temporalPeak}`);
  if (input.topTrigger) parts.push(`- Top trigger theme: ${input.topTrigger}`);
  if (input.topDistortion)
    parts.push(`- Top thinking trap: ${input.topDistortion}`);
  if (input.relapseDetected)
    parts.push(`- Note: recent decline detected in one skill area`);

  const prompt = `You are a warm, insightful CBT companion. Given this user's exercise data summary, write 3-4 sentences that connect the patterns into a meaningful insight. Be specific (use their actual numbers), warm (not clinical), and actionable (end with encouragement or what to do next).

Data:
${parts.join("\n")}

Rules:
- Write as direct address ("you"), max 4 sentences
- No bullet points, no headers, just a flowing paragraph
- Reference specific numbers from the data
- End on an encouraging or actionable note
- Tone: like a supportive coach who genuinely knows this person`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "text/plain",
    },
  });

  const text = response.text?.trim();
  if (!text || text.length < 20) return null;
  return text;
}
