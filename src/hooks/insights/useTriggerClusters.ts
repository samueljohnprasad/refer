import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "@/src/context/AuthContext";
import { useExerciseStats } from "./useExerciseStats";
import { usePersonalEffectiveness } from "./usePersonalEffectiveness";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import {
  PRE_POST_FIELDS,
  EXERCISE_LABELS,
  DISTORTION_LABELS,
} from "@/src/constants/insights";
import { countBy } from "@/src/utils/insights";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TriggerCluster {
  theme: string;
  count: number;
  percentage: number;
  peakHours: number[];
  topDistortions: string[];
  topEmotions: string[];
  bestExercise: { type: ExerciseType; label: string; avgDrop: number } | null;
  entrySummary: string;
}

export interface TriggerClustersData {
  clusters: TriggerCluster[];
  summary: string;
}

// ─── Gemini client ───────────────────────────────────────────────────────────

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

// ─── Entry extraction ────────────────────────────────────────────────────────

interface ClusterableEntry {
  situation: string;
  hour: number;
  distortions: string[];
  emotions: string[];
  exerciseType: ExerciseType;
  prePostDelta: number | null;
}

function extractClusterableEntries(
  entries: Array<{
    exercise_type: ExerciseType;
    response: Record<string, any>;
    completed_at: string;
  }>,
): ClusterableEntry[] {
  const result: ClusterableEntry[] = [];

  for (const entry of entries) {
    const r = entry.response;
    if (!r) continue;

    const situation =
      r.situation ??
      r.activatingEvent ??
      r.fearedCatastrophe ??
      r.worry ??
      r.currentThoughtLoop ??
      "";
    if (!situation || situation.trim().length < 5) continue;

    const field = PRE_POST_FIELDS[entry.exercise_type];
    let delta: number | null = null;
    if (field) {
      const pre = r[field.pre];
      const post = r[field.post];
      if (typeof pre === "number" && typeof post === "number") {
        delta = field.direction === "pre_minus_post" ? pre - post : post - pre;
      }
    }

    result.push({
      situation: situation.slice(0, 200),
      hour: new Date(entry.completed_at).getHours(),
      distortions: (r.selectedDistortions as string[]) ?? [],
      emotions: Array.isArray(r.selectedEmotions)
        ? r.selectedEmotions
            .map((e: any) => (typeof e === "string" ? e : e?.name))
            .filter(Boolean)
        : [],
      exerciseType: entry.exercise_type,
      prePostDelta: delta,
    });
  }

  return result.slice(0, 30);
}

// ─── Gemini clustering ───────────────────────────────────────────────────────

async function clusterSituations(
  entries: ClusterableEntry[],
): Promise<Array<{ theme: string; indices: number[] }> | null> {
  const situationList = entries
    .map(
      (e, i) =>
        `${i + 1}. "${e.situation}" (hour: ${e.hour}, distortions: ${e.distortions.join(", ") || "none"})`,
    )
    .join("\n");

  const prompt = `You are a CBT therapist reviewing a client's exercise journal. Categorize these situations into 3-5 trigger themes (e.g., "work authority", "social judgment", "health worry", "financial stress", "relationship conflict").

Situations:
${situationList}

Return a JSON array of themes, each with the indices (1-based) of situations that belong to it. Every situation must belong to exactly one theme.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            theme: { type: "string" },
            indices: { type: "array", items: { type: "integer" } },
          },
          required: ["theme", "indices"],
        },
      },
    },
  });

  if (!response.text) return null;
  return JSON.parse(response.text);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const MIN_ENTRIES = 8;

export function useTriggerClusters(): {
  data: TriggerClustersData | null;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const { data: stats } = useExerciseStats();
  const { data: effectiveness } = usePersonalEffectiveness();

  const clusterableEntries = useMemo(
    () => extractClusterableEntries(stats?.entries ?? []),
    [stats],
  );

  const hasEnoughData = clusterableEntries.length >= MIN_ENTRIES;

  const query = useQuery<TriggerClustersData | null>({
    queryKey: ["trigger_clusters", user?.id, clusterableEntries.length],
    queryFn: async () => {
      if (!hasEnoughData) return null;

      const rawClusters = await clusterSituations(clusterableEntries);
      if (!rawClusters || rawClusters.length === 0) return null;

      const clusters: TriggerCluster[] = rawClusters
        .map((raw) => {
          const clusterEntries = raw.indices
            .map((i) => clusterableEntries[i - 1])
            .filter(Boolean);

          if (clusterEntries.length === 0) return null;

          const hours = clusterEntries.map((e) => e.hour);
          const allDistortions = clusterEntries.flatMap((e) => e.distortions);
          const allEmotions = clusterEntries.flatMap((e) => e.emotions);

          const distortionCounts = countBy(allDistortions, (d) => d);
          const emotionCounts = countBy(allEmotions, (e) => e);

          const topDistortions = Object.entries(distortionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([key]) => DISTORTION_LABELS[key] ?? key);

          const topEmotions = Object.entries(emotionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([key]) => key);

          // Find peak 3-hour window
          const hourBuckets: Record<number, number> = {};
          for (const h of hours) {
            const bucket = Math.floor(h / 3) * 3;
            hourBuckets[bucket] = (hourBuckets[bucket] ?? 0) + 1;
          }
          const peakBucket = Object.entries(hourBuckets).sort(
            ([, a], [, b]) => b - a,
          )[0];
          const peakHours = peakBucket
            ? [
                Number(peakBucket[0]),
                Number(peakBucket[0]) + 1,
                Number(peakBucket[0]) + 2,
              ]
            : [];

          // Best exercise for this cluster from effectiveness data
          const exerciseTypesInCluster = countBy(
            clusterEntries,
            (e) => e.exerciseType,
          );
          const effectiveForCluster = effectiveness?.ranked.find(
            (score) => exerciseTypesInCluster[score.exerciseType],
          );
          const bestExercise = effectiveForCluster
            ? {
                type: effectiveForCluster.exerciseType,
                label: effectiveForCluster.exerciseLabel,
                avgDrop: effectiveForCluster.avgDrop,
              }
            : null;

          return {
            theme: raw.theme,
            count: clusterEntries.length,
            percentage: Math.round(
              (clusterEntries.length / clusterableEntries.length) * 100,
            ),
            peakHours,
            topDistortions,
            topEmotions,
            bestExercise,
            entrySummary: clusterEntries[0].situation.slice(0, 60) + "...",
          } satisfies TriggerCluster;
        })
        .filter(Boolean)
        .sort((a, b) => b!.count - a!.count)
        .slice(0, 3) as TriggerCluster[];

      const topCluster = clusters[0];
      const summary = topCluster
        ? `Most of your exercises involve ${topCluster.theme.toLowerCase()} (${topCluster.percentage}%). ${
            topCluster.topDistortions.length > 0
              ? `Your go-to trap here is ${topCluster.topDistortions[0]}.`
              : ""
          }`
        : "";

      return { clusters, summary };
    },
    enabled: !!user?.id && hasEnoughData,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
  };
}
