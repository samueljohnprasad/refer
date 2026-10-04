import { ScrollView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text } from "@/src/components/ui/Text";
import { LifeDomainScore } from "@/src/network/genAi";
import { useTranslation } from "react-i18next";
import { View } from "@/components/Themed";
import type { TFunction } from "i18next";

interface DomainPrediction {
  domain: string;
  predicted: number;
  trend: LifeDomainScore["trend"];
}

export type { DomainPrediction };

interface LifeDomainBalanceDetailsProps {
  data: LifeDomainScore[];
  predictions: DomainPrediction[];
  lowestDomain: LifeDomainScore | null;
  highestDomain: LifeDomainScore | null;
  needsAttentionCount: number;
  insight?: string;
}

const DOMAIN_KEYS: Record<string, string> = {
  "Work/Career": "workCareer",
  Relationships: "relationships",
  Health: "health",
  "Personal Growth": "personalGrowth",
  Recreation: "recreation",
  Spirituality: "spirituality",
};

const DOMAIN_ICONS: Record<string, string> = {
  "Work/Career": "💼",
  Relationships: "❤️",
  Health: "🏃",
  "Personal Growth": "🌱",
  Recreation: "🎮",
  Spirituality: "🧘",
};

const DOMAIN_COLORS: Record<string, string> = {
  "Work/Career": "#7B61FF",
  Relationships: "#EC4899",
  Health: "#10B981",
  "Personal Growth": "#F59E0B",
  Recreation: "#3B82F6",
  Spirituality: "#8B5CF6",
};

export function translateLifeDomain(t: TFunction<"insights">, domain: string) {
  const key = DOMAIN_KEYS[domain];
  return key ? String(t(`lifeBalance.domains.${key}`, { defaultValue: domain })) : domain;
}

export function LifeDomainBalanceDetails({
  data,
  predictions,
  lowestDomain,
  highestDomain,
  needsAttentionCount,
  insight,
}: LifeDomainBalanceDetailsProps) {
  const { t } = useTranslation("insights");

  return (
    <>
      <ScrollView className="px-6 pb-4 max-h-48">
        <Text variant="label-bold" className="mb-3">{t("lifeBalance.breakdown")}</Text>
        {data.map((domain, i) => (
          <View key={i} className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center flex-1">
                <Text variant="body" className="text-lg mr-2">{DOMAIN_ICONS[domain.domain]}</Text>
                <Text variant="body" className="font-medium">{translateLifeDomain(t, domain.domain)}</Text>
                <Text variant="body" className="ml-2">{domain.trend === "improving" ? "↗️" : domain.trend === "declining" ? "↘️" : "→"}</Text>
                {domain.attention_needed && <View className="ml-2 bg-red-100 px-2 py-0.5 rounded-full"><Text variant="caption-muted" className="text-red-700 font-medium">{t("lifeBalance.needsAttention")}</Text></View>}
              </View>
              <Text variant="label-bold">{domain.score}%</Text>
            </View>
              <View className="bg-gray-200 rounded-full h-2 overflow-hidden"><View className="h-full rounded-full" style={{ width: `${domain.score}%`, backgroundColor: DOMAIN_COLORS[domain.domain] }} /></View>
            {domain.insights && <Text variant="caption-muted" className="mt-1">{domain.insights}</Text>}
          </View>
        ))}
      </ScrollView>

      <View className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Text variant="label-bold" className="mb-2">{t("lifeBalance.keyInsights")}</Text>
        <View className="space-y-2">
          {lowestDomain && <InsightBullet color="red" text={<><Text variant="label-bold">{translateLifeDomain(t, lowestDomain.domain)}</Text>{" "}{String(t("lifeBalance.lowestDomain", { score: lowestDomain.score }))}</>} />}
          {highestDomain && <InsightBullet color="green" text={<><Text variant="label-bold">{translateLifeDomain(t, highestDomain.domain)}</Text>{" "}{String(t("lifeBalance.highestDomain", { score: highestDomain.score }))}</>} />}
          {needsAttentionCount > 1 && <InsightBullet color="orange" text={String(t("lifeBalance.multipleNeedsAttention", { count: needsAttentionCount }))} />}
        </View>
      </View>

      {insight && <View className="px-6 py-4 bg-purple-50 border-t border-purple-100"><View className="flex-row items-start"><Text variant="body" className="text-lg mr-2">🎯</Text><View className="flex-1"><Text variant="label-bold" className="text-purple-900 mb-1">{t("lifeBalance.recommendation")}</Text><Text variant="body" className="text-purple-700">{insight}</Text></View></View></View>}

      <View className="px-6 py-4 border-t border-gray-100">
        <Text variant="label-bold" className="mb-2">{t("lifeBalance.nextMonthPrediction")}</Text>
        <View className="bg-sage-50 rounded-lg p-3"><View className="flex-row flex-wrap">{predictions.map((prediction, i) => <View key={i} className="flex-row items-center mr-4 mb-2"><Text variant="caption-muted" className="font-medium text-gray-700">{translateLifeDomain(t, prediction.domain).split("/")[0]}:</Text><View className="flex-row items-center ml-1"><Feather name={prediction.trend === "improving" ? "trending-up" : prediction.trend === "declining" ? "trending-down" : "minus"} size={12} color={prediction.trend === "improving" ? "#10B981" : prediction.trend === "declining" ? "#EF4444" : "#6B7280"} /><Text variant="caption-muted" className="ml-1 font-semibold">{prediction.predicted}%</Text></View></View>)}</View></View>
      </View>
    </>
  );
}

function InsightBullet({ color, text }: { color: "red" | "green" | "orange"; text: ReactNode }) {
  const dotColor = { red: "#F87171", green: "#4ADE80", orange: "#FB923C" }[color];
  return <View className="flex-row items-start"><View className="w-2 h-2 rounded-full mt-1.5 mr-2" style={{ backgroundColor: dotColor }} /><Text variant="body" className="flex-1">{text}</Text></View>;
}
