import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { useExerciseStats } from "./useExerciseStats";
import {
  clusterThoughtsByBelief,
  type ThoughtEntry,
} from "@/src/utils/insights/beliefClustering";
import { PRE_POST_FIELDS } from "@/src/constants/insights";
import type { ExerciseType } from "@/src/types/exerciseFlow";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BeliefDataPoint {
  date: string;
  preIntensity: number;
  postIntensity: number;
}

export type BeliefTrend = "weakening" | "stuck" | "stable";

export interface BeliefCluster {
  coreBeliefName: string;
  variants: string[];
  dataPoints: BeliefDataPoint[];
  firstPreIntensity: number;
  lastPostIntensity: number;
  decayPercentage: number;
  trend: BeliefTrend;
  message: string;
}

export interface BeliefDecayData {
  clusters: BeliefCluster[];
}

// ─── Extraction ──────────────────────────────────────────────────────────────

const THOUGHT_EXERCISE_TYPES: ExerciseType[] = [
  "thought_catcher",
  "thought_reframing",
  "abc_analysis",
];

function extractThoughtEntries(
  entries: Array<{
    exercise_type: ExerciseType;
    response: Record<string, any>;
    completed_at: string;
  }>,
): ThoughtEntry[] {
  const result: ThoughtEntry[] = [];
  let idx = 1;

  for (const entry of entries) {
    if (!THOUGHT_EXERCISE_TYPES.includes(entry.exercise_type)) continue;

    const r = entry.response;
    if (!r) continue;

    const text = r.automaticThought ?? r.belief ?? "";
    if (!text || text.trim().length < 5) continue;

    const field = PRE_POST_FIELDS[entry.exercise_type];
    let preIntensity = r.intensity ?? 50;
    let postIntensity: number | undefined;

    if (field) {
      const pre = r[field.pre];
      const post = r[field.post];
      if (typeof pre === "number") preIntensity = pre;
      if (typeof post === "number") postIntensity = post;
    }

    // For thought_reframing, intensity/postIntensity are direct fields
    if (entry.exercise_type === "thought_reframing") {
      if (typeof r.intensity === "number") preIntensity = r.intensity;
      if (typeof r.postIntensity === "number") postIntensity = r.postIntensity;
    }

    // For thought_catcher
    if (entry.exercise_type === "thought_catcher") {
      if (typeof r.intensity === "number") preIntensity = r.intensity;
      if (typeof r.postIntensity === "number") postIntensity = r.postIntensity;
    }

    result.push({
      index: idx++,
      text: text.slice(0, 200),
      date: entry.completed_at.slice(0, 10),
      preIntensity,
      postIntensity: postIntensity ?? preIntensity,
    });
  }

  return result.slice(0, 30);
}

// ─── Trend classification ────────────────────────────────────────────────────

function classifyBeliefTrend(decayPct: number): BeliefTrend {
  if (decayPct >= 20) return "weakening";
  if (decayPct <= -10) return "stuck";
  return "stable";
}

function generateBeliefMessage(
  name: string,
  trend: BeliefTrend,
  decayPct: number,
): string {
  switch (trend) {
    case "weakening":
      return `"${name}" has lost ${Math.abs(decayPct)}% of its grip. Your challenges are working.`;
    case "stuck":
      return `"${name}" is persistent. That's common · try a different technique or angle.`;
    case "stable":
      return `"${name}" is steady. Consistent practice will shift it over time.`;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const MIN_ENTRIES = 5;
const MIN_CLUSTER_SIZE = 3;

export function useBeliefDecay(): {
  data: BeliefDecayData | null;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const { data: stats } = useExerciseStats();

  const thoughtEntries = useMemo(
    () => extractThoughtEntries(stats?.entries ?? []),
    [stats],
  );

  const hasEnoughData = thoughtEntries.length >= MIN_ENTRIES;

  const query = useQuery<BeliefDecayData | null>({
    queryKey: ["belief_decay", user?.id, thoughtEntries.length],
    queryFn: async () => {
      if (!hasEnoughData) return null;

      const rawClusters = await clusterThoughtsByBelief(thoughtEntries);
      if (!rawClusters || rawClusters.length === 0) return null;

      const clusters: BeliefCluster[] = rawClusters
        .map((raw) => {
          const clusterEntries = raw.thoughtIndices
            .map((i) => thoughtEntries[i - 1])
            .filter(Boolean)
            .sort((a, b) => a.date.localeCompare(b.date));

          if (clusterEntries.length < MIN_CLUSTER_SIZE) return null;

          const variants = clusterEntries.map((e) => e.text);
          const dataPoints: BeliefDataPoint[] = clusterEntries.map((e) => ({
            date: e.date,
            preIntensity: e.preIntensity,
            postIntensity: e.postIntensity ?? e.preIntensity,
          }));

          const firstPre = dataPoints[0].preIntensity;
          const lastPost = dataPoints[dataPoints.length - 1].postIntensity;
          const decayPct =
            firstPre > 0
              ? Math.round(((firstPre - lastPost) / firstPre) * 100)
              : 0;

          const trend = classifyBeliefTrend(decayPct);
          const message = generateBeliefMessage(
            raw.coreBeliefName,
            trend,
            decayPct,
          );

          return {
            coreBeliefName: raw.coreBeliefName,
            variants,
            dataPoints,
            firstPreIntensity: firstPre,
            lastPostIntensity: lastPost,
            decayPercentage: decayPct,
            trend,
            message,
          } satisfies BeliefCluster;
        })
        .filter(Boolean)
        .sort(
          (a, b) => Math.abs(b!.decayPercentage) - Math.abs(a!.decayPercentage),
        )
        .slice(0, 3) as BeliefCluster[];

      if (clusters.length === 0) return null;
      return { clusters };
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
