import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockIcon } from "@hugeicons/core-free-icons";
import {
  useBeliefDecay,
  type BeliefCluster,
  type BeliefDataPoint,
} from "@/src/hooks/insights/useBeliefDecay";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { SAGE, GOLD, INK_MUTED, BRAND_BORDER_STRONG } from "@/lib/tokens";

// ─── Mini dot chart ──────────────────────────────────────────────────────────

function BeliefDotChart({ dataPoints }: { dataPoints: BeliefDataPoint[] }) {
  if (dataPoints.length === 0) return null;

  const maxIntensity = Math.max(...dataPoints.map((d) => d.preIntensity), 100);

  return (
    <View className="flex-row items-end gap-2 h-8 mt-2 mb-1">
      {dataPoints.map((point, i) => {
        const height = Math.max((point.preIntensity / maxIntensity) * 28, 4);
        const isLast = i === dataPoints.length - 1;
        return (
          <View key={i} className="items-center">
            <View
              className="rounded-full"
              style={{
                width: 8,
                height,
                backgroundColor: isLast ? SAGE[500] : SAGE[300],
              }}
            />
            <Text className="text-[9px] text-ink-muted mt-1">
              {point.preIntensity}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Belief row ──────────────────────────────────────────────────────────────

function BeliefRow({ cluster }: { cluster: BeliefCluster }) {
  const badgeColor =
    cluster.trend === "weakening"
      ? { bg: "bg-sage-pill", text: "text-sage-700" }
      : cluster.trend === "stuck"
        ? { bg: "bg-amber-50", text: "text-amber-700" }
        : { bg: "bg-slate-100", text: "text-ink-muted" };

  const badgeText =
    cluster.trend === "weakening"
      ? `↓ Lost ${cluster.decayPercentage}% of its grip`
      : cluster.trend === "stuck"
        ? "Persistent — try a new angle"
        : "Steady";

  return (
    <View className="py-3">
      <Text className="text-[14px] font-bold text-ink mb-0.5" numberOfLines={1}>
        "{cluster.coreBeliefName}"
      </Text>
      <BeliefDotChart dataPoints={cluster.dataPoints} />
      <View
        className={`self-start px-2 py-0.5 rounded-full mt-1 ${badgeColor.bg}`}
      >
        <Text className={`text-[10px] font-bold ${badgeColor.text}`}>
          {badgeText}
        </Text>
      </View>
      <Text className="text-[11px] text-ink-muted mt-1.5 leading-relaxed">
        {cluster.message}
      </Text>
    </View>
  );
}

// ─── Locked state ────────────────────────────────────────────────────────────

function LockedBeliefCard({ onUnlock }: { onUnlock: () => void }) {
  return (
    <Pressable
      onPress={onUnlock}
      className="happy-brand-card rounded-2xl p-5 mb-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-2 mb-2">
        <HugeiconsIcon icon={LockIcon} size={16} color={INK_MUTED} />
        <Text className="happy-font-body-bold text-[14px] text-ink">
          Belief Tracker
        </Text>
        <View className="bg-purple-100 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-purple-700">PRO</Text>
        </View>
      </View>
      <Text className="text-[12px] text-ink-muted leading-relaxed">
        See which thoughts are losing power over time. Unlock to track your core
        beliefs weakening.
      </Text>
    </Pressable>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function BeliefDecayCard() {
  const { data, isLoading } = useBeliefDecay();
  const { hasPro, presentPaywall } = useRevenueCat();

  if (!hasPro) {
    return <LockedBeliefCard onUnlock={presentPaywall} />;
  }

  if (isLoading || !data || data.clusters.length === 0) return null;

  return (
    <View className="happy-brand-card rounded-2xl p-5 mb-4">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="happy-font-body-bold text-[14px] text-ink">
          Belief Tracker
        </Text>
        <View className="bg-purple-100 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-purple-700">PRO</Text>
        </View>
      </View>
      <Text className="text-[12px] text-ink-muted mb-2">
        How your core beliefs are changing over time
      </Text>

      {data.clusters.map((cluster) => (
        <BeliefRow key={cluster.coreBeliefName} cluster={cluster} />
      ))}
    </View>
  );
}

BeliefDecayCard.displayName = "BeliefDecayCard";
