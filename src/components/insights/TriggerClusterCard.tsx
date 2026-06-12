import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import {
  useTriggerClusters,
  type TriggerCluster,
} from "@/src/hooks/insights/useTriggerClusters";
import { SAGE, INK_MUTED } from "@/lib/tokens";

function ClusterRow({ cluster }: { cluster: TriggerCluster }) {
  const router = useRouter();

  return (
    <View className="py-3">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text
          className="text-[14px] font-bold text-ink flex-1"
          numberOfLines={1}
        >
          {cluster.theme}
        </Text>
        <View className="bg-sage-pill px-2 py-0.5 rounded-full ml-2">
          <Text className="text-[11px] font-bold text-sage-700">
            {cluster.percentage}%
          </Text>
        </View>
      </View>

      {/* Chips row */}
      <View className="flex-row flex-wrap gap-1.5 mb-1.5">
        {cluster.topDistortions.map((d) => (
          <View key={d} className="bg-slate-100 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-semibold text-ink-muted">
              {d}
            </Text>
          </View>
        ))}
        {cluster.topEmotions.map((e) => (
          <View key={e} className="bg-amber-50 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-semibold text-amber-700">
              {e}
            </Text>
          </View>
        ))}
        {cluster.peakHours.length > 0 && (
          <View className="bg-blue-50 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-semibold text-blue-600">
              Peak: {cluster.peakHours[0]}–{cluster.peakHours[2] + 1}h
            </Text>
          </View>
        )}
      </View>

      {/* Best exercise */}
      {cluster.bestExercise && (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/tabs/screens/exercise-flow",
              params: { type: cluster.bestExercise!.type },
            })
          }
          className="flex-row items-center gap-1 active:opacity-70 mt-0.5"
        >
          <Text className="text-[11px] text-sage-600 font-semibold">
            Best tool: {cluster.bestExercise.label} (−
            {cluster.bestExercise.avgDrop})
          </Text>
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} color={SAGE[500]} />
        </Pressable>
      )}
    </View>
  );
}

export function TriggerClusterCard() {
  const { data, isLoading } = useTriggerClusters();

  if (isLoading || !data || data.clusters.length === 0) return null;

  return (
    <View className="happy-brand-card rounded-2xl p-5 mb-4">
      <Text className="happy-font-body-bold text-[14px] text-ink mb-1">
        Your Pattern
      </Text>
      <Text className="text-[12px] text-ink-muted mb-2">
        What triggers your anxiety — detected from your exercises
      </Text>

      {data.clusters.map((cluster, i) => (
        <ClusterRow key={cluster.theme} cluster={cluster} />
      ))}

      {data.summary && (
        <View className="mt-2 pt-3 border-t border-brand-border">
          <Text className="text-[12px] text-ink-soft leading-relaxed">
            {data.summary}
          </Text>
        </View>
      )}
    </View>
  );
}

TriggerClusterCard.displayName = "TriggerClusterCard";
