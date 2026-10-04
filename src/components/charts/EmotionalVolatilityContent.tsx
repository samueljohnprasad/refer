import React, { useMemo } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CartesianChart, Line, Area } from "victory-native-v4";
import { Circle, useFont } from "@shopify/react-native-skia";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { EmotionalVolatilityData } from "@/src/network/genAi";
import { APP_FONT_ASSETS } from "@/src/theme/typography";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Tooltip, TooltipContent, TooltipText } from "@/src/components/ui/tooltip";

interface VolatilityStats {
  avg: number;
  trend: "increasing" | "decreasing" | "stable";
  maxVolatility: number;
}

interface ChartPoint {
  x: number;
  y: number;
  date: Date;
  label: string;
  stability: EmotionalVolatilityData["stability"];
  triggers: string[];
  swings: number;
  range: number;
}

interface EmotionalVolatilityContentProps {
  data: EmotionalVolatilityData[];
  insight?: string;
  stats: VolatilityStats;
}

const stabilityColors: Record<EmotionalVolatilityData["stability"], string> = {
  stable: "#10B981",
  moderate: "#F59E0B",
  volatile: "#EF4444",
  highly_volatile: "#991B1B",
};

export function EmotionalVolatilityContent({ data, insight, stats }: EmotionalVolatilityContentProps) {
  const { t, i18n } = useTranslation("insights");
  const font = useFont(APP_FONT_ASSETS.regular, 10);
  const chartData = useMemo<ChartPoint[]>(() => data.map((entry, index) => ({
    x: index,
    y: entry.volatilityScore,
    date: parseISO(entry.date),
    label: `${entry.volatilityScore}`,
    stability: entry.stability,
    triggers: entry.triggers,
    swings: entry.moodSwings,
    range: entry.emotionalRange,
  })), [data]);
  const stabilityZones = [
    { y0: 0, y1: 25, color: "rgba(16, 185, 129, 0.1)" },
    { y0: 25, y1: 50, color: "rgba(245, 158, 11, 0.1)" },
    { y0: 50, y1: 75, color: "rgba(239, 68, 68, 0.1)" },
    { y0: 75, y1: 100, color: "rgba(153, 27, 27, 0.1)" },
  ];
  const chartWidth = Dimensions.get("window").width;
  const lastStatus = data[data.length - 1]?.stability ?? "stable";
  const trendLabel = stats.trend === "increasing"
    ? t("volatility.rising")
    : stats.trend === "decreasing" ? t("volatility.improving") : t("volatility.stable");

  return (
    <Card variant="tile" className="p-0 overflow-hidden">
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center"><Text variant="h2">{t("volatility.title")}</Text><Tooltip placement="top" trigger={(props) => <Pressable {...props} className="ml-2"><Feather name="info" size={16} color="#7B61FF" /></Pressable>}><TooltipContent className="max-w-xs z-50"><TooltipText className="text-white"><Text className="font-bold">{t("volatility.howCalculated")}: {"\n\n"}</Text><Text>• {t("volatility.volatilityScore")}: {t("volatility.volatilityScoreHelp")}{"\n"}</Text><Text>• {t("volatility.moodSwings")}: {t("volatility.moodSwingsHelp")}{"\n"}</Text><Text>• {t("volatility.emotionalRange")}: {t("volatility.emotionalRangeHelp")}{"\n"}</Text><Text>• {t("volatility.stabilityZones")}{"\n\n"}</Text><Text className="font-bold">{t("volatility.lowerScores")}</Text></TooltipText></TooltipContent></Tooltip></View>
            <Text variant="caption-muted" className="mt-1">{t("volatility.description")}</Text>
          </View>
          <View className="items-end"><Text variant="h2">{stats.avg.toFixed(0)}</Text><Text variant="caption-muted">{t("volatility.averageScore")}</Text></View>
        </View>
      </View>

      <View className="flex-row justify-around px-5 py-3 bg-gray-50 border-y border-gray-100">
        <View className="items-center flex-1"><Text variant="label-bold">{trendLabel}</Text><Text variant="caption-muted" className="mt-1">{t("volatility.trend")}</Text></View>
        <View className="w-px bg-gray-300" />
        <View className="items-center flex-1"><Text variant="label-bold">{t(`volatility.stability.${lastStatus}`)}</Text><Text variant="caption-muted" className="mt-1">{t("volatility.currentState")}</Text></View>
        <View className="w-px bg-gray-300" />
        <View className="items-center flex-1"><Text variant="label-bold">{stats.maxVolatility}</Text><Text variant="caption-muted" className="mt-1">{t("volatility.peakScore")}</Text></View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white">
        <View className="py-3" style={{ width: Math.max(chartWidth, chartData.length * 90), paddingHorizontal: 20, height: 280 }}>
          {!font ? <View className="items-center justify-center flex-1"><ActivityIndicator size="small" color="#7B61FF" /><Text variant="caption-muted" className="mt-2">{t("volatility.loadingChart")}</Text></View> : (
            <CartesianChart data={chartData} xKey="x" yKeys={["y"]} domainPadding={{ left: 50, right: 50, top: 30, bottom: 50 }} axisOptions={{ font, tickCount: { x: chartData.length, y: 5 }, formatXLabel: (value: number) => { const point = chartData[Math.round(value)]; return point ? new Intl.DateTimeFormat(i18n.language, { month: "short", day: "numeric" }).format(point.date) : ""; }, formatYLabel: (value: number) => `${Math.round(value)}`, labelColor: "#6B7280", labelPosition: { x: "outset", y: "outset" }, axisSide: { x: "bottom", y: "left" } }}>
              {({ points, chartBounds }: any) => <>
                {stabilityZones.map((zone, index) => <Area key={`zone-${index}`} points={[{ x: chartBounds.left, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y0 / 100 }, { x: chartBounds.right, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y0 / 100 }, { x: chartBounds.right, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y1 / 100 }, { x: chartBounds.left, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y1 / 100 }]} color={zone.color} opacity={1} />)}
                <Area points={points.y} y0={chartBounds.bottom} color="#7B61FF" opacity={0.3} curveType="catmullRom" />
                <Line points={points.y} color="#7B61FF" strokeWidth={2} curveType="catmullRom" />
                {points.y.map((point: any, index: number) => { const datum = chartData[index]; const color = stabilityColors[datum.stability]; const size = datum.y > 75 ? 6 : datum.y > 50 ? 5 : 4; return <React.Fragment key={`point-${index}`}><Circle cx={point.x} cy={point.y} r={size + 1} color="white" /><Circle cx={point.x} cy={point.y} r={size} color={color} /></React.Fragment>; })}
              </>}
            </CartesianChart>
          )}
        </View>
      </ScrollView>

      <View className="px-5 py-3 bg-white border-t border-gray-100"><View className="flex-row flex-wrap justify-center gap-3">{(Object.keys(stabilityColors) as EmotionalVolatilityData["stability"][]).map((key) => <View key={key} className="flex-row items-center"><View style={{ backgroundColor: stabilityColors[key] }} className="w-2.5 h-2.5 rounded-full mr-1.5" /><Text variant="caption-muted">{t(`volatility.stability.${key}`) as string}</Text></View>)}</View></View>
      {insight && <View className="px-5 py-3 bg-purple-50 border-t border-gray-100"><View className="flex-row items-start"><Text className="text-lg mr-2">💡</Text><View className="flex-1"><Text variant="label-bold" className="text-purple-900 mb-1">{t("volatility.aiInsight")}</Text><Text variant="body" className="text-purple-700">{insight}</Text></View></View></View>}
      {data.some((entry) => entry.triggers.length > 0) && <View className="px-5 py-3 bg-white border-t border-gray-100"><Text variant="label-bold" className="mb-2">{t("volatility.commonTriggers")}</Text>{Array.from(new Set(data.flatMap((entry) => entry.triggers))).slice(0, 3).map((trigger) => <View key={trigger} className="flex-row items-center mb-1.5"><View className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2" /><Text variant="body" className="flex-1">{trigger}</Text></View>)}</View>}
    </Card>
  );
}
