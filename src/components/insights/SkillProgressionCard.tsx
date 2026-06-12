import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import {
  useSkillProgression,
  type SkillTrend,
  type RelapseAlert,
  type WeeklyDataPoint,
} from "@/src/hooks/insights/useSkillProgression";
import { SAGE, GOLD, INK_MUTED } from "@/lib/tokens";
import { EXERCISE_LABELS } from "@/src/constants/insights";

// ─── Mini Sparkline ──────────────────────────────────────────────────────────

function Sparkline({
  data,
  trend,
}: {
  data: WeeklyDataPoint[];
  trend: "improving" | "stable" | "declining";
}) {
  if (data.length === 0) return null;

  const values = data.map((d) => d.avgDelta);
  const max = Math.max(...values, 1);
  const dotColor =
    trend === "improving"
      ? SAGE[500]
      : trend === "declining"
        ? GOLD
        : INK_MUTED;

  return (
    <View className="flex-row items-end gap-1 h-5">
      {values.map((v, i) => {
        const height = Math.max((v / max) * 20, 3);
        return (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: 4,
              height,
              backgroundColor: dotColor,
              opacity: 0.4 + (i / values.length) * 0.6,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Trend Badge ─────────────────────────────────────────────────────────────

function TrendBadge({
  trend,
  rate,
}: {
  trend: "improving" | "stable" | "declining";
  rate: number;
}) {
  const config = {
    improving: {
      text: `improving${rate > 0 ? ` (+${rate}%/wk)` : ""}`,
      bg: "bg-sage-pill",
      color: "text-sage-700",
    },
    stable: {
      text: "stable",
      bg: "bg-slate-100",
      color: "text-ink-muted",
    },
    declining: {
      text: "needs attention",
      bg: "bg-amber-50",
      color: "text-amber-700",
    },
  }[trend];

  return (
    <View className={`px-2 py-0.5 rounded-full ${config.bg}`}>
      <Text className={`text-[10px] font-bold ${config.color}`}>
        {config.text}
      </Text>
    </View>
  );
}

// ─── Skill Row ───────────────────────────────────────────────────────────────

function SkillRow({ skill }: { skill: SkillTrend }) {
  return (
    <View className="flex-row items-center py-3">
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-[14px] font-bold text-ink">{skill.label}</Text>
          <TrendBadge trend={skill.overallTrend} rate={skill.improvementRate} />
        </View>
        <Text className="text-[11px] text-ink-muted" numberOfLines={1}>
          {skill.message}
        </Text>
      </View>
      <View className="ml-3">
        <Sparkline data={skill.weeklyData} trend={skill.overallTrend} />
      </View>
    </View>
  );
}

// ─── Relapse Alert Card ──────────────────────────────────────────────────────

function RelapseAlertCard({ alert }: { alert: RelapseAlert }) {
  return (
    <View className="rounded-xl p-3 mt-2 bg-amber-50 border border-amber-200/60">
      <Text className="text-[13px] font-semibold text-amber-800 mb-1">
        {alert.label} needs a reset
      </Text>
      <Text className="text-[12px] text-amber-700 leading-relaxed">
        {alert.message}
        {alert.suggestedExercise && (
          <Text className="font-bold">
            {" "}
            Try{" "}
            {EXERCISE_LABELS[alert.suggestedExercise] ??
              alert.suggestedExercise}
            .
          </Text>
        )}
      </Text>
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SkillProgressionCard() {
  const { data, isLoading } = useSkillProgression();

  if (isLoading || !data) return null;

  const activeTrends = data.trends.filter((t) => t.totalSessions >= 3);
  if (activeTrends.length === 0) return null;

  return (
    <View className="happy-brand-card rounded-2xl p-5 mb-4">
      <Text className="happy-font-body-bold text-[14px] text-ink mb-1">
        Your Skills
      </Text>
      <Text className="text-[12px] text-ink-muted mb-2">
        How effective your practice is getting over time
      </Text>

      {activeTrends.map((skill) => (
        <SkillRow key={skill.skill} skill={skill} />
      ))}

      {data.relapseAlerts.map((alert) => (
        <RelapseAlertCard key={alert.category} alert={alert} />
      ))}
    </View>
  );
}

SkillProgressionCard.displayName = "SkillProgressionCard";
